import { useBlocks, useBoardStore, useCurrentLayer } from 'store/board';
import {
  BLOCK_BASE,
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  MAX_BLOCKS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from 'utils/constants';
import AddSvg from 'vectors/add.svg';
import AlignHorizontalSvg from 'vectors/align-horizontal.svg';
import AlignVerticalSvg from 'vectors/align-vertical.svg';
import CarouselSvg from 'vectors/carousel.svg';
import RotateSvg from 'vectors/rotate.svg';
import { Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';

export function Controls() {
  const { stageRef, selected, setSelected } = useKonvaContext()!;

  const { currentLayerIndex, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();
  const currentLayer = useCurrentLayer();

  const stageWidthIncMargin = STAGE_WIDTH + currentLayer.collarMargin;
  const stageHeightIncMargin = STAGE_HEIGHT + currentLayer.collarMargin;

  function onAddBlock() {
    const newBlock = {
      ...BLOCK_BASE,
      order: blocks.length + 1,
    };

    const newLayers = [...layers];
    const newLayerBlocks = [...blocks, newBlock];
    newLayers[currentLayerIndex].blocks = newLayerBlocks;

    setLayers(newLayers);
    setSelected(newLayerBlocks.length - 1);
  }

  function onSplitEvenly() {}

  function onAlignVertical() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected}`;
    const el = stageRef.current.find(groupId)[0];
    const isRotatedEl = blocks[selected].rotated;

    let yPos = stageHeightIncMargin / 2 - BLOCK_HEIGHT / 2;
    if (isRotatedEl) {
      yPos = stageHeightIncMargin / 2 - BLOCK_WIDTH / 2;
    }

    el.position({
      x: el.x(),
      y: yPos,
    });

    stageRef.current.batchDraw();
  }

  function onAlignHorizontal() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected}`;
    const el = stageRef.current.find(groupId)[0];
    const isRotatedEl = blocks[selected].rotated;

    let xPos = stageWidthIncMargin / 2 - BLOCK_WIDTH / 2;
    if (isRotatedEl) {
      xPos = stageWidthIncMargin / 2 - BLOCK_HEIGHT / 2;
    }

    el.position({
      x: xPos,
      y: el.y(),
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
    <div className="w-full absolute top-0 right-0 left-0 z-20 flex gap-2 p-2 bg-white shadow-md">
      <Button
        onClick={onAddBlock}
        disabled={blocks.length === MAX_BLOCKS}
        isIconOnly
      >
        <AddSvg className="w-8 h-8" />
      </Button>

      <Button
        onClick={onSplitEvenly}
        disabled={selected === null}
        isIconOnly
      >
        <CarouselSvg className="w-8 h-8" />
      </Button>

      <Button
        onClick={onAlignVertical}
        disabled={selected === null}
        isIconOnly
      >
        <AlignVerticalSvg className="w-8 h-8" />
      </Button>

      <Button
        onClick={onAlignHorizontal}
        disabled={selected === null}
        isIconOnly
      >
        <AlignHorizontalSvg className="w-8 h-8" />
      </Button>

      <Button
        onClick={onRotate}
        disabled={selected === null}
        isIconOnly
      >
        <RotateSvg className="w-8 h-8" />
      </Button>
    </div>
  );
}
