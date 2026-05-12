import { Svg, Path, Circle } from 'react-native-svg';

type Props = {
  childId: string;
  /** Outer diameter (matches circle artwork). Default 56 for switcher sheet. */
  size?: number;
};

function Heart({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#FDE7EC" />
      <Path
        d="M28 40s-12-7.2-12-16a7.5 7.5 0 0 1 13.5-4.5L28 21l-1.5-1.5A7.5 7.5 0 0 1 40 24c0 8.8-12 16-12 16z"
        fill="#E63956"
      />
    </Svg>
  );
}

function Star({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#FFF6D6" />
      <Path
        d="M28 14l3.95 8.45 9.05 1.05-6.7 6.4 1.8 9.1L28 34.7l-8.1 4.3 1.8-9.1-6.7-6.4 9.05-1.05L28 14z"
        fill="#F5B400"
      />
    </Svg>
  );
}

function Diamond({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={26} fill="#E3F4FF" />
      <Path d="M28 12l14 16-14 16-14-16z" fill="#3FB6F0" />
    </Svg>
  );
}

export default function ChildProfileAvatar({ childId, size = 56 }: Props) {
  switch (childId) {
    case 'babyy':
      return <Heart size={size} />;
    case 'baby2':
      return <Star size={size} />;
    case 'baby3':
      return <Diamond size={size} />;
    default:
      return <Star size={size} />;
  }
}
