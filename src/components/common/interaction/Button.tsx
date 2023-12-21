import { cn } from 'utils';

export const Button = ({
  children,
  className,
  onClick,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const btnClass = cn(
    'mb-2 py-2 px-4 rounded',
    'text-white font-bold transition-colors	',
    'disabled:bg-slate-200 disabled:cursor-not-allowed',
    className,
    {
      'bg-blue-500 hover:bg-blue-700': variant === 'primary',
      'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-white hover:border-white':
        variant === 'secondary',
    },
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
  variant?: 'primary' | 'secondary';
};
