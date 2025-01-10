import { Grid, TextField } from '@mui/material';
import { TablaPrincipal } from '../../types';

interface ResourceInformationProps {
  formData: Partial<TablaPrincipal>;
  handleNumberChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  validationErrors: Record<string, string>;
}

export const ResourceInformation = ({ formData, handleNumberChange, validationErrors }: ResourceInformationProps) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Móviles"
          type="number"
          value={formData.moviles || 0}
          onChange={handleNumberChange('moviles')}
          error={!!validationErrors.moviles}
          helperText={validationErrors.moviles}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="PPSS en Móvil"
          type="number"
          value={formData.ppssEnMovil || 0}
          onChange={handleNumberChange('ppssEnMovil')}
          error={!!validationErrors.ppssEnMovil}
          helperText={validationErrors.ppssEnMovil}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="SSOO"
          type="number"
          value={formData.ssoo || 0}
          onChange={handleNumberChange('ssoo')}
          error={!!validationErrors.ssoo}
          helperText={validationErrors.ssoo}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Pie a Tierra"
          type="number"
          value={formData.pieTierra || 0}
          onChange={handleNumberChange('pieTierra')}
          error={!!validationErrors.pieTierra}
          helperText={validationErrors.pieTierra}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Motos"
          type="number"
          value={formData.motos || 0}
          onChange={handleNumberChange('motos')}
          error={!!validationErrors.motos}
          helperText={validationErrors.motos}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Motos Bitripuladas"
          type="number"
          value={formData.motosBitripuladas || 0}
          onChange={handleNumberChange('motosBitripuladas')}
          error={!!validationErrors.motosBitripuladas}
          helperText={validationErrors.motosBitripuladas}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Hipos"
          type="number"
          value={formData.hipos || 0}
          onChange={handleNumberChange('hipos')}
          error={!!validationErrors.hipos}
          helperText={validationErrors.hipos}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Canes"
          type="number"
          value={formData.canes || 0}
          onChange={handleNumberChange('canes')}
          error={!!validationErrors.canes}
          helperText={validationErrors.canes}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Drones"
          type="number"
          value={formData.drones || 0}
          onChange={handleNumberChange('drones')}
          error={!!validationErrors.drones}
          helperText={validationErrors.drones}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Antidisturbio Apostado"
          type="number"
          value={formData.antidisturbioApostado || 0}
          onChange={handleNumberChange('antidisturbioApostado')}
          error={!!validationErrors.antidisturbioApostado}
          helperText={validationErrors.antidisturbioApostado}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Antidisturbio Alerta"
          type="number"
          value={formData.antidisturbioAlerta || 0}
          onChange={handleNumberChange('antidisturbioAlerta')}
          error={!!validationErrors.antidisturbioAlerta}
          helperText={validationErrors.antidisturbioAlerta}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="GEO Apostado"
          type="number"
          value={formData.geoApostado || 0}
          onChange={handleNumberChange('geoApostado')}
          error={!!validationErrors.geoApostado}
          helperText={validationErrors.geoApostado}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="GEO Alerta"
          type="number"
          value={formData.geoAlerta || 0}
          onChange={handleNumberChange('geoAlerta')}
          error={!!validationErrors.geoAlerta}
          helperText={validationErrors.geoAlerta}
          required
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
    </>
  );
};
