import { useRef } from 'react';
import { Rect } from 'react-konva';
import useImage from 'use-image';

import { STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

export function Pallet({ layerMargin }: PalletProps) {
  const [palletImage] = useImage('/images/pallet-top.png');
  const palletRef = useRef<any | null>(null);

  const originalImageHeight = 361;
  const originalImageWidth = 542;

  const scaleY = STAGE_HEIGHT / originalImageHeight;
  const scaleX = STAGE_WIDTH / originalImageWidth;
  const scale = Math.max(scaleX, scaleY);

  const imageWidth = originalImageWidth * scaleX;
  const imageHeight = originalImageHeight * scaleY;
  const stageWidthIncMargin = STAGE_WIDTH + layerMargin;
  const stageHeightIncMargin = STAGE_HEIGHT + layerMargin;

  const xCenter = (stageWidthIncMargin - imageWidth) / 2;
  const yCenter = (stageHeightIncMargin - imageHeight) / 2;

  return (
    <Rect
      ref={palletRef}
      fillPatternImage={palletImage}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      x={xCenter}
      y={yCenter}
      fillPatternScaleX={scale}
      fillPatternScaleY={scale}
    />
  );
}

type PalletProps = {
  layerMargin: number;
};
