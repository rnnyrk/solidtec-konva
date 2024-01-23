import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Rect, Text } from 'react-konva';
import useImage from 'use-image';

import { useBoundingBox, useKeys } from 'hooks';
import { useBlocks, useBoardStore } from 'store/board';
import { BLOCK_SIZE } from 'utils/constants';

import { useKonvaContext } from './KonvaContext';

export function Blocks() {
  const { stageRef, shadowRef, selected, setSelected } = useKonvaContext()!;

  const [itemImg] = useImage('/images/item.jpg');
  const [itemSelectedImg] = useImage('/images/item-selected.jpg');

  useKeys();
  const blocks = useBlocks();
  const { getBoundingBox } = useBoundingBox();
  const { currentLayerIndex, layers, setLayers } = useBoardStore();

  function onActivate(index: number) {
    const newSelected = selected ? [...selected] : null;

    // If nothing is selected, select current pressed item
    if (newSelected === null) {
      setSelected([index]);
      return;
    }

    // If current pressed item is already selected, remove from selected array
    if (newSelected !== null && newSelected.length > 0 && newSelected.includes(index)) {
      const selectedIndex = newSelected.indexOf(index);
      if (selectedIndex > -1) {
        newSelected.splice(selectedIndex, 1);
      }

      if (newSelected.length === 0) {
        setSelected(null);
        return;
      }

      setSelected(newSelected);
      return;
    }

    // If there is any item selected, but not the current, add to selected array
    if (newSelected !== null && newSelected.length > 0 && !newSelected.includes(index)) {
      newSelected.push(index);
      setSelected(newSelected);
    }
  }

  function onDragStart(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    shadowRef.current.show();
    shadowRef.current.moveToTop();
    event.target.moveToTop();
  }

  function onDragEnd(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    const el = event.target;
    const elId = Number(el.attrs.id.split('-')[1]);

    const xPos = Math.round(el.x() / BLOCK_SIZE) * BLOCK_SIZE;
    const yPos = Math.round(el.y() / BLOCK_SIZE) * BLOCK_SIZE;

    el.position({
      x: xPos,
      y: yPos,
    });

    // Update position of the block in store after dragging
    const newBlocks = [...blocks];
    newBlocks[elId] = {
      ...newBlocks[elId],
      x: xPos,
      y: yPos,
    };

    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = newBlocks;
    setLayers(newLayers);

    stageRef.current.batchDraw();
    shadowRef.current.hide();
  }

  function onDragMove(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    // Position current element within bounding box of Pallet (stage)
    const el = event.target;
    const pos = el.getAbsolutePosition();

    const elId = Number(el.attrs.id.split('-')[1]);
    const rotation = blocks[elId].rotation;

    const { x: newXPos, y: newYPos } = getBoundingBox({ pos, rotation });

    el.setAbsolutePosition({
      x: newXPos,
      y: newYPos,
    });

    // Match shadow element relative to the current element
    shadowRef.current.rotation(rotation);
    shadowRef.current.position({
      x: Math.round(newXPos / BLOCK_SIZE) * BLOCK_SIZE,
      y: Math.round(newYPos / BLOCK_SIZE) * BLOCK_SIZE,
    });

    stageRef.current.batchDraw();
  }

  return (
    <>
      {blocks.map((block, index) => {
        console.log({ index, includes: selected?.includes(index) });

        return (
          <Group
            {...block}
            key={`group[${currentLayerIndex}]-${index}`}
            id={`group[${currentLayerIndex}]-${index}`}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragMove={onDragMove}
            onClick={() => onActivate(index)}
            onTap={() => onActivate(index)}
          >
            <Rect
              width={block.width}
              height={block.height}
              x={0}
              y={0}
              key={`block[${currentLayerIndex}]-${index}`}
              id={`block[${currentLayerIndex}]-${index}`}
              fillPatternImage={selected && selected.includes(index) ? itemSelectedImg : itemImg}
              stroke="#ddd"
              strokeWidth={1}
            />
            <Text
              width={block.width}
              height={block.height - 36}
              x={0}
              y={30}
              key={`text[${currentLayerIndex}]-${index}`}
              id={`text[${currentLayerIndex}]-${index}`}
              text={`${block.order}`}
              fontSize={60}
              align="center"
            />
          </Group>
        );
      })}
    </>
  );
}
