import { useModal } from 'hooks';
import { useBlocks, useBoardStore } from 'store/board';
import { MAX_BLOCKS } from 'utils/constants';
import { btnClass, Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';
import { NewLayer, type NewLayerValues } from './NewLayer';

export function Controls({
  amountOfBlocks,
  onAdd,
  onAlignLeft,
  onRotate,
  isSelected,
}: ControlProps) {
  const konvaContext = useKonvaContext();
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  const { currentLayerIndex, setCurrentLayer, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onSetActiveLayer(index: number) {
    setCurrentLayer(index);
  }

  function onNewLayer(data: NewLayerValues) {
    if (!konvaContext || !konvaContext.stageRef.current) return;

    // @TODO check values from modal
    console.log({ data });

    const duplicateBlocks = [...blocks];
    setLayers([
      ...layers,
      {
        index: layers.length,
        blocks: duplicateBlocks,
      },
    ]);

    onCloseModal();
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex">
        {layers.map((_, index) => {
          return (
            <Button
              key={`layer-button-${index}`}
              className="mr-2"
              onClick={() => onSetActiveLayer(index)}
              variant={index === currentLayerIndex ? 'primary' : 'alternative'}
              size="xl"
            >
              Layer {index + 1}
            </Button>
          );
        })}
        <NewLayer
          title="Nieuwe laag toevoegen"
          onCallback={onNewLayer}
          onClose={onCloseModal}
          onOpen={onOpenModal}
          isOpen={isOpen}
        >
          <div className={btnClass({ variant: 'secondary', size: 'xl' })}>Nieuwe laag</div>
        </NewLayer>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col">
        <Button
          onClick={onAdd}
          disabled={amountOfBlocks === MAX_BLOCKS}
          size="xl"
          className="mb-2"
        >
          Add new
        </Button>
        <Button
          onClick={onRotate}
          disabled={isSelected === null}
          size="xl"
          className="mb-2"
        >
          Rotate
        </Button>
        <Button
          onClick={onAlignLeft}
          size="xl"
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
