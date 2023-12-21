import { useBlocks, useBoardStore } from 'store/board';
import { BLOCK_BASE, MAX_BLOCKS } from 'utils/constants';
import { Button } from 'common/interaction/Button';

export function Controls({ amountOfBlocks, onAlignLeft, onRotate, selected }: ControlsProps) {
  const { currentLayerIndex, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onAddBlock() {
    const newLayers = [...layers];
    newLayers[currentLayerIndex].blocks = [...blocks, BLOCK_BASE];

    setLayers(newLayers);
  }

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col">
      <Button
        onClick={onAddBlock}
        disabled={amountOfBlocks === MAX_BLOCKS}
        size="xl"
        className="mb-2"
      >
        Add new
      </Button>
      <Button
        onClick={onRotate}
        disabled={selected === null}
        size="xl"
        className="mb-2"
      >
        Rotate
      </Button>
      <Button
        onClick={onAlignLeft}
        size="xl"
        disabled={selected === null}
      >
        Align left
      </Button>
    </div>
  );
}

type ControlsProps = {
  amountOfBlocks: number;
  onAlignLeft: () => void;
  onRotate: () => void;
  selected: number | null;
};
