import { useRef } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';

type Line = {
  points: number[];
  stroke: string;
  strokeWidth: number;
};

function Canvas() {
  const stageRef = useRef<any | null>(null);
  const shadowRef = useRef<any | null>(null);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const blockSnapSize = 30;
  const padding = blockSnapSize;

  const horizontalLines: Line[] = [];
  const verticalLines: Line[] = [];

  for (var i = 0; i < width / padding; i++) {
    horizontalLines.push({
      points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
      stroke: '#ddd',
      strokeWidth: 1,
    });
  }

  for (var j = 0; j < height / padding; j++) {
    verticalLines.push({
      points: [0, Math.round(j * padding), width, Math.round(j * padding)],
      stroke: '#ddd',
      strokeWidth: 0.5,
    });
  }

  function onDragStart(event) {
    if (!shadowRef.current || !stageRef.current) return;

    shadowRef.current.show();
    shadowRef.current.moveToTop();
    event.target.moveToTop();
  }

  function onDragEnd(event) {
    if (!shadowRef.current || !stageRef.current) return;

    event.target.position({
      x: Math.round(event.target.x() / blockSnapSize) * blockSnapSize,
      y: Math.round(event.target.y() / blockSnapSize) * blockSnapSize,
    });

    stageRef.current.batchDraw();
    shadowRef.current.hide();
  }

  function onDragMove(event) {
    if (!shadowRef.current || !stageRef.current) return;

    shadowRef.current.position({
      x: Math.round(event.target.x() / blockSnapSize) * blockSnapSize,
      y: Math.round(event.target.y() / blockSnapSize) * blockSnapSize,
    });

    stageRef.current.batchDraw();
  }

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
    >
      <Layer>
        {horizontalLines.map((line, i) => {
          return (
            <Line
              key={`line_horizontal_${i}`}
              {...line}
            />
          );
        })}
        {verticalLines.map((line, i) => {
          return (
            <Line
              key={`line_vertical_${i}`}
              {...line}
            />
          );
        })}
      </Layer>

      <Layer>
        <Rect
          ref={shadowRef}
          x={0}
          y={0}
          width={blockSnapSize * 6}
          height={blockSnapSize * 3}
          fill="#FF7B17"
          opacity={0.6}
          visible={false}
        />

        <Rect
          x={0}
          y={0}
          width={blockSnapSize * 6}
          height={blockSnapSize * 3}
          fill="#fff"
          stroke="#ddd"
          strokeWidth={1}
          shadowColor="black"
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
          shadowOpacity={0.4}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragMove={onDragMove}
        />
      </Layer>
    </Stage>
  );
}

export default Canvas;
