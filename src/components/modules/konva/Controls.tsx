import { UseFormReset } from 'react-hook-form';

import { useModal } from 'hooks';
import { useBlocks, useBoardStore } from 'store/board';
import { BLOCK_BASE, BLOCK_SIZE, MAX_BLOCKS, STAGE_WIDTH } from 'utils/constants';
import { btnClass, Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';
import { NewLayer, type NewLayerValues } from './NewLayer';

export function Controls({
  amountOfBlocks,
  onAdd,
  onAlignLeft,
  onRotate,
  selected,
  setSelected,
}: ControlProps) {
  const konvaContext = useKonvaContext();
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  const { currentLayerIndex, setCurrentLayer, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onSetActiveLayer(index: number) {
    setSelected(null);
    setCurrentLayer(index);
  }

  function onNewLayer(data: NewLayerValues, reset: UseFormReset<NewLayerValues>) {
    if (!konvaContext || !konvaContext.stageRef.current) return;

    let newBlocks = [...blocks];

    if (data.duplicate) {
      const copyBlocks = [...layers[currentLayerIndex].blocks];

      // @TODO flip the blocks x and y coordinates
      if (data.flip) {
        // copyBlocks.forEach((block) => {
        //   block.x = STAGE_WIDTH - block.x - BLOCK_SIZE;
        // });
      }

      newBlocks = [...copyBlocks];
    } else {
      newBlocks = [BLOCK_BASE];
    }

    setLayers([
      ...layers,
      {
        index: layers.length,
        blocks: newBlocks,
      },
    ]);

    onCloseModal();
    reset();
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
        {layers.length < 4 && (
          <NewLayer
            title="Nieuwe laag toevoegen"
            description="Dupliceer de huidige laag of maak een blanco nieuwe laag aan door niets te selecteren."
            onCallback={onNewLayer}
            onClose={onCloseModal}
            onOpen={onOpenModal}
            isOpen={isOpen}
          >
            <div className={btnClass({ variant: 'secondary', size: 'xl' })}>Nieuwe laag</div>
          </NewLayer>
        )}
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
    </>
  );
}

type ControlProps = {
  amountOfBlocks: number;
  onAdd: () => void;
  onAlignLeft: () => void;
  onRotate: () => void;
  selected: number | null;
  setSelected: (index: number | null) => void;
};
