import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Stage } from 'react-konva';

import { getTheme } from 'utils';
import { BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

import { Blocks } from './Blocks';
import { Controls } from './Controls';
import { Grid } from './Grid';
import { KonvaContext } from './KonvaContext';
import { Layers } from './Layers';
import { Pallet } from './Pallet';

const theme = getTheme();

function Canvas() {
  const [selected, setSelected] = useState<number | null>(null);

  const blockLayerRef = useRef<any | null>(null);
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  function onCollision(event: KonvaEventObject<DragEvent>) {
    const target = event.target;
    const targetRect = event.target.getClientRect();

    function areElementsIntersecting(r1: any, r2: any) {
      return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
      );
    }

    blockLayerRef.current.children.forEach((group: any) => {
      // Do not check intersection with itself
      if (group === target) return;

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
        <Grid />

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

export default Canvas;
