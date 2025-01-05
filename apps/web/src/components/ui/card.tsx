'use client';

import * as React from 'react';
import { Card as MuiCard, CardContent as MuiCardContent, CardHeader as MuiCardHeader, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
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

const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof Typography>>(
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
