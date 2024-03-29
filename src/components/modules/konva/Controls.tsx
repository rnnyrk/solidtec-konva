import { useBoundingBox } from 'hooks';
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
import { Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';

export function Controls() {
  const { stageRef, selected, setSelected } = useKonvaContext()!;

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
    setSelected([newLayerBlocks.length - 1]);
  }

  function onAlignVertical() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected[0]}`;
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
  }

  function onAlignHorizontal() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group[${currentLayerIndex}]-${selected[0]}`;
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
  }

  function onRotate() {
    if (!stageRef.current || selected === null) return;

    const groupEl = stageRef.current.find(`#group[${currentLayerIndex}]-${selected}`)[0];

    const newBlocks = [...blocks];
    const currentBlock = newBlocks[selected[0]];

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
    newBlocks[selected[0]] = {
      ...currentBlock,
      x: newXPos,
      y: newYPos,
      rotation,
    };

    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);
  }

  function onReorder() {
    if (selected === null || selected.length !== 2) return;

    const newBlocks = [...blocks];

    const firstBlockOrder = newBlocks[selected[0]].order;
    const secondBlockOrder = newBlocks[selected[1]].order;

    // Switch orders of selected and switch block, sort by order in store
    newBlocks[selected[0]].order = secondBlockOrder;
    newBlocks[selected[1]].order = firstBlockOrder;

    newBlocks.sort((a, b) => a.order - b.order);

    // Update blocks on current layer
    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);
  }

  function onSplitEvenlyHorizontal() {
    if (blocks.length < 3) return;

    let totalEffectiveWidth = 0;
    const blockEffectiveWidths = blocks.map((block) => {
      // Check rotation and swap width/height
      const isVertical = block.rotation === 90 || block.rotation === 270;
      const effectiveWidth = isVertical ? BLOCK_HEIGHT : BLOCK_WIDTH;

      totalEffectiveWidth += effectiveWidth;
      return effectiveWidth;
    });

    // Use STAGE_WIDTH without margins to use pallet spacing
    const totalSpacingWidth = STAGE_WIDTH - totalEffectiveWidth;
    const spacing = totalSpacingWidth / (blocks.length - 1);

    // Start with collarMargin as offset from the left
    let currentPosition = currentLayer.collarMargin;
    const newBlocks = blocks.map((block, index) => {
      let rotationOffset = 0;
      if (block.rotation === 90) {
        rotationOffset = BLOCK_HEIGHT;
      } else if (block.rotation === 180) {
        rotationOffset = BLOCK_WIDTH;
      } else if (block.rotation === 270) {
        rotationOffset = 0;
      }

      // Use the effective width for X position calculation
      const effectiveWidth = blockEffectiveWidths[index];
      const x = currentPosition + rotationOffset;

      // Update currentPosition for the next block
      currentPosition += effectiveWidth + spacing;

      return {
        ...block,
        x,
      };
    });

    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);
  }

  function onSplitEvenlyVertical() {
    if (blocks.length < 3) return;

    let totalEffectiveHeight = 0;
    const blockEffectiveHeights = blocks.map((block) => {
      // Check rotation and swap width/height
      const isHorizontal = block.rotation === 0 || block.rotation === 180;
      const effectiveHeight = isHorizontal ? BLOCK_HEIGHT : BLOCK_WIDTH;

      totalEffectiveHeight += effectiveHeight;
      return effectiveHeight;
    });

    // Use STAGE_HEIGHT without margins to use pallet spacing
    const totalSpacingHeight = STAGE_HEIGHT - totalEffectiveHeight;
    const spacing = totalSpacingHeight / (blocks.length - 1);

    // Start with collarMargin as offset from the top
    let currentPosition = currentLayer.collarMargin;
    const newBlocks = blocks.map((block, index) => {
      let rotationOffset = 0;
      if (block.rotation === 90) {
        rotationOffset = 0;
      } else if (block.rotation === 180) {
        rotationOffset = BLOCK_HEIGHT;
      } else if (block.rotation === 270) {
        rotationOffset = BLOCK_WIDTH;
      }

      // Use the effective height for Y position calculation
      const effectiveHeight = blockEffectiveHeights[index];
      const y = currentPosition + rotationOffset;

      // Update currentPosition for the next block
      currentPosition += effectiveHeight + spacing;

      return {
        ...block,
        y,
      };
    });

    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);
  }

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
        disabled={selected === null || selected.length > 1}
        isIconOnly
      >
        <AlignVerticalSvg className="w-8 h-8" />
      </Button>
      <Button
        onClick={onAlignHorizontal}
        disabled={selected === null || selected.length > 1}
        isIconOnly
      >
        <AlignHorizontalSvg className="w-8 h-8" />
      </Button>

      <Button
        onClick={onRotate}
        disabled={selected === null || selected.length > 1}
        isIconOnly
      >
        <RotateSvg className="w-8 h-8" />
      </Button>
      <Button
        onClick={onReorder}
        disabled={selected === null || selected.length !== 2}
        isIconOnly
      >
        <ReoderSvg className="w-8 h-8" />
      </Button>
      <Button
        onClick={onSplitEvenlyHorizontal}
        disabled={selected === null || selected.length < 3 || blocks.length < 3}
        isIconOnly
      >
        <CarouselSvg className="w-8 h-8" />
      </Button>
      <Button
        onClick={onSplitEvenlyVertical}
        disabled={selected === null || selected.length < 3 || blocks.length < 3}
        isIconOnly
      >
        <CarouselSvg className="w-8 h-8 rotate-90" />
      </Button>
    </div>
  );
}
