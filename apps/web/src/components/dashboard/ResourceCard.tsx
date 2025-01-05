'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface ResourceCardProps {
  icon: SvgIconComponent;
  title: string;
  count: number;
}

export function ResourceCard({ icon: Icon, title, count }: ResourceCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
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
            p: 1,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            mb: 2,
          }}
        >
          <Icon
            sx={{
              fontSize: 32,
              color: theme.palette.primary.main,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
}
