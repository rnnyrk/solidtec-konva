import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Stage } from 'react-konva';

import { useCurrentLayer } from 'store/board';
import { getTheme } from 'utils';
import { BLOCK_HEIGHT, BLOCK_SIZE, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

import { Blocks } from './Blocks';
import { Controls } from './Controls';
// import { Grid } from './Grid';
import { KonvaContext } from './KonvaContext';
import { Legend } from './Legend';
import { Pallet } from './Pallet';
import { Sidebar } from './Sidebar';

const theme = getTheme();

// @TODO Use selected instead of blocks in split evenly

// @TODO configuration
// @TODO arrow for side of entering the canvas

// @TODO legenda also in inches
// @TODO use Notion offset to calculate final x,y after save

function Canvas() {
  const currentLayer = useCurrentLayer();
  const [selected, setSelected] = useState<number[] | null>(null);

  const blockLayerRef = useRef<any | null>(null);
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  const collarMargin = currentLayer.collarMargin * 2;

  function onCollision(event: KonvaEventObject<DragEvent>) {
    const target = event.target;
    const targetRect = event.target.getClientRect();

    function elementIntersectingCheck(r1: ClientRect, r2: ClientRect) {
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
    }

    blockLayerRef.current.children.forEach((group: any) => {
      // Do not check intersection with itself
      if (group === target) return;

      const groupRect = group.getClientRect({ stroke: true });
      const intersectingElement = group.children[1];

      if (elementIntersectingCheck(groupRect, targetRect)) {
        intersectingElement.fill('yellow');
      } else {
        intersectingElement.fill('transparent');
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
      <Sidebar />
      <Controls />

      <div className="relative">
        <Legend />
        <Stage
          width={STAGE_WIDTH + collarMargin}
          height={STAGE_HEIGHT + collarMargin}
          ref={stageRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: `2px solid ${theme.colors.primaryDark}`,
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
      </div>
    </KonvaContext.Provider>
  );
}

type ClientRect = { x: number; y: number; width: number; height: number };

export default Canvas;
