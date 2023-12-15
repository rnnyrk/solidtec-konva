import { useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Rect, Stage } from 'react-konva';

import { Controls } from './Controls';
import { Grid } from './Grid';

type BaseRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const BLOCK_SNAP_SIZE = 30;

const RECT_BASE = {
  x: 0,
  y: 0,
  width: BLOCK_SNAP_SIZE * 6,
  height: BLOCK_SNAP_SIZE * 3,
};

function Canvas() {
  const [selected, setSelected] = useState<string | null>(null);
  const [rects, setRects] = useState<BaseRect[]>([RECT_BASE]);

  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  const width = window.innerWidth;
  const height = window.innerHeight;

  function onAddRect() {
    setRects([RECT_BASE, ...rects]);
  }

  function onActivateRect(event: KonvaEventObject<MouseEvent>) {
    const rectId = event.target.id();

    if (selected === rectId) {
      setSelected(null);
      return;
    }

    setSelected(rectId);
  }

  function onRotateRect() {
    if (!stageRef.current || !selected) return;
    stageRef.current.find(`#${selected}`)[0].rotate(90);
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
        onAddRect={onAddRect}
        onRotateRect={onRotateRect}
        isSelected={Boolean(selected)}
      />
      <Stage
        width={width}
        height={height}
        ref={stageRef}
      >
        <Grid blockSnapSize={BLOCK_SNAP_SIZE} />

        <Layer>
          <Rect
            ref={shadowRef}
            x={0}
            y={0}
            width={BLOCK_SNAP_SIZE * 6}
            height={BLOCK_SNAP_SIZE * 3}
            fill="#FF7B17"
            opacity={0.6}
            visible={false}
          />

          {rects.map((rect, index) => {
            return (
              <Rect
                {...rect}
                key={`rect-${index}`}
                id={`rect-${index}`}
                fill={selected === `rect-${index}` ? '#f5b889' : '#fff'}
                stroke="#ddd"
                strokeWidth={1}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragMove={onDragMove}
                onClick={onActivateRect}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}

export default Canvas;
