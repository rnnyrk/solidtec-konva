import { Layer, Line } from 'react-konva';

type Line = {
  points: number[];
  stroke: string;
  strokeWidth: number;
  opacity: number;
};

export function Grid() {
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
      opacity: 0.2,
    });
  }

  for (var j = 0; j < height / padding; j++) {
    verticalLines.push({
      points: [0, Math.round(j * padding), width, Math.round(j * padding)],
      stroke: '#ddd',
      strokeWidth: 0.5,
      opacity: 0.2,
    });
  }

  return (
    <Layer>
      {horizontalLines.map((line, index) => {
        return (
          <Line
            key={`line_horizontal_${index}`}
            {...line}
          />
        );
      })}
      {verticalLines.map((line, index) => {
        return (
          <Line
            key={`line_vertical_${index}`}
            {...line}
          />
        );
      })}
    </Layer>
  );
}
