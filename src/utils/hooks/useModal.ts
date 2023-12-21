import { useState } from 'react';

type UseModalReturn = [boolean, (modalId?: string) => void, () => void, string | undefined];

export const useModal = (): UseModalReturn => {
  const [open, setOpen] = useState<string | undefined>(undefined);

  const openModal = (modalId?: string) => setOpen(modalId || 'open');
  const closeModal = () => setOpen(undefined);

  return [Boolean(open), openModal, closeModal, open];
};
