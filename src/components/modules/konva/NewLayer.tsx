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

export type NewLayerValues = {
  duplicate: boolean;
  flip: boolean;
};

export function NewLayer({
  children,
  description,
  onCallback,
  onClose,
  onOpen,
  isOpen,
  title,
}: NewLayerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<NewLayerValues>();

  const flipEnabled = watch('flip');
  const duplicateEnabled = watch('duplicate');

  useEffect(() => {
    if (
      (!duplicateEnabled && flipEnabled) ||
      (duplicateEnabled && typeof flipEnabled === 'undefined')
    ) {
      setValue('flip', false);
    }
  }, [duplicateEnabled, flipEnabled]);

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
            label="Dupliceer huidige laag"
            size="xl"
            checked={duplicateEnabled}
            wrapperClassName="mb-8"
          />

          <Checkbox
            control={control}
            id="flip"
            label="Flip gedupliceerde laag"
            size="xl"
            checked={flipEnabled}
            disabled={!duplicateEnabled}
          />

          <Button
            type="submit"
            className="mt-8"
            size="xl"
            disabled={Object.keys(errors).length > 0}
          >
            Aanmaken
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type NewLayerProps = {
  children: React.ReactNode;
  description?: string;
  onCallback: (data: NewLayerValues, reset: UseFormReset<NewLayerValues>) => void;
  onClose: () => void;
  onOpen: (modalId?: string) => void;
  isOpen: boolean;
  title: string;
};
