import { useEffect } from 'react';
import { useForm, UseFormReset } from 'react-hook-form';

import { Checkbox } from 'common/form/Checkbox';
import { Button } from 'common/interaction/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'common/interaction/Dialog';

export type NewLayerModalValues = {
  duplicate: boolean;
  flipX: boolean;
  flipY: boolean;
};

export function NewLayerModal({
  children,
  description,
  onCallback,
  onClose,
  onOpen,
  isOpen,
  title,
}: NewLayerModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<NewLayerModalValues>();

  const flipXEnabled = watch('flipX');
  const flipYEnabled = watch('flipY');
  const duplicateEnabled = watch('duplicate');

  useEffect(() => {
    const flipXUndefined = typeof flipXEnabled === 'undefined';
    const flipYUndefined = typeof flipYEnabled === 'undefined';

    if (!duplicateEnabled || flipXUndefined || flipYUndefined) {
      setValue('flipX', false);
      setValue('flipY', false);
    }
  }, [duplicateEnabled, flipXEnabled, flipYEnabled]);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger onClick={() => onOpen()}>{children}</DialogTrigger>
      <DialogContent
        onClose={onClose}
        onEscapeKeyDown={onClose}
        onInteractOutside={onClose}
        className="min-w-[600px] bg-solidtecBlack p-0 overflow-hidden"
      >
        <DialogHeader className="p-8 border-b-2 border-solidtecBlackAccent">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form
          className="pt-4 pb-8 px-8"
          onSubmit={handleSubmit((data) => onCallback(data, reset))}
        >
          <Checkbox
            control={control}
            id="duplicate"
            label="Duplicate current layer"
            size="xl"
            checked={duplicateEnabled}
            wrapperClassName="mb-8"
          />
          <Checkbox
            control={control}
            id="flipX"
            label="Flip layer on X axis"
            size="xl"
            wrapperClassName="mb-8"
            checked={flipXEnabled}
            disabled={!duplicateEnabled}
          />
          <Checkbox
            control={control}
            id="flipY"
            label="Flip layer on Y axis"
            size="xl"
            checked={flipYEnabled}
            disabled={!duplicateEnabled}
          />

          <Button
            type="submit"
            className="mt-8"
            size="xl"
            disabled={Object.keys(errors).length > 0}
          >
            Create new layer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type NewLayerModalProps = {
  children: React.ReactNode;
  description?: string;
  onCallback: (data: NewLayerModalValues, reset: UseFormReset<NewLayerModalValues>) => void;
  onClose: () => void;
  onOpen: (modalId?: string) => void;
  isOpen: boolean;
  title: string;
};
