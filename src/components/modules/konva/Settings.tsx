import { useModal } from 'hooks';
import { btnClass } from 'common/interaction/Button';

import { BlockSettingsModal } from './BlockSettingsModal';

export function Settings() {
  const [isOpen, onOpenModal, onCloseModal] = useModal();

  return (
    <div className="absolute left-2/4 -translate-x-2/4 top-4 z-20">
      <BlockSettingsModal
        onClose={onCloseModal}
        onOpen={onOpenModal}
        isOpen={isOpen}
      >
        <div
          className={btnClass({
            className: 'flex items-center',
            variant: 'secondary',
            size: 'xl',
          })}
        >
          Settings
        </div>
      </BlockSettingsModal>
    </div>
  );
}
