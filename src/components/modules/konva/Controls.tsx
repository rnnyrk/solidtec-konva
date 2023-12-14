import { cn } from 'utils';

export function Controls({ onAddRect, onRotateRect, isSelected }: ControlProps) {
  const btnClass = cn(
    'mb-2 py-2 px-4 rounded',
    'text-white font-bold bg-blue-500 hover:bg-blue-700',
    'disabled:bg-slate-200 disabled:cursor-not-allowed',
  );

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col">
      <button
        className={btnClass}
        onClick={onAddRect}
      >
        Add new rect
      </button>
      <button
        className={btnClass}
        onClick={onRotateRect}
        disabled={!isSelected}
      >
        Rotate rect
      </button>
    </div>
  );
}

type ControlProps = {
  onAddRect: () => void;
  onRotateRect: () => void;
  isSelected: boolean;
};
