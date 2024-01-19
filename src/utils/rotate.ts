import type * as i from 'types';
import Konva from 'konva/lib';
import { Node } from 'konva/lib/Node';

const rotatePoint = ({ x, y }: { x: number; y: number }, rad: number) => {
  const rcos = Math.cos(rad);
  const rsin = Math.sin(rad);

  return {
    x: x * rcos - y * rsin,
    y: y * rcos + x * rsin,
  };
};

// https://konvajs.org/docs/posts/Position_vs_Offset.html
// Will work for shapes with top-left origin, like rectangle
export function rotateAroundCenter(node: Node, rotation: i.Block['rotated']) {
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
  node.x(node.x() + dx);
  node.y(node.y() + dy);
}
