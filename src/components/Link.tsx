import React from 'react';
import { navigate } from '../utils/navigation';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export function Link({ to, children, className, onClick, ...props }: LinkProps) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick(e);
        navigate(to);
      }}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
