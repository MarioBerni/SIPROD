'use client';

import * as React from 'react';
import { FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    opacity: 0.7,
  }
}));

interface LabelProps extends Omit<React.ComponentProps<typeof FormLabel>, 'ref'> {
  htmlFor?: string;
  children?: React.ReactNode;
}

const Label: React.FC<LabelProps> = React.forwardRef<HTMLLabelElement, LabelProps>(
  (props, ref) => (
    <StyledLabel ref={ref} {...props} />
  )
);
Label.displayName = 'Label';

export { Label };
