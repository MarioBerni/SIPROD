'use client';

import * as React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none'
}));

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'contained', size = 'medium', color = 'primary', ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        color={color}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
