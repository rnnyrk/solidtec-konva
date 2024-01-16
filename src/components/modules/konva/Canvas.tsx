import { useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import { getTheme } from 'utils';
import { BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';

import { Blocks } from './Blocks';
import { Controls } from './Controls';
// import { Grid } from './Grid';
import { KonvaContext } from './KonvaContext';
import { Layers } from './Layers';
import { Pallet } from './Pallet';
import { Settings } from './Settings';

const theme = getTheme();

// @TODO use and change order on blocks

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
      <Layers />
      <Settings />
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

        <Layer ref={blockLayerRef}>
          <Blocks />
        </Layer>
      </Stage>
    </KonvaContext.Provider>
  );
}

export default Canvas;
