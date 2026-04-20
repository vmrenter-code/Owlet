import * as FileSystem from 'expo-file-system/legacy';

export interface PresignUploadRequest {
	screeningId: string;
	videoNumber: number;
	contentType: string;
}

export interface PresignUploadResponse {
	success: boolean;
	uploadUrl: string;
	objectKey: string;
	bucketName: string;
	expiresInSeconds: number;
}

export interface UploadVideoInput {
	baseUrl: string;
	screeningId: string;
	videoNumber: number;
	recordingUri: string;
	contentType?: string;
}

export interface UploadVideoResult {
	success: boolean;
	objectKey?: string;
	error?: string;
}
// sends  a post to request a presigned url, then reads the video file 
export async function requestPresignedUploadUrl(
	baseUrl: string,
	body: PresignUploadRequest
): Promise<PresignUploadResponse> {
	const response = await fetch(`${baseUrl}/screening/upload-url`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`Failed to get upload URL: ${response.status}`);
	}

	const data = (await response.json()) as PresignUploadResponse;
	if (!data.success || !data.uploadUrl) {
		throw new Error('Invalid presigned URL response');
	}

	return data;
}
// this sends a put which uploads the file to s3 using the url, content type, and file uri
export async function uploadFileToPresignedUrl(
	uploadUrl: string,
	contentType: string,
	fileUri: string
): Promise<void> {
	const uploadResult = await FileSystem.uploadAsync(uploadUrl, fileUri, {
		httpMethod: 'PUT',
		uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
		headers: {
			'Content-Type': contentType,
		},
	});

	if (uploadResult.status < 200 || uploadResult.status > 299) {
		throw new Error(`S3 upload failed: ${uploadResult.status}`);
	}
}
////this uses the above two functions to request a presigned url and then upload the file, returning the object key or an error message
export async function uploadScreeningVideo(input: UploadVideoInput): Promise<UploadVideoResult> {
	try {
		const contentType = input.contentType ?? 'video/mp4';

		const presign = await requestPresignedUploadUrl(input.baseUrl, {
			screeningId: input.screeningId,
			videoNumber: input.videoNumber,
			contentType,
		});

		const fileInfo = await FileSystem.getInfoAsync(input.recordingUri);
		if (!fileInfo.exists) {
			throw new Error('Recording file does not exist');
		}

		await uploadFileToPresignedUrl(presign.uploadUrl, contentType, input.recordingUri);

		return {
			success: true,
			objectKey: presign.objectKey,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown upload error';
		return {
			success: false,
			error: message,
		};
	}
}

