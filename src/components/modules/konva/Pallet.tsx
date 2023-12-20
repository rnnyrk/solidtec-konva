import { useRef } from 'react';
import { Rect } from 'react-konva';
import useImage from 'use-image';

export function Pallet({ stageHeight, stageWidth }: PalletProps) {
  const [palletImage] = useImage('/images/pallet-top.png');
  const palletRef = useRef<any | null>(null);

  const originalImageHeight = 361;
  const originalImageWidth = 542;

  const scaleY = stageHeight / originalImageHeight;
  const scaleX = stageWidth / originalImageWidth;
  const scale = Math.max(scaleX, scaleY);

  return (
    <Rect
      ref={palletRef}
      fillPatternImage={palletImage}
      width={stageWidth}
      height={stageHeight}
      fillPatternScaleX={scale}
      fillPatternScaleY={scale}
    />
  );
}

type PalletProps = {
  stageHeight: number;
  stageWidth: number;
};
