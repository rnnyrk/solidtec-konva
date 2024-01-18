import { FieldError } from 'react-hook-form';

import { Label } from './Label';

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  name,
  error,
  description,
  className,
}) => {
  return (
    <div className={`flex flex-col ${className || ''}`}>
      {label && <Label htmlFor={name}>{label}</Label>}
      {children}
      {(error || description) && (
        <div className="text-red-400 mt-1 text-sm">
          {error?.message || description || 'Dit veld is verplicht'}
        </div>
      )}
    </div>
  );
};

export type FormFieldProps = {
  className?: string;
  name: string;
  children?: React.ReactNode;
  description?: string;
  error?: FieldError | any;
  label?: string;
  margin?: string;
};
