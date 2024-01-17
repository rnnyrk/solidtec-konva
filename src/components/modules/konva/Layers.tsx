import { UseFormReset } from 'react-hook-form';

import { useModal } from 'hooks';
import { useBlocks, useBoardStore } from 'store/board';
import { BLOCK_BASE, BLOCK_HEIGHT, BLOCK_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from 'utils/constants';
import { btnClass, Button } from 'common/interaction/Button';

import { useKonvaContext } from './KonvaContext';
import { NewLayerModal, type NewLayerModalValues } from './modals/NewLayerModal';

export function Layers() {
  const { stageRef, setSelected } = useKonvaContext()!;
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  const { currentLayerIndex, setCurrentLayer, layers, setLayers } = useBoardStore();
  const blocks = useBlocks();

  function onSetActiveLayer(index: number) {
    setSelected(null);
    setCurrentLayer(index);
  }

  function onNewLayer(data: NewLayerModalValues, reset: UseFormReset<NewLayerModalValues>) {
    if (!stageRef.current) return;

    let newBlocks = [...blocks];

    if (data.duplicate) {
      let copyBlocks = [...layers[currentLayerIndex].blocks];

      if (data.flipX) {
        copyBlocks = copyBlocks.map((block) => ({
          ...block,
          x: STAGE_WIDTH - block.x - (block.rotated ? BLOCK_HEIGHT : BLOCK_WIDTH),
        }));
      }

      if (data.flipY) {
        copyBlocks = copyBlocks.map((block) => ({
          ...block,
          y: STAGE_HEIGHT - block.y - (block.rotated ? BLOCK_WIDTH : BLOCK_HEIGHT),
        }));
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
    <div className="flex flex-col justify-between">
      {layers.map((_, index) => {
        return (
          <Button
            key={`layer-button-${index}`}
            className="mb-2"
            onClick={() => onSetActiveLayer(index)}
            variant={index === currentLayerIndex ? 'primary' : 'alternative'}
            size="xl"
          >
            Layer {index + 1}
          </Button>
        );
      })}
      {layers.length < 4 && (
        <NewLayerModal
          title="Add new layer"
          description="Duplicate current layer or create new blanco layer by selecting none."
          onCallback={onNewLayer}
          onClose={onCloseModal}
          onOpen={onOpenModal}
          isOpen={isOpen}
        >
          <div className={btnClass({ variant: 'secondary', size: 'xl' })}>New layer</div>
        </NewLayerModal>
      )}
    </div>
  );
}
