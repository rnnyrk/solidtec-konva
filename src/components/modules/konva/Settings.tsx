import { useModal } from 'hooks';
import { btnClass } from 'common/interaction/Button';

import { BlockSettingsModal } from './modals/BlockSettingsModal';

export function Settings() {
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  return (
    <BlockSettingsModal
      onClose={onCloseModal}
      onOpen={onOpenModal}
      isOpen={isOpen}
    >
      <div
        className={btnClass({
          className: 'flex justify-center w-full',
          variant: 'secondary',
          size: 'xl',
        })}
      >
        Settings
      </div>
    </BlockSettingsModal>
  );
}
