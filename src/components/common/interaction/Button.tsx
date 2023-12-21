import { cn } from 'utils';

export const btnClass = ({
  className,
  size,
  variant,
}: Pick<ButtonProps, 'className' | 'size' | 'variant'>) =>
  cn(
    'py-2 px-4 rounded',
    'text-white font-bold transition-colors	duration-300',
    'disabled:bg-slate-300 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed',
    className,
    {
      'bg-primary border-2 border-primary hover:bg-primaryDark hover:border-primaryDark':
        variant === 'primary',
      'bg-transparent border-2 border-secondary text-secondary hover:bg-secondaryDark hover:border-secondaryDark hover:text-white':
        variant === 'secondary',
      'bg-transparent border-2 border-primary text-primary hover:bg-primaryDark hover:border-primaryDark hover:text-white':
        variant === 'alternative',
      'py-2 px-6 text-lg': size === 'xl',
    },
  );

export const Button = ({
  children,
  className,
  onClick,
  size,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={btnClass({ className, size, variant })}
      {...props}
    >
      {children}
    </button>
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
  size?: 'xl';
  variant?: 'primary' | 'secondary' | 'alternative';
};
