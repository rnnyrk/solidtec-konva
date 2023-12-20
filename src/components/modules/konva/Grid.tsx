import { Layer, Line } from 'react-konva';

export function Grid({ blockSize }: GridProps) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const padding = blockSize;
  const opacity = 0.1;

  const horizontalLines: LineProps[] = [];
  const verticalLines: LineProps[] = [];

  for (var i = 0; i < width / padding; i++) {
    horizontalLines.push({
      points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
      stroke: '#ddd',
      strokeWidth: 1,
      opacity,
    });
  }

  for (var j = 0; j < height / padding; j++) {
    verticalLines.push({
      points: [0, Math.round(j * padding), width, Math.round(j * padding)],
      stroke: '#ddd',
      strokeWidth: 0.5,
      opacity,
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

type LineProps = {
  points: number[];
  stroke: string;
  strokeWidth: number;
  opacity: number;
};

type GridProps = {
  blockSize: number;
};
