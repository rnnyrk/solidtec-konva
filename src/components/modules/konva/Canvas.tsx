import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';

import { Controls } from './Controls';
import { Grid } from './Grid';
import { Pallet } from './Pallet';

const BLOCK_SIZE = 20; // 10cm in real life
const MAX_BLOCKS = 6;

// Stage dimensions are based on real pallet dimensions
// Pallet 180cm x 120cm. 10cm = 20px
const STAGE_WIDTH = BLOCK_SIZE * 36;
const STAGE_HEIGHT = BLOCK_SIZE * 24;
const BLOCK_WIDTH = BLOCK_SIZE * 10;
const BLOCK_HEIGHT = BLOCK_SIZE * 6;

const BLOCK_BASE = {
  x: 0,
  y: 0,
  width: BLOCK_WIDTH,
  height: BLOCK_HEIGHT,
};

// @TODO add index to block as text; https://stackoverflow.com/questions/55227880/how-to-put-a-text-inside-a-rect-using-konva-js
// @TODO collision detection; https://konvajs.org/docs/sandbox/Collision_Detection.html

function Canvas() {
  const [blocks, setBlocks] = useState<BaseBlock[]>([BLOCK_BASE]);
  const [rotaters, setRotaters] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  function onAdd() {
    setBlocks([BLOCK_BASE, ...blocks]);
  }

  function onActivate(index: number) {
    if (selected === index) {
      setSelected(null);
      return;
    }

    setSelected(index);
  }

  function onRotate() {
    if (!stageRef.current || selected === null) return;

    const textEl = stageRef.current.find(`#text-${selected}`)[0];
    const blockEl = stageRef.current.find(`#block-${selected}`)[0];

    if (rotaters.includes(selected)) {
      // Reset element to original dimensions
      blockEl.setAttrs({
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
      });

      textEl.setAttrs({
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        y: textEl.y() - 36,
      });

      setRotaters(rotaters.filter((rotater) => rotater !== selected));
    } else {
      // Flip width and height
      blockEl.setAttrs({
        width: BLOCK_HEIGHT,
        height: BLOCK_WIDTH,
      });

      textEl.setAttrs({
        width: BLOCK_HEIGHT,
        height: BLOCK_WIDTH,
        y: textEl.y() + 36,
      });

      setRotaters([...rotaters, selected]);
    }

    stageRef.current.batchDraw();
  }

  function onAlignLeft() {
    if (!stageRef.current || selected === null) return;

    const groupId = `#group-${selected}`;
    const element = stageRef.current.find(groupId)[0];

    element.rotation(0);
    element.position({
      x: 0,
      y: STAGE_HEIGHT / 2 - BLOCK_HEIGHT / 2,
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

    el.position({
      x: Math.round(el.x() / BLOCK_SIZE) * BLOCK_SIZE,
      y: Math.round(el.y() / BLOCK_SIZE) * BLOCK_SIZE,
    });

    stageRef.current.batchDraw();
    shadowRef.current.hide();
  }

  function onDragMove(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    // Position current element within bounding box of Pallet (stage)
    const el = event.target;
    const pos = el.getAbsolutePosition();

    const index = Number(el.attrs.id.split('-')[1]);
    const isRotatedEl = rotaters.includes(index);

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

  return (
    <>
      <Controls
        amountOfBlocks={blocks.length}
        maxBlocks={MAX_BLOCKS}
        isSelected={selected}
        {...{ onAdd, onAlignLeft, onRotate }}
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
        <Grid blockSize={BLOCK_SIZE} />

        <Layer>
          <Pallet
            stageHeight={STAGE_HEIGHT}
            stageWidth={STAGE_WIDTH}
          />

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
                  {...block}
                  key={`block-${index}`}
                  id={`block-${index}`}
                  fill={selected === index ? '#89d5f5' : '#ffffff'}
                  stroke="#ddd"
                  strokeWidth={1}
                />
                <Text
                  {...block}
                  y={block.y + 36}
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

type BaseBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default Canvas;
