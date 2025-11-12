import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = (props) => {
  return (
    <select
      className="px-2 py-1.5 rounded-md border border-neutral-300 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
      {...props}
    />
  );
};
