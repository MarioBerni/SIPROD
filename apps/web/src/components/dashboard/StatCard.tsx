import { Card, CardContent, Typography, SvgIconProps } from '@mui/material'

interface StatCardProps {
  title: string
  value: string | number
  Icon: React.ComponentType<SvgIconProps>
}

export default function StatCard({ title, value, Icon }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Icon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        <Typography color="text.secondary">{title}</Typography>
      </CardContent>
    </Card>
  )
}
