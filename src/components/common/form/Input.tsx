import { forwardRef } from 'react';

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
            className="bg-slate-200 rounded-md py-[12px] px-[16px] w-[80%] text-solidtecBlack"
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
