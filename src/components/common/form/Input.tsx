import { forwardRef } from 'react';

import { cn } from 'utils';

import { FormField, type FormFieldProps } from './FormField';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      autoFocus,
      className,
      disabled,
      name,
      label,
      error,
      readOnly,
      description,
      margin,
      icon,
      onClick,
      ...props
    },
    ref,
  ) => {
    const IconComponent = icon;

    return (
      <FormField {...{ name, className, label, error, description, margin }}>
        <div className="relative w-full">
          <input
            type="text"
            className={cn(
              'bg-transparent py-[12px] px-[16px] w-[80%]',
              'rounded border-2 border-solidtecGray focus:border-primary outline-0 text-white',
              'disabled:bg-gray-400 disabled:cursor-not-allowed',
            )}
            {...{
              ...{ autoFocus, disabled, name, readOnly },
              ...(ref && { ref }),
            }}
            id={name}
            {...props}
          />
          {icon && (
            <div
              onClick={onClick}
              className="absolute right-4 inset-y-1/2 -mt-3 flex align-center cursor-pointer w-6 h-6"
            >
              {IconComponent}
            </div>
          )}
        </div>
      </FormField>
    );
  },
);

export type InputProps = FormFieldProps & {
  autoFocus?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  name: string;
  icon?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: 'password' | 'text' | 'email';
  value?: string;
};
