import type * as i from 'types';
import Konva from 'konva/lib';
import { Node } from 'konva/lib/Node';

import { useCurrentLayer } from 'store/board';
import { BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

const rotatePoint = ({ x, y }: { x: number; y: number }, rad: number) => {
  const rcos = Math.cos(rad);
  const rsin = Math.sin(rad);

  return {
    x: x * rcos - y * rsin,
    y: y * rcos + x * rsin,
  };
};

export function useBoundingBox() {
  const currentLayer = useCurrentLayer();

  function getBoundingBox({ pos, rotation }: GetBoundingBoxProps) {
    const stageWidthIncMargin = STAGE_WIDTH + currentLayer.collarMargin;
    const stageHeightIncMargin = STAGE_HEIGHT + currentLayer.collarMargin;

    let newXPos = pos.x;
    let newYPos = pos.y;

    let effectiveWidth = BLOCK_WIDTH;
    let effectiveHeight = BLOCK_HEIGHT;

    // Determine if the rectangle is in a vertical orientation (90 or 270 degrees)
    const isVertical = rotation === 90 || rotation === 270;

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
    if (rotation === 90) {
      minX = effectiveWidth;
      maxX = stageWidthIncMargin;
      minY = 0;
      maxY = stageHeightIncMargin - effectiveHeight;
    } else if (rotation === 180) {
      minX = effectiveWidth;
      maxX = stageWidthIncMargin;
      minY = effectiveHeight;
      maxY = stageHeightIncMargin;
    } else if (rotation === 270) {
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

  // Based on: https://konvajs.org/docs/posts/Position_vs_Offset.html
  // Will work for shapes with top-left origin, like rectangle
  function rotateAroundCenter(node: Node, rotation: i.Block['rotation']) {
    // Current rotation origin (0, 0) relative to desired origin - center
    // (node.width()/2, node.height()/2)
    const topLeft = {
      x: -node.width() / 2,
      y: -node.height() / 2,
    };

    const current = rotatePoint(topLeft, Konva.getAngle(node.rotation()));
    const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));

    const dx = rotated.x - current.x;
    const dy = rotated.y - current.y;

    node.rotation(rotation);

    const pos = {
      x: node.x() + dx,
      y: node.y() + dy,
    };

    const { x: newXPos, y: newYPos } = getBoundingBox({ pos, rotation });

    node.x(newXPos);
    node.y(newYPos);

    return {
      x: newXPos,
      y: newYPos,
    };
  }

  return {
    getBoundingBox,
    rotateAroundCenter,
  };
}

type GetBoundingBoxProps = {
  rotation: i.Block['rotation'];
  pos: { x: number; y: number };
};
