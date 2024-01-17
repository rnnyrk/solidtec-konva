import { useCurrentLayer } from 'store/board';
import { BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

export function useBoundingBox() {
  const currentLayer = useCurrentLayer();

  function getBoundingBox({ pos, isRotatedEl }: GetBoundingBoxProps) {
    const stageWidthIncMargin = STAGE_WIDTH + +currentLayer.collarMargin;
    const stageHeightIncMargin = STAGE_HEIGHT + +currentLayer.collarMargin;

    // Depending on the rotation, the bounding box is different
    let newXPos = pos.x;
    if (newXPos < 0) newXPos = 0;
    if (!isRotatedEl && newXPos > stageWidthIncMargin - BLOCK_WIDTH) {
      newXPos = stageWidthIncMargin - BLOCK_WIDTH;
    } else if (isRotatedEl && newXPos > stageWidthIncMargin - BLOCK_HEIGHT) {
      newXPos = stageWidthIncMargin - BLOCK_HEIGHT;
    }

    let newYPos = pos.y;
    if (newYPos < 0) newYPos = 0;
    if (!isRotatedEl && newYPos > stageHeightIncMargin - BLOCK_HEIGHT) {
      newYPos = stageHeightIncMargin - BLOCK_HEIGHT;
    } else if (isRotatedEl && newYPos > stageHeightIncMargin - BLOCK_WIDTH) {
      newYPos = stageHeightIncMargin - BLOCK_WIDTH;
    }

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
  isRotatedEl: boolean;
  pos: { x: number; y: number };
};
