import { useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import { useCurrentLayer } from 'store/board';
import { getTheme } from 'utils';
import { BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

import { Blocks } from './Blocks';
import { Controls } from './Controls';
// import { Grid } from './Grid';
import { KonvaContext } from './KonvaContext';
import { Pallet } from './Pallet';
import { Sidebar } from './Sidebar';

const theme = getTheme();

// Use selected instead of blocks in split evenly

// @TODO split evenly horizontal 3 > blocks
// @TODO duplicate layers with rotation

// @TODO configuration
// @TODO arrow for side of entering the canvas

// @TODO legenda with cm to inch based on BLOCK_SIZE
// @TODO write down offset on x,y when rotating
// then use that to calculate final x,y after save

function Canvas() {
  const currentLayer = useCurrentLayer();
  const [selected, setSelected] = useState<number[] | null>(null);

  const blockLayerRef = useRef<any | null>(null);
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  const collarMargin = currentLayer.collarMargin * 2;

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

          <Layer ref={blockLayerRef}>
            <Blocks />
          </Layer>
        </Stage>
      </div>
    </KonvaContext.Provider>
  );
}

export default Canvas;
