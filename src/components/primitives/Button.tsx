import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'secondary', className, ...props }) => {
  const classes = clsx(
    'px-3 py-1.5 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600',
    {
      'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200': variant === 'secondary',
      'bg-transparent text-neutral-900 hover:bg-neutral-100': variant === 'ghost',
    },
    className,
  );
  return <button className={classes} {...props} />;
};
