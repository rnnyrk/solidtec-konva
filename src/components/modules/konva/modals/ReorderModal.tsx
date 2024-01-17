import { type ModalProps } from 'hooks';
import { Button } from 'common/interaction/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'common/interaction/Dialog';

export function ReorderModal({ children, onCallback, onClose, onOpen, isOpen }: ReorderModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={() => onOpen()}>{children}</DialogTrigger>
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
          <Button
            onClick={onCallback}
            className="mt-8"
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
  onCallback: () => void;
};
