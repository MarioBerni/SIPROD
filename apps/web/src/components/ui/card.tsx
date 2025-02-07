'use client';

import * as React from 'react';
import { Card as MuiCard, CardContent as MuiCardContent, CardHeader as MuiCardHeader, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  '& .MuiCardHeader-root': {
    color: theme.palette.primary.contrastText,
    '& .MuiCardHeader-subheader': {
      color: alpha(theme.palette.primary.contrastText, 0.7),
    },
  },
  '& .MuiCardContent-root': {
    '& .MuiTypography-root': {
      color: theme.palette.primary.contrastText,
    },
    '& .MuiTypography-secondary': {
      color: alpha(theme.palette.primary.contrastText, 0.7),
    },
  },
}));

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCard>>(
  ({ children, ...props }, ref) => (
    <StyledCard ref={ref} {...props}>
      {children}
    </StyledCard>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardHeader>>(
  ({ ...props }, ref) => (
    <MuiCardHeader ref={ref} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends Omit<React.ComponentProps<typeof Typography>, 'ref'> {
  children?: React.ReactNode;
  component?: React.ElementType;
}

const CardTitle: React.FC<CardTitleProps> = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, ...props }, ref) => (
    <Typography ref={ref} variant="h5" component="h3" {...props}>
      {children}
    </Typography>
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardContent>>(
  ({ ...props }, ref) => (
    <MuiCardContent ref={ref} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
