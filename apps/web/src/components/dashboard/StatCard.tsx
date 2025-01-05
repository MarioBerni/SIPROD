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

interface StatCardProps {
  icon: SvgIconComponent;
  title: string;
  count: number;
  color?: 'primary' | 'secondary' | 'warning' | 'success' | 'error';
  subtitle?: string;
}

export function StatCard({ 
  icon: Icon, 
  title, 
  count, 
  color = 'primary',
  subtitle 
}: StatCardProps) {
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
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                mb: 0.5,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                {subtitle}
              </Typography>
            )}
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem' },
                fontWeight: 700,
                color: theme.palette[color].main,
              }}
            >
              {count}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette[color].main, 0.1),
            }}
          >
            <Icon
              sx={{
                fontSize: 32,
                color: theme.palette[color].main,
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
