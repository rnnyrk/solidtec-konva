import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Stage } from 'react-konva';

import { getTheme } from 'utils';
import { BLOCK_HEIGHT, BLOCK_SIZE, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

import { Blocks } from './Blocks';
import { Controls } from './Controls';
// import { Grid } from './Grid';
import { KonvaContext } from './KonvaContext';
import { Layers } from './Layers';
import { Pallet } from './Pallet';

const theme = getTheme();

// @TODO keyboard controls +1 -1
// @TODO use and change order on blocks

function Canvas() {
  const [selected, setSelected] = useState<number | null>(null);

  const blockLayerRef = useRef<any | null>(null);
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  function onCollision(event: KonvaEventObject<DragEvent>) {
    const target = event.target;
    const targetRect = event.target.getClientRect();

    // @TODO BLOCK_SIZE margin on collision
    // @TODO debug collision because it seems to be broken when duplicating blocks

    // function isPointInsideRect(point, rect) {
    //   return (
    //     point.x >= rect.x &&
    //     point.x <= rect.x + rect.width &&
    //     point.y >= rect.y &&
    //     point.y <= rect.y + rect.height
    //   );
    // }

    function areElementsIntersecting(r1: ClientRect, r2: ClientRect) {
      const shrunkR1 = {
        x: r1.x + BLOCK_SIZE,
        y: r1.y + BLOCK_SIZE,
        width: r1.width - BLOCK_SIZE * 2,
        height: r1.height - BLOCK_SIZE * 2,
      };

      // Check if the shrunk r1 intersects with r2
      return !(
        shrunkR1.x > r2.x + r2.width ||
        shrunkR1.x + shrunkR1.width < r2.x ||
        shrunkR1.y > r2.y + r2.height ||
        shrunkR1.y + shrunkR1.height < r2.y
      );

      // Adjust the collision box to be smaller so we have an offset one time as the BLOCK_SIZE
      // const inflatedR2 = {
      //   x: r2.x + BLOCK_SIZE,
      //   y: r2.y + BLOCK_SIZE,
      //   width: r2.width - BLOCK_SIZE * 2,
      //   height: r2.height - BLOCK_SIZE * 2,
      // };

      // return (
      //   isPointInsideRect({ x: r1.x, y: r1.y }, inflatedR2) ||
      //   isPointInsideRect({ x: r1.x + r1.width, y: r1.y }, inflatedR2) ||
      //   isPointInsideRect({ x: r1.x, y: r1.y + r1.height }, inflatedR2) ||
      //   isPointInsideRect({ x: r1.x + r1.width, y: r1.y + r1.height }, inflatedR2)
      // );

      // console.log({
      //   r2YStart: r2.y - BLOCK_SIZE,
      //   r2YEnd: r2.y - BLOCK_SIZE + r2.height,
      //   r1YStart: r1.y,
      //   r1YEnd: r1.y + (r1.height - BLOCK_SIZE * 2),

      //   check1: r2.y - BLOCK_SIZE > r1.y + (r1.height - BLOCK_SIZE * 2),
      //   check2: r2.y - BLOCK_SIZE + r2.height < r1.y,
      // });

      // if the block is rotated fix the collision on the y axis
      // if (r2.height === BLOCK_WIDTH) {
      //   return !(
      //     r2.x - BLOCK_SIZE > r1.x + (r1.width - BLOCK_SIZE * 2) ||
      //     r2.x - BLOCK_SIZE + r2.width < r1.x ||
      //     r2.y - BLOCK_SIZE > r1.y + (r1.height - BLOCK_SIZE * 2) ||
      //     r2.y - BLOCK_SIZE + r2.height < r1.y
      //   );
      // }

      // return !(
      //   r2.x - BLOCK_SIZE > r1.x + (r1.width - BLOCK_SIZE * 2) ||
      //   r2.x - BLOCK_SIZE + r2.width < r1.x ||
      //   r2.y - BLOCK_SIZE > r1.y + (r1.height - BLOCK_SIZE * 2) ||
      //   r2.y - BLOCK_SIZE + r2.height < r1.y
      // );
    }

    blockLayerRef.current.children.forEach((group: any) => {
      if (group === target) return; // Do not check intersection with itself

      const groupRect = group.getClientRect({ stroke: true });
      if (areElementsIntersecting(groupRect, targetRect)) {
        group.children[0].fill('red');
      } else {
        group.children[0].fill('white');
      }
    });
  }

  return (
    <KonvaContext.Provider
      value={{
        stageRef,
        shadowRef,
        selected,
        setSelected,
      }}
    >
      <Layers />
      <Controls />

      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        ref={stageRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* <Grid /> */}
        <Layer>
          <Pallet />
          <Rect
            ref={shadowRef}
            x={0}
            y={0}
            width={BLOCK_WIDTH}
            height={BLOCK_HEIGHT}
            fill={theme.colors.primaryAccent}
            opacity={0.6}
            visible={false}
          />
        </Layer>

        <Layer
          ref={blockLayerRef}
          onDragEnd={onCollision}
        >
          <Blocks />
        </Layer>
      </Stage>
    </KonvaContext.Provider>
  );
}

type ClientRect = { x: number; y: number; width: number; height: number };

export default Canvas;
