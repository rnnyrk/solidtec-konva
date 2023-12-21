import { useBlocks, useBoardStore } from 'store/board';
import { MAX_BLOCKS } from 'utils/constants';
import { Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';

export function Controls({
  amountOfBlocks,
  onAdd,
  onAlignLeft,
  onRotate,
  isSelected,
}: ControlProps) {
  const konvaContext = useKonvaContext();

  const { currentLayerIndex, setCurrentLayer, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onSetActiveLayer(index: number) {
    setCurrentLayer(index);
  }

  function onDuplicateLayer() {
    if (!konvaContext || !konvaContext.stageRef.current) return;

    const duplicateBlocks = [...blocks];
    setLayers([
      ...layers,
      {
        index: layers.length,
        blocks: duplicateBlocks,
      },
    ]);
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex">
        {layers.map((layer) => {
          const index = layer.index;
          return (
            <Button
              key={`layer-button-${index}`}
              className="mr-2"
              onClick={() => onSetActiveLayer(index)}
              variant={index === currentLayerIndex ? 'primary' : 'alternative'}
            >
              Layer {index + 1}
            </Button>
          );
        })}
        <Button
          variant="secondary"
          onClick={onDuplicateLayer}
        >
          Duplicate
        </Button>
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
  onRotate: () => void;
  isSelected: number | null;
};
