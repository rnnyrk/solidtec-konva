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
    'text-white font-bold transition-colors	duration-300',
    'disabled:bg-slate-200 disabled:cursor-not-allowed',
    className,
    {
      'bg-primary border-2 border-primary hover:bg-primaryDark hover:border-primaryDark':
        variant === 'primary',
      'bg-transparent border-2 border-secondary text-secondary hover:bg-secondaryDark hover:border-secondaryDark hover:text-white':
        variant === 'secondary',
      'bg-transparent border-2 border-primary text-primary hover:bg-primaryDark hover:border-primaryDark hover:text-white':
        variant === 'alternative',
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
  variant?: 'primary' | 'secondary' | 'alternative';
};
