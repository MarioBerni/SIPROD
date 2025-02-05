'use client';

import { FC } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { Card, CardContent } from '@/components/ui/card';
import { SvgIconComponent } from '@mui/icons-material';

interface ResourceCardProps {
  icon: SvgIconComponent;
  title: string;
  count: number | string;
}

export const ResourceCard: FC<ResourceCardProps> = ({
  icon: Icon,
  title,
  count,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
            mb: 2,
          }}
        >
          <Icon
            sx={{
              fontSize: 32,
              color: theme.palette.primary.contrastText,
            }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: alpha(theme.palette.primary.contrastText, 0.7),
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};
