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

// @TODO use and change order on blocks
// @TODO change margin per layer (add collarMargin to AddNewLayerModal, now it's 0)
// @TODO fix rotation in 4 steps
// @TODO split evenly horizontal (multiple selected blocks)

function Canvas() {
  const currentLayer = useCurrentLayer();
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
          width={STAGE_WIDTH + currentLayer.collarMargin}
          height={STAGE_HEIGHT + currentLayer.collarMargin}
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
