import { useRef } from 'react';
import { Rect } from 'react-konva';
import useImage from 'use-image';

export function Pallet({ blockSize }: PalletProps) {
  const [palletImage] = useImage('/images/pallet-top.png');
  const palletRef = useRef<any | null>(null);

  return (
    <Rect
      ref={palletRef}
      fillPatternImage={palletImage}
      width={blockSize * 36}
      height={blockSize * 24}
      // fillPatternScale={{ x: 1.2, y: 1.2 }}
      // x={blockSize * 30}
      // y={blockSize * 15}
    />
  );
}

type PalletProps = {
  blockSize: number;
};
