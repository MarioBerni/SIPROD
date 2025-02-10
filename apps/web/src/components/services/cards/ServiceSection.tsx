import { Box, Stack, Typography } from '@mui/material';
import { Service } from '@/types/service';

interface ServiceSectionProps {
  title: string;
  icon: React.ElementType;
  services: Service[];
  onServiceSelect?: (service: Service) => void;
  customContent?: React.ReactNode;
}

export const ServiceSection = ({
  title,
  icon: Icon,
  services,
  customContent,
}: ServiceSectionProps) => {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Icon />
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="caption" sx={{ ml: 'auto' }}>
          ({services.length})
        </Typography>
      </Stack>
      {customContent}
    </Box>
  );
};
