import { Button } from 'common/interaction/Button';

export function Controls({
  amountOfBlocks,
  maxBlocks,
  onAdd,
  onAlignLeft,
  onRotate,
  isSelected,
}: ControlProps) {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col">
      <Button
        onClick={onAdd}
        disabled={amountOfBlocks === maxBlocks}
      >
        Add new
      </Button>
      {/* <Button
        onClick={onRotate}
        disabled={!isSelected}
      >
        Rotate
      </Button> */}
      <Button
        onClick={onAlignLeft}
        disabled={!isSelected}
      >
        Align left
      </Button>
    </div>
  );
}

type ControlProps = {
  amountOfBlocks: number;
  maxBlocks: number;
  onAdd: () => void;
  onAlignLeft: () => void;
  onRotate: () => void;
  isSelected: boolean;
};
