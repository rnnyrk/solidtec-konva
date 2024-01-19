import type * as i from 'types';

import { useCurrentLayer } from 'store/board';
import { BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

export function useBoundingBox() {
  const currentLayer = useCurrentLayer();

  function getBoundingBox({ pos, rotated }: GetBoundingBoxProps) {
    const stageWidthIncMargin = STAGE_WIDTH + currentLayer.collarMargin;
    const stageHeightIncMargin = STAGE_HEIGHT + currentLayer.collarMargin;

    let newXPos = pos.x;
    let newYPos = pos.y;

    let effectiveWidth = BLOCK_WIDTH;
    let effectiveHeight = BLOCK_HEIGHT;

    // Determine if the rectangle is in a vertical orientation (90 or 270 degrees)
    const isVertical = rotated === 90 || rotated === 270;

    if (isVertical) {
      effectiveWidth = BLOCK_HEIGHT;
      effectiveHeight = BLOCK_WIDTH;
    }

    // 0 degrees is the default
    let minX: number = 0;
    let maxX: number = stageWidthIncMargin - effectiveWidth;
    let minY: number = 0;
    let maxY: number = stageHeightIncMargin - effectiveHeight;

    // Calculate the bounds based on rotation
    if (rotated === 90) {
      minX = effectiveWidth;
      maxX = stageWidthIncMargin;
      minY = 0;
      maxY = stageHeightIncMargin - effectiveHeight;
    } else if (rotated === 180) {
      minX = effectiveWidth;
      maxX = stageWidthIncMargin;
      minY = effectiveHeight;
      maxY = stageHeightIncMargin;
    } else if (rotated === 270) {
      minX = 0;
      maxX = stageWidthIncMargin - effectiveWidth;
      minY = effectiveHeight;
      maxY = stageHeightIncMargin;
    }

    // Apply constraints
    newXPos = Math.max(minX, Math.min(newXPos, maxX));
    newYPos = Math.max(minY, Math.min(newYPos, maxY));

    return {
      x: newXPos,
      y: newYPos,
    };
  }

  return {
    getBoundingBox,
  };
}

type GetBoundingBoxProps = {
  rotated: i.Block['rotated'];
  pos: { x: number; y: number };
};
