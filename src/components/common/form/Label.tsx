import { cn } from 'utils';

export function Label({ children, className, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('text-sm font-semibold mb-[2px]', className)}
    >
      {children}
    </label>
  );
}

type LabelProps = {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
};
