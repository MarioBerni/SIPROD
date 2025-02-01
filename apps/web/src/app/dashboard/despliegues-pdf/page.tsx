'use client';

import { useState, useEffect } from 'react';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import FilterForm from './components/FilterForm';
import { Box, Paper, Container, Typography, useTheme, Button, CircularProgress, LinearProgress } from '@mui/material';
import { generateSimplePDF } from './utils/pdfUtils';
import { FilterFormState } from './types';

export default function DesplieguesPdfPage() {
  const { setPageTitle } = usePageTitle();
  const theme = useTheme();
  const [filters, setFilters] = useState<FilterFormState>({
    unidades: [],
    tiempoOperativo: [],
    nombreOperativo: [],
    turnos: [],
    organizarPor: '',
    customTables: [],
    incluirInforme: false,
    customGroups: {},
    groupTitles: {},
    descripcion: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDescripcion, setShowDescripcion] = useState(false);

  useEffect(() => {
    setPageTitle('Despliegues PDF', PdfIcon);
  }, [setPageTitle]);

  const handleFilterChange = (newFilters: FilterFormState) => {
    setFilters(newFilters);
  };

  const handleToggleDescripcion = () => {
    setShowDescripcion(!showDescripcion);
    if (showDescripcion) {
      // Si estamos ocultando la descripción, la limpiamos
      setFilters(prev => ({ ...prev, descripcion: '' }));
    }
  };

  const handleGeneratePDF = async () => {
    if (!filters.organizarPor) {
      // Mostrar error o notificación al usuario
      alert('Por favor, seleccione una opción en "Organizar por" antes de generar el PDF');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await generateSimplePDF(filters);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1,
        py: { xs: 2, md: 4 },
        px: { xs: 1, md: 3 },
        bgcolor: theme.palette.background.default,
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={2}
          sx={{ 
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                mb: 1
              }}
            >
              Generador de Despliegues PDF
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Personaliza y genera informes PDF de despliegues operativos con los filtros y opciones que necesites.
            </Typography>
          </Box>

          <FilterForm
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleToggleDescripcion}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
              }}
            >
              {showDescripcion ? 'Ocultar descripción' : 'Agregar descripción'}
            </Button>
            
            {showDescripcion && (
              <Box 
                component="textarea"
                sx={{
                  width: '100%',
                  mt: 2,
                  p: 2,
                  minHeight: '100px',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  '&:focus': {
                    outline: 'none',
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
                  },
                }}
                placeholder="Ingrese una descripción para el informe..."
                value={filters.descripcion}
                onChange={(e) => setFilters(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            )}
          </Box>

          <Box 
            sx={{ 
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              minHeight: 60
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              startIcon={<PdfIcon fontSize="small" />}
              sx={{
                px: 3,
                py: 0.75,
                borderRadius: 1.5,
                fontSize: '0.875rem',
                textTransform: 'none',
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out',
                },
                '&:disabled': {
                  bgcolor: theme.palette.action.disabledBackground,
                },
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                opacity: isGeneratingPDF ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
            >
              Generar PDF
            </Button>
            
            {isGeneratingPDF && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                  maxWidth: 300,
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translate(-50%, -40%)' },
                    to: { opacity: 1, transform: 'translate(-50%, -50%)' }
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={24} thickness={4} />
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    Generando PDF
                  </Typography>
                </Box>
                
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block', 
                      mb: 0.75,
                      textAlign: 'center'
                    }}
                  >
                    Por favor espera mientras procesamos tu documento...
                  </Typography>
                  <LinearProgress 
                    sx={{ 
                      height: 6,
                      borderRadius: 3,
                      bgcolor: `${theme.palette.primary.main}15`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 3
                      }
                    }} 
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
