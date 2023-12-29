import { useState } from 'react';

export type ModalProps = {
  onClose: () => void;
  onOpen: (modalId?: string) => void;
  isOpen: boolean;
};

type UseModalReturn = [
  ModalProps['isOpen'],
  ModalProps['onOpen'],
  ModalProps['onClose'],
  string | undefined,
];

export const useModal = (): UseModalReturn => {
  const [open, setOpen] = useState<string | undefined>(undefined);

  const openModal = (modalId?: string) => setOpen(modalId || 'open');
  const closeModal = () => setOpen(undefined);

  return [Boolean(open), openModal, closeModal, open];
};
