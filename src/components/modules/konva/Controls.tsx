import { useBlocks, useBoardStore } from 'store/board';
import { BLOCK_BASE, BLOCK_HEIGHT, BLOCK_WIDTH, MAX_BLOCKS, STAGE_HEIGHT } from 'utils/constants';
import { Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';

export function Controls({ amountOfBlocks, selected }: ControlsProps) {
  const konvaContext = useKonvaContext();
  const stageRef = konvaContext?.stageRef;

  const { currentLayerIndex, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onAddBlock() {
    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = [...blocks, BLOCK_BASE];

    setLayers(newLayers);
  }

  function onAlignLeft() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected}`;
    const el = stageRef.current.find(groupId)[0];
    const isRotatedEl = blocks[selected].rotated;

    let yPos = STAGE_HEIGHT / 2 - BLOCK_HEIGHT / 2;
    if (isRotatedEl) {
      yPos = STAGE_HEIGHT / 2 - BLOCK_WIDTH / 2;
    }

    el.position({
      x: 0,
      y: yPos,
    });

    stageRef.current.batchDraw();
  }

  function onRotate() {
    if (!stageRef.current || selected === null) return;

    const groupEl = stageRef.current.find(`#group[${currentLayerIndex}]-${selected}`)[0];
    const textEl = stageRef.current.find(`#text[${currentLayerIndex}]-${selected}`)[0];
    const blockEl = stageRef.current.find(`#block[${currentLayerIndex}]-${selected}`)[0];

    const newBlocks = [...blocks];
    const currentBlock = newBlocks[selected];

    // Reset element to initial value or update to rotated value
    let newSizes = { width: BLOCK_WIDTH, height: BLOCK_HEIGHT };
    let rotated = currentBlock.rotated;

    if (rotated) {
      rotated = false;
    } else {
      // Flip width and height and set rotated
      rotated = true;
      newSizes = { width: BLOCK_HEIGHT, height: BLOCK_WIDTH };
    }

    groupEl.setAttrs({ ...newSizes });
    blockEl.setAttrs({ ...newSizes });
    textEl.setAttrs({
      ...newSizes,
      height: BLOCK_HEIGHT - 36,
    });

    // Update width and height of the block in store after rotating
    newBlocks[selected] = {
      ...currentBlock,
      ...newSizes,
      rotated,
    };

    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);

    stageRef.current.batchDraw();
  }

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col">
      <Button
        onClick={onAddBlock}
        disabled={amountOfBlocks === MAX_BLOCKS}
        size="xl"
        className="mb-2"
      >
        Add new
      </Button>
      <Button
        onClick={onRotate}
        disabled={selected === null}
        size="xl"
        className="mb-2"
      >
        Rotate
      </Button>
      <Button
        onClick={onAlignLeft}
        size="xl"
        disabled={selected === null}
      >
        Align left
      </Button>
    </div>
  );
}

type ControlsProps = {
  amountOfBlocks: number;
  selected: number | null;
};
