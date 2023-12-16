import { cn } from 'utils';

export const Button = ({ children, className, onClick, ...props }: ButtonProps) => {
  const btnClass = cn(
    'mb-2 py-2 px-4 rounded',
    'text-white font-bold bg-blue-500 hover:bg-blue-700',
    'disabled:bg-slate-200 disabled:cursor-not-allowed',
    className,
  );

  return (
    <button
      onClick={onClick}
      className={btnClass}
      {...props}
    >
      {children}
    </button>
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
};
