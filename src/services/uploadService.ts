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
	if (!body.screeningId) {
		throw new Error('Missing screeningId for upload request');
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);

	console.log('[Upload] Requesting presigned URL...', {
		baseUrl,
		screeningId: body.screeningId,
		videoNumber: body.videoNumber,
		contentType: body.contentType,
	});

	let response: Response;
	try {
		response = await fetch(`${baseUrl}/screening/upload-url`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			signal: controller.signal,
			body: JSON.stringify(body),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(`Timed out contacting backend at ${baseUrl}`);
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}

	console.log('[Upload] Presigned URL response status:', response.status);

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
	console.log('[Upload] Starting S3 PUT upload...', {
		contentType,
		fileUri,
	});

	const localFileResponse = await fetch(fileUri);
	console.log('[Upload] Local file fetch status:', localFileResponse.status);
	if (!localFileResponse.ok) {
		throw new Error(`Failed to read local recording file: ${localFileResponse.status}`);
	}

	const fileBlob = await localFileResponse.blob();
	console.log('[Upload] Local file blob prepared', {
		size: fileBlob.size,
		type: fileBlob.type,
	});

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 120000);

	let uploadResponse: Response;
	try {
		uploadResponse = await fetch(uploadUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': contentType,
			},
			body: fileBlob,
			signal: controller.signal,
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('S3 upload timed out after 120 seconds');
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}

	console.log('[Upload] S3 PUT status:', uploadResponse.status);

	if (!uploadResponse.ok) {
		const errorText = await uploadResponse.text();
		throw new Error(`S3 upload failed: ${uploadResponse.status} ${errorText}`);
	}
}
////this uses the above two functions to request a presigned url and then upload the file, returning the object key or an error message
export async function uploadScreeningVideo(input: UploadVideoInput): Promise<UploadVideoResult> {
	try {
		const contentType = input.contentType ?? 'video/mp4';
		console.log('[Upload] uploadScreeningVideo begin', {
			screeningId: input.screeningId,
			videoNumber: input.videoNumber,
			recordingUri: input.recordingUri,
			baseUrl: input.baseUrl,
		});

		const presign = await requestPresignedUploadUrl(input.baseUrl, {
			screeningId: input.screeningId,
			videoNumber: input.videoNumber,
			contentType,
		});

		console.log('[Upload] Presigned URL received', {
			objectKey: presign.objectKey,
			expiresInSeconds: presign.expiresInSeconds,
		});

		console.log('[Upload] Using recording URI', {
			recordingUri: input.recordingUri,
		});

		await uploadFileToPresignedUrl(presign.uploadUrl, contentType, input.recordingUri);
		console.log('[Upload] uploadScreeningVideo complete');

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

