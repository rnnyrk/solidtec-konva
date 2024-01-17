import { useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import { getTheme } from 'utils';
import { BLOCK_HEIGHT, BLOCK_SIZE, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

import { Blocks } from './Blocks';
import { Controls } from './Controls';
// import { Grid } from './Grid';
import { KonvaContext } from './KonvaContext';
import { Pallet } from './Pallet';
import { Sidebar } from './Sidebar';

const theme = getTheme();

// @TODO use and change order on blocks
// @TODO fix bounding box with margin
// @TODO change margin per layer
// @TODO fix rotation in 4 steps
const MARGIN = BLOCK_SIZE * 6;

function Canvas() {
  const [selected, setSelected] = useState<number | null>(null);

  const blockLayerRef = useRef<any | null>(null);
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

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
        <Stage
          width={STAGE_WIDTH + MARGIN}
          height={STAGE_HEIGHT + MARGIN}
          ref={stageRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: theme.colors.solidtecBlack,
          }}
        >
          {/* <Grid /> */}
          <Layer>
            <Pallet layerMargin={MARGIN} />
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

          <Layer ref={blockLayerRef}>
            <Blocks />
          </Layer>
        </Stage>
      </div>
    </KonvaContext.Provider>
  );
}

export default Canvas;
