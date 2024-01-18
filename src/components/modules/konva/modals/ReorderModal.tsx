import { useState } from 'react';

import { type ModalProps } from 'hooks';
import { useBlocks } from 'store/board';
import { cn } from 'utils';
import { Button } from 'common/interaction/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'common/interaction/Dialog';

import { useKonvaContext } from '../KonvaContext';

export function ReorderModal({
  children,
  disabled,
  onCallback,
  onClose,
  onOpen,
  isOpen,
}: ReorderModalProps) {
  const { selected } = useKonvaContext()!;
  const blocks = useBlocks();

  const [switchBlock, setSwitchBlock] = useState<number | null>(null);
  const selectedOrder = selected !== null ? blocks[selected].order : null;

  function onSetSwitchBlock(order: number) {
    if (selectedOrder === order) return;
    setSwitchBlock(order);
  }

  function onReorderBlocks() {
    if (!switchBlock || !selectedOrder) return;
    // @TODO change block.order of both block, sort on order in store
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger
        onClick={() => onOpen()}
        disabled={disabled}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        onClose={onClose}
        onEscapeKeyDown={onClose}
        onInteractOutside={onClose}
        className="min-w-[600px] bg-solidtecBlack p-0 overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>Change block placement order with another</DialogTitle>
        </DialogHeader>

        <div className="pt-4 pb-8 px-8">
          <div className="flex">
            {blocks.map((block) => {
              return (
                <button
                  onClick={() => onSetSwitchBlock(block.order)}
                  className={cn(
                    'w-16 h-16 flex items-center justify-center text-2xl border-2 border-primary text-primary bg-transparent shadow-md cursor-pointer mr-4 last:mr-0',
                    {
                      'bg-primary text-white':
                        selectedOrder === block.order || switchBlock === block.order,
                    },
                  )}
                >
                  {block.order}
                </button>
              );
            })}
          </div>

          <Button
            onClick={onCallback}
            className="mt-8"
            disabled={!switchBlock || !selectedOrder}
            size="xl"
          >
            Reorder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ReorderModalProps = ModalProps & {
  children: React.ReactNode;
  disabled?: boolean;
  onCallback: () => void;
};