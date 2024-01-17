import { useForm } from 'react-hook-form';

import { type ModalProps } from 'hooks';
import { Button } from 'common/interaction/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'common/interaction/Dialog';

export type BlockSettingsModalValues = {
  order: number;
};

export function BlockSettingsModal({ children, onClose, onOpen, isOpen }: BlockSettingsModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BlockSettingsModalValues>();

  function onSubmit(data: BlockSettingsModalValues) {
    console.log(data);
  }

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
          <DialogTitle>Change selected block</DialogTitle>
        </DialogHeader>

        <form
          className="pt-4 pb-8 px-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Button
            type="submit"
            className="mt-8"
            size="xl"
            disabled={Object.keys(errors).length > 0}
          >
            Edit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type BlockSettingsModalProps = ModalProps & {
  children: React.ReactNode;
};
