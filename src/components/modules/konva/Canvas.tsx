import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Stage } from 'react-konva';

import { Controls } from './Controls';
import { Grid } from './Grid';
import { Pallet } from './Pallet';

type BaseBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const BLOCK_SIZE = 20;
const MAX_BLOCKS = 6;

const stageWidth = BLOCK_SIZE * 36;
const stageHeight = BLOCK_SIZE * 24;
const blockWidth = BLOCK_SIZE * 10;
const blockHeight = BLOCK_SIZE * 6;

const BLOCK_BASE = {
  x: 0,
  y: 0,
  width: blockWidth,
  height: blockHeight,
};

function Canvas() {
  const [selected, setSelected] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BaseBlock[]>([BLOCK_BASE]);

  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  const width = window.innerWidth;
  const height = window.innerHeight;

  function onAdd() {
    setBlocks([BLOCK_BASE, ...blocks]);
  }

  function onActivate(event: KonvaEventObject<MouseEvent>) {
    const blockId = event.target.id();

    if (selected === blockId) {
      setSelected(null);
      return;
    }

    setSelected(blockId);
  }

  function onRotate() {
    if (!stageRef.current || !selected) return;

    const element = stageRef.current.find(`#${selected}`)[0];
    const currentRotation = element.rotation();

    if (currentRotation === 90) {
      element.rotation(0);
      return;
    }

    stageRef.current.find(`#${selected}`)[0].rotate(90);
    stageRef.current.batchDraw();
  }

  function onAlignLeft() {
    if (!stageRef.current || !selected) return;

    const element = stageRef.current.find(`#${selected}`)[0];

    element.rotation(0);
    element.position({
      x: 0,
      y: height / 2 - BLOCK_SIZE * 1.5,
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

    event.target.position({
      x: Math.round(event.target.x() / BLOCK_SIZE) * BLOCK_SIZE,
      y: Math.round(event.target.y() / BLOCK_SIZE) * BLOCK_SIZE,
    });

    stageRef.current.batchDraw();
    shadowRef.current.hide();
  }

  function onDragMove(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    shadowRef.current.rotation(event.target.rotation());

    shadowRef.current.position({
      x: Math.round(event.target.x() / BLOCK_SIZE) * BLOCK_SIZE,
      y: Math.round(event.target.y() / BLOCK_SIZE) * BLOCK_SIZE,
    });

    stageRef.current.batchDraw();
  }

  return (
    <>
      <Controls
        amountOfBlocks={blocks.length}
        maxBlocks={MAX_BLOCKS}
        isSelected={Boolean(selected)}
        {...{ onAdd, onAlignLeft, onRotate }}
      />
      <Stage
        width={stageWidth}
        height={stageHeight}
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
          <Pallet blockSize={BLOCK_SIZE} />

          <Rect
            ref={shadowRef}
            x={0}
            y={0}
            width={blockWidth}
            height={blockHeight}
            fill="#89d5f5"
            opacity={0.6}
            visible={false}
          />

          {blocks.map((block, index) => {
            return (
              <Rect
                {...block}
                key={`block-${index}`}
                id={`block-${index}`}
                fill={selected === `block-${index}` ? '#89d5f5' : '#fff'}
                stroke="#ddd"
                strokeWidth={1}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragMove={onDragMove}
                onClick={onActivate}
                // onTap={onActivate}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}

export default Canvas;
