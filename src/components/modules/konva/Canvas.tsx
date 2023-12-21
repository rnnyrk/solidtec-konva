import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';

import { useBoardStore } from 'store/board';
import {
  BLOCK_BASE,
  BLOCK_HEIGHT,
  BLOCK_SIZE,
  BLOCK_WIDTH,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from 'utils/constants';

import { Controls } from './Controls';
import { Grid } from './Grid';
import { Pallet } from './Pallet';

function Canvas() {
  const { currentLayerIndex, layers, setLayers } = useBoardStore();
  const currentLayer = layers[currentLayerIndex];
  const blocks = currentLayer.blocks;

  const [rotaters, setRotaters] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const blockLayerRef = useRef<any | null>(null);
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  function onAdd() {
    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = [...blocks, BLOCK_BASE];

    setLayers(newLayers);
  }

  function onActivate(index: number) {
    if (selected === index) {
      setSelected(null);
      return;
    }

    setSelected(index);
  }

  function onDuplicateLayer() {
    if (!stageRef.current) return;

    const copiedBlocks = blocks.map((block, index) => {
      const groupId = `#group-${index}`;
      const el = stageRef.current.find(groupId)[0];
      return {
        ...block,
        x: el.x(),
        y: el.y(),
        width: el.width(),
        height: el.height(),
      };
    });

    // @TODO duplicate blocks to new layer
    // setBlocks([...copiedBlocks]);
  }

  function onRotate() {
    if (!stageRef.current || selected === null) return;

    const groupEl = stageRef.current.find(`#group-${selected}`)[0];
    const textEl = stageRef.current.find(`#text-${selected}`)[0];
    const blockEl = stageRef.current.find(`#block-${selected}`)[0];

    if (rotaters.includes(selected)) {
      // Reset element to original dimensions
      const newSizes = { width: BLOCK_WIDTH, height: BLOCK_HEIGHT };

      groupEl.setAttrs({ ...newSizes });
      blockEl.setAttrs({ ...newSizes });
      textEl.setAttrs({
        ...newSizes,
        y: textEl.y() - 36,
      });

      setRotaters(rotaters.filter((rotater) => rotater !== selected));
    } else {
      // Flip width and height
      const newSizes = { width: BLOCK_HEIGHT, height: BLOCK_WIDTH };

      groupEl.setAttrs({ ...newSizes });
      blockEl.setAttrs({ ...newSizes });
      textEl.setAttrs({
        ...newSizes,
        height: BLOCK_HEIGHT - 36,
        y: textEl.y() + 36,
      });

      setRotaters([...rotaters, selected]);
    }

    stageRef.current.batchDraw();
  }

  function onAlignLeft() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group-${selected}`;
    const el = stageRef.current.find(groupId)[0];
    const isRotatedEl = rotaters.includes(selected);

    let yPos = STAGE_HEIGHT / 2 - BLOCK_HEIGHT / 2;
    if (isRotatedEl) {
      yPos = STAGE_HEIGHT / 2 - BLOCK_WIDTH / 2;
    }

    el.rotation(0);
    el.position({
      x: 0,
      y: yPos,
    });

    stageRef.current.batchDraw();
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

    const xPos = Math.round(el.x() / BLOCK_SIZE) * BLOCK_SIZE;
    const yPos = Math.round(el.y() / BLOCK_SIZE) * BLOCK_SIZE;

    el.position({
      x: xPos,
      y: yPos,
    });

    stageRef.current.batchDraw();
    shadowRef.current.hide();
  }

  function onDragMove(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    // Position current element within bounding box of Pallet (stage)
    const el = event.target;
    const pos = el.getAbsolutePosition();

    const elId = Number(el.attrs.id.split('-')[1]);
    const isRotatedEl = rotaters.includes(elId);

    // Depending on the rotation, the bounding box is different
    let xPos = pos.x;
    if (xPos < 0) xPos = 0;
    if (!isRotatedEl && xPos > STAGE_WIDTH - BLOCK_WIDTH) {
      xPos = STAGE_WIDTH - BLOCK_WIDTH;
    } else if (isRotatedEl && xPos > STAGE_WIDTH - BLOCK_HEIGHT) {
      xPos = STAGE_WIDTH - BLOCK_HEIGHT;
    }

    let yPos = pos.y;
    if (yPos < 0) yPos = 0;
    if (!isRotatedEl && yPos > STAGE_HEIGHT - BLOCK_HEIGHT) {
      yPos = STAGE_HEIGHT - BLOCK_HEIGHT;
    } else if (isRotatedEl && yPos > STAGE_HEIGHT - BLOCK_WIDTH) {
      yPos = STAGE_HEIGHT - BLOCK_WIDTH;
    }

    el.setAbsolutePosition({
      x: xPos,
      y: yPos,
    });

    // Match shadow element relative to the current element
    shadowRef.current.width(isRotatedEl ? BLOCK_HEIGHT : BLOCK_WIDTH);
    shadowRef.current.height(isRotatedEl ? BLOCK_WIDTH : BLOCK_HEIGHT);
    shadowRef.current.position({
      x: Math.round(xPos / BLOCK_SIZE) * BLOCK_SIZE,
      y: Math.round(yPos / BLOCK_SIZE) * BLOCK_SIZE,
    });

    stageRef.current.batchDraw();
  }

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
    <>
      <Controls
        amountOfBlocks={blocks.length}
        isSelected={selected}
        {...{ onAdd, onAlignLeft, onDuplicateLayer, onRotate }}
      />

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
            fill="#89d5f5"
            opacity={0.6}
            visible={false}
          />
        </Layer>

        <Layer
          ref={blockLayerRef}
          onDragEnd={onCollision}
        >
          {blocks.map((block, index) => {
            return (
              <Group
                {...block}
                key={`group-${index}`}
                id={`group-${index}`}
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
                  key={`block-${index}`}
                  id={`block-${index}`}
                  fill={selected === index ? '#89d5f5' : '#ffffff'}
                  stroke="#ddd"
                  strokeWidth={1}
                />
                <Text
                  width={block.width}
                  height={block.height - 36}
                  x={0}
                  y={0 + 36}
                  key={`text-${index}`}
                  id={`text-${index}`}
                  text={`${index + 1}`}
                  fontSize={60}
                  align="center"
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}

export default Canvas;
