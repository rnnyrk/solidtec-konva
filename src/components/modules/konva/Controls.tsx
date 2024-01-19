import { useBoundingBox, useModal } from 'hooks';
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
import ReoderSvg from 'vectors/reorder.svg';
import RotateSvg from 'vectors/rotate.svg';
import { btnClass, Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';
import { ReorderModal } from './modals/ReorderModal';

export function Controls() {
  const { stageRef, selected, setSelected } = useKonvaContext()!;
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  const { rotateAroundCenter } = useBoundingBox();
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

  function onAlignVertical() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected}`;
    const el = stageRef.current.find(groupId)[0];

    const rotation = el.rotation();
    let newYPos = el.y();

    // Determine if the rectangle is in a vertical orientation (90 or 270 degrees)
    const isVertical = rotation === 90 || rotation === 270;
    const effectiveHeight = isVertical ? BLOCK_WIDTH : BLOCK_HEIGHT;

    if (rotation === 0) {
      newYPos = (stageHeightIncMargin - effectiveHeight) / 2;
    } else if (rotation === 90) {
      newYPos = (stageHeightIncMargin - effectiveHeight) / 2;
    } else if (rotation === 180) {
      newYPos = (stageHeightIncMargin + effectiveHeight) / 2;
    } else if (rotation === 270) {
      newYPos = (stageHeightIncMargin + effectiveHeight) / 2;
    }

    el.position({
      x: el.x(),
      y: newYPos,
    });

    stageRef.current.batchDraw();
  }

  function onAlignHorizontal() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected}`;
    const el = stageRef.current.find(groupId)[0];

    const rotation = el.rotation();
    let newXPos = el.x();

    // Determine if the rectangle is in a vertical orientation (90 or 270 degrees)
    const isVertical = rotation === 90 || rotation === 270;
    const effectiveWidth = isVertical ? BLOCK_HEIGHT : BLOCK_WIDTH;

    if (rotation === 0) {
      newXPos = (stageWidthIncMargin - effectiveWidth) / 2;
    } else if (rotation === 90) {
      newXPos = (stageWidthIncMargin + effectiveWidth) / 2;
    } else if (rotation === 180) {
      newXPos = (stageWidthIncMargin + effectiveWidth) / 2;
    } else if (rotation === 270) {
      newXPos = (stageWidthIncMargin - effectiveWidth) / 2;
    }

    el.position({
      x: newXPos,
      y: el.y(),
    });

    stageRef.current.batchDraw();
  }

  function onRotate() {
    if (!stageRef.current || selected === null) return;

    const groupEl = stageRef.current.find(`#group[${currentLayerIndex}]-${selected}`)[0];
    // const textEl = stageRef.current.find(`#text[${currentLayerIndex}]-${selected}`)[0];
    // const blockEl = stageRef.current.find(`#block[${currentLayerIndex}]-${selected}`)[0];

    const newBlocks = [...blocks];
    const currentBlock = newBlocks[selected];

    let rotation = currentBlock.rotation;
    if (rotation === 0) {
      rotation = 90;
    } else if (rotation === 90) {
      rotation = 180;
    } else if (rotation === 180) {
      rotation = 270;
    } else if (rotation === 270) {
      rotation = 0;
    }

    const { x: newXPos, y: newYPos } = rotateAroundCenter(groupEl, rotation);

    // Update width and height of the block in store after rotating
    newBlocks[selected] = {
      ...currentBlock,
      x: newXPos,
      y: newYPos,
      rotation,
    };

    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);

    stageRef.current.batchDraw();
  }

  function onSplitEvenly() {}

  return (
    <div className="w-full absolute top-0 right-0 left-0 z-20 flex justify-end gap-2 p-2 bg-white shadow-md">
      <Button
        onClick={onAddBlock}
        disabled={blocks.length === MAX_BLOCKS}
        isIconOnly
      >
        <AddSvg className="w-8 h-8" />
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

      <ReorderModal
        onClose={onCloseModal}
        onOpen={onOpenModal}
        isOpen={isOpen}
        disabled={selected === null || blocks.length < 2}
      >
        <div
          className={btnClass({
            variant: selected === null || blocks.length < 2 ? 'disabled' : 'primary',
            isIconOnly: true,
          })}
        >
          <ReoderSvg className="w-8 h-8" />
        </div>
      </ReorderModal>

      <Button
        onClick={onSplitEvenly}
        disabled={selected === null || blocks.length < 3}
        isIconOnly
      >
        <CarouselSvg className="w-8 h-8" />
      </Button>
    </div>
  );
}
