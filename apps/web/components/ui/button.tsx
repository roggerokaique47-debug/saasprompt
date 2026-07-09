import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
      ghost: 'text-foreground hover:bg-muted',
      outline: 'border border-border hover:bg-muted',
    };
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      default: 'h-11 px-5 text-sm',
      lg: 'h-13 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
