'use client';

import * as React from 'react';
import * as CheckboxRadixPrimitive from '@radix-ui/react-checkbox';
import { FieldError, useController } from 'react-hook-form';

import { cn } from 'utils';
import CheckSvg from 'vectors/check.svg';

export function Checkbox({
  control,
  disabled,
  id,
  label,
  onChange,
  size,
  wrapperClassName,
  ...props
}: CheckboxProps) {
  const { field } = useController({
    name: id,
    control,
    disabled,
  });

  return (
    <div className={cn('items-center flex space-x-4', wrapperClassName)}>
      <CheckboxPrimivite
        {...props}
        id={id}
        size={size}
        disabled={field.disabled}
        ref={field.ref}
        name={field.name}
        value={field.value}
        onCheckedChange={(checked) => field.onChange(checked)}
      />
      <label
        htmlFor={id}
        className={cn(
          'font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          {
            'text-lg': size === 'xl',
          },
        )}
      >
        {label}
      </label>
    </div>
  );
}

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimivite> & {
  className?: string;
  control: any;
  error?: FieldError | any;
  label: string;
  id: string;
  wrapperClassName?: string;
  size?: 'xl';
};

const CheckboxPrimivite = React.forwardRef<
  React.ElementRef<typeof CheckboxRadixPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxRadixPrimitive.Root> & { size?: 'xl' }
>(({ className, size, ...props }, ref) => (
  <CheckboxRadixPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-6 w-6 shrink-0 rounded-sm border-2 border-primary ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-30',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
      {
        'w-8 h-8': size === 'xl',
        'border-slate-300': props.disabled,
      },
    )}
    {...props}
  >
    <CheckboxRadixPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckSvg className={cn('h-4 w-4 fill-white')} />
    </CheckboxRadixPrimitive.Indicator>
  </CheckboxRadixPrimitive.Root>
));
CheckboxPrimivite.displayName = CheckboxRadixPrimitive.Root.displayName;
