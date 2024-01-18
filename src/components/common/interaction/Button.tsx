import { cn } from 'utils';

export const btnClass = ({
  className,
  isIconOnly,
  size,
  variant,
}: Pick<ButtonProps, 'className' | 'isIconOnly' | 'size' | 'variant'>) =>
  cn(
    'py-2 px-4 text-white font-bold transition-colors	duration-300',
    'disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed',
    {
      'bg-primary border-2 border-primary hover:bg-primaryDark hover:border-primaryDark':
        variant === 'primary',
      'bg-transparent border-2 border-secondary text-secondary hover:bg-secondaryDark hover:border-secondaryDark hover:text-white':
        variant === 'secondary',
      'bg-transparent border-2 border-primary text-primary hover:bg-primaryDark hover:border-primaryDark hover:text-white':
        variant === 'alternative',
      'bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed': variant === 'disabled',
      'py-2 px-6 text-lg': size === 'xl',
      'w-14 h-14 flex items-center justify-center px-2 py-2': isIconOnly,
    },
    className,
  );

export const Button = ({
  children,
  className,
  onClick,
  isIconOnly,
  size,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={btnClass({ className, isIconOnly, size, variant })}
      {...props}
    >
      {children}
    </button>
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
  isIconOnly?: boolean;
  size?: 'xl';
  variant?: 'primary' | 'secondary' | 'alternative' | 'disabled';
};
