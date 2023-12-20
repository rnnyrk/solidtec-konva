import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Stage } from 'react-konva';
import useImage from 'use-image';

import { Controls } from './Controls';
import { Grid } from './Grid';

type BaseBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const BLOCK_SNAP_SIZE = 30;
const MAX_BLOCKS = 6;

const BLOCK_BASE = {
  x: 0,
  y: 0,
  width: BLOCK_SNAP_SIZE * 6,
  height: BLOCK_SNAP_SIZE * 3,
};

function Canvas() {
  const [palletImage] = useImage('/images/pallet-top.png');

  const [selected, setSelected] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BaseBlock[]>([BLOCK_BASE]);

  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);
  const palletRef = useRef<any | null>(null);

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
      y: height / 2 - BLOCK_SNAP_SIZE * 1.5,
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
      x: Math.round(event.target.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
      y: Math.round(event.target.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    });

    stageRef.current.batchDraw();
    shadowRef.current.hide();
  }

  function onDragMove(event: KonvaEventObject<DragEvent>) {
    if (!shadowRef.current || !stageRef.current) return;

    shadowRef.current.rotation(event.target.rotation());

    shadowRef.current.position({
      x: Math.round(event.target.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
      y: Math.round(event.target.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
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
        width={width}
        height={height}
        ref={stageRef}
      >
        <Grid blockSnapSize={BLOCK_SNAP_SIZE} />

        <Layer>
          <Rect
            ref={palletRef}
            fillPatternImage={palletImage}
            width={BLOCK_SNAP_SIZE * 18}
            height={BLOCK_SNAP_SIZE * 12}
            x={BLOCK_SNAP_SIZE * 30}
            y={BLOCK_SNAP_SIZE * 15}
          />

          <Rect
            ref={shadowRef}
            x={0}
            y={0}
            width={BLOCK_SNAP_SIZE * 6}
            height={BLOCK_SNAP_SIZE * 3}
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
