import { useRef } from 'react';
import { Rect } from 'react-konva';
import useImage from 'use-image';

import { STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

export function Pallet() {
  const [palletImage] = useImage('/images/pallet-top.png');
  const palletRef = useRef<any | null>(null);

  const originalImageHeight = 361;
  const originalImageWidth = 542;

  const scaleY = STAGE_HEIGHT / originalImageHeight;
  const scaleX = STAGE_WIDTH / originalImageWidth;
  const scale = Math.max(scaleX, scaleY);

  return (
    <Rect
      ref={palletRef}
      fillPatternImage={palletImage}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      fillPatternScaleX={scale}
      fillPatternScaleY={scale}
    />
  );
}
