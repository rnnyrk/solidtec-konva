import { UseFormReset } from 'react-hook-form';

import { useModal } from 'hooks';
import { useBlocks, useBoardStore } from 'store/board';
import { BLOCK_BASE, BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_WIDTH } from 'utils/constants';
import { btnClass, Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';
import { NewLayer, type NewLayerValues } from './NewLayer';

export function Layers() {
  const { stageRef, setSelected } = useKonvaContext()!;
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  const { currentLayerIndex, setCurrentLayer, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onSetActiveLayer(index: number) {
    setSelected(null);
    setCurrentLayer(index);
  }

  function onNewLayer(data: NewLayerValues, reset: UseFormReset<NewLayerValues>) {
    if (!stageRef.current) return;

    let newBlocks = [...blocks];

    if (data.duplicate) {
      let copyBlocks = [...layers[currentLayerIndex].blocks];

      if (data.flip) {
        const flippedBlocks = blocks.map((block) => ({
          ...block,
          x: STAGE_WIDTH - block.x - (block.rotated ? BLOCK_HEIGHT : BLOCK_WIDTH),
        }));

        copyBlocks = [...flippedBlocks];
      }

      newBlocks = [...copyBlocks];
    } else {
      newBlocks = [BLOCK_BASE];
    }

    const newLayers = [
      ...layers,
      {
        index: layers.length,
        blocks: newBlocks,
      },
    ];

    setLayers(newLayers);
    setCurrentLayer(newLayers.length - 1);
    setSelected(null);

    onCloseModal();
    reset();
  }

  return (
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
  );
}
