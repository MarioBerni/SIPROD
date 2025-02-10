import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  Chip,
  alpha
} from '@mui/material';
import { mockTransitoryServices } from '@/data/__mocks__/transitoryServicesMock';
import SportsIcon from '@mui/icons-material/Sports';
import SearchIcon from '@mui/icons-material/Search';

const getServiceIcon = (type: string) => {
  switch (type) {
    case 'AUF':
    case 'FUBB':
      return SportsIcon;
    case 'ALLANAMIENTO':
      return SearchIcon;
    default:
      return SportsIcon;
  }
};

const getServiceColor = (type: string) => {
  switch (type) {
    case 'AUF':
      return '#2196F3'; // Azul
    case 'FUBB':
      return '#4CAF50'; // Verde
    case 'ALLANAMIENTO':
      return '#F44336'; // Rojo
    default:
      return '#9E9E9E'; // Gris
  }
};

export const TransitoryServicesCard = () => {
  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: '#fafafa',
        borderRadius: 2,
        boxShadow: 'none'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2,
          fontWeight: 500,
          color: 'text.primary'
        }}
      >
        Servicios transitorios previstos para el día actual:
      </Typography>
      <List sx={{ p: 0 }}>
        {mockTransitoryServices.map((service) => {
          const ServiceIcon = getServiceIcon(service.type);
          const serviceColor = getServiceColor(service.type);

          return (
            <ListItem
              key={service.id}
              sx={{
                px: 2,
                py: 1.5,
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: `0 2px 4px ${alpha('#000', 0.05)}`,
                '&:last-child': {
                  mb: 0
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  width: '100%'
                }}
              >
                <ServiceIcon 
                  sx={{ 
                    color: serviceColor,
                    mr: 2,
                    mt: 0.5
                  }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <ListItemText
                    primary={service.title}
                    secondary={
                      <Chip
                        label={service.timeRange}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: alpha(serviceColor, 0.1),
                          color: serviceColor,
                          fontWeight: 500
                        }}
                      />
                    }
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  />
                </Box>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
