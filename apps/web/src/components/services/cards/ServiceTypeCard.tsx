import { Card, CardContent, Typography, Box } from '@mui/material';
import { CalendarMonth, School, BeachAccess } from '@mui/icons-material';

interface ServiceTypeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const getIconByTitle = (title: string) => {
  switch (title) {
    case 'Jefe de Día':
      return <CalendarMonth sx={{ fontSize: 40 }} />;
    case 'Curso':
      return <School sx={{ fontSize: 40 }} />;
    case 'Licencia':
      return <BeachAccess sx={{ fontSize: 40 }} />;
    default:
      return <CalendarMonth sx={{ fontSize: 40 }} />;
  }
};

export const ServiceTypeCard = ({
  title,
  description,
  selected,
  onClick
}: ServiceTypeCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        border: (theme) =>
          selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: (theme) => theme.shadows[4]
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 2
          }}
        >
          <Box
            sx={{
              color: (theme) =>
                selected ? theme.palette.primary.main : theme.palette.text.secondary,
              transition: 'color 0.2s ease-in-out'
            }}
          >
            {getIconByTitle(title)}
          </Box>
          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{
              color: (theme) =>
                selected ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: selected ? 600 : 500
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ minHeight: '2.5em' }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
