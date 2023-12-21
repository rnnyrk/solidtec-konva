import { MAX_BLOCKS } from 'utils/constants';
import { Button } from 'common/interaction/Button';

export function Controls({
  amountOfBlocks,
  onAdd,
  onAlignLeft,
  onDuplicateLayer,
  onRotate,
  isSelected,
}: ControlProps) {
  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex flex-col">
        <Button onClick={onDuplicateLayer}>Duplicate layer</Button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col">
        <Button
          onClick={onAdd}
          disabled={amountOfBlocks === MAX_BLOCKS}
        >
          Add new
        </Button>
        <Button
          onClick={onRotate}
          disabled={isSelected === null}
        >
          Rotate
        </Button>
        <Button
          onClick={onAlignLeft}
          disabled={isSelected === null}
        >
          Align left
        </Button>
      </div>
    </>
  );
}

type ControlProps = {
  amountOfBlocks: number;
  onAdd: () => void;
  onAlignLeft: () => void;
  onDuplicateLayer: () => void;
  onRotate: () => void;
  isSelected: number | null;
};
