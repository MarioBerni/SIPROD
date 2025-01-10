import { useTheme } from '@mui/material';
import { 
  GridColDef, 
  GridActionsCellItem, 
  GridRowParams,
  GridRenderCellParams 
} from '@mui/x-data-grid';
import { Chip, Tooltip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddIcon,
} from '@mui/icons-material';
import { UseResponsiveColumnsReturn } from './useResponsiveColumns';

interface UseTableColumnsProps {
  responsive: UseResponsiveColumnsReturn;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddAfter: (id: string) => void;
}

// Componente estilizado para el texto truncado
const TruncatedText = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
});

export const useTableColumns = ({
  responsive,
  onEdit,
  onDelete,
  onAddAfter,
}: UseTableColumnsProps): GridColDef[] => {
  const theme = useTheme();
  const { isMobile, isTablet } = responsive;

  const baseColumnProps: Partial<GridColDef> = {
    sortable: true,
    filterable: true,
  };

  const columns: GridColDef[] = [
    {
      ...baseColumnProps,
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => onEdit(params.id.toString())}
          showInMenu={isMobile}
        />,
        <GridActionsCellItem
          key="add"
          icon={<AddIcon />}
          label="Agregar Después"
          onClick={() => onAddAfter(params.id.toString())}
          showInMenu={isMobile}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => onDelete(params.id.toString())}
          showInMenu={isMobile}
        />,
      ],
    },
    {
      ...baseColumnProps,
      field: 'departamento',
      headerName: 'Departamento',
      minWidth: 150,
      flex: 1.2,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          }}
        />
      ),
    },
    {
      ...baseColumnProps,
      field: 'unidad',
      headerName: 'Unidad',
      minWidth: 150,
      flex: 1,
    },
    {
      ...baseColumnProps,
      field: 'tipoOrden',
      headerName: 'Tipo Orden',
      minWidth: 130,
      flex: 1,
    },
    {
      ...baseColumnProps,
      field: 'nroOrden',
      headerName: 'Nro. Orden',
      minWidth: 120,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'tipoOperativo',
      headerName: 'Tipo Operativo',
      minWidth: 180,
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.contrastText,
          }}
        />
      ),
    },
    {
      ...baseColumnProps,
      field: 'tiempoOperativo',
      headerName: 'Tiempo Operativo',
      minWidth: 150,
      flex: 1.2,
    },
    {
      ...baseColumnProps,
      field: 'nombreOperativo',
      headerName: 'Nombre Operativo',
      minWidth: 200,
      flex: 2,
    },
    {
      ...baseColumnProps,
      field: 'fechaInicio',
      headerName: 'Fecha Inicio',
      minWidth: 130,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        try {
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return '-';
          return date.toLocaleDateString('es-UY');
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
      }
    },
    {
      ...baseColumnProps,
      field: 'horaInicio',
      headerName: 'Hora Inicio',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        try {
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return '-';
          return date.toLocaleTimeString('es-UY', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        } catch (error) {
          console.error('Error formatting time:', error);
          return '-';
        }
      }
    },
    {
      ...baseColumnProps,
      field: 'fechaFin',
      headerName: 'Fecha Fin',
      minWidth: 130,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        try {
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return '-';
          return date.toLocaleDateString('es-UY');
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
      }
    },
    {
      ...baseColumnProps,
      field: 'horaFin',
      headerName: 'Hora Fin',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        try {
          const date = new Date(params.value);
          if (isNaN(date.getTime())) return '-';
          return date.toLocaleTimeString('es-UY', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        } catch (error) {
          console.error('Error formatting time:', error);
          return '-';
        }
      }
    },
    {
      ...baseColumnProps,
      field: 'observacionesOrden',
      headerName: 'Observaciones',
      minWidth: 200,
      flex: 2,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '-';
        return (
          <Tooltip title={params.value} placement="top-start">
            <TruncatedText>
              {params.value}
            </TruncatedText>
          </Tooltip>
        );
      }
    },
    {
      ...baseColumnProps,
      field: 'seccional',
      headerName: 'Seccional',
      minWidth: 180,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return <Box>-</Box>;
        
        const seccionales = Array.isArray(params.value) ? params.value : [params.value];
        
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {seccionales.map((seccional: string, index: number) => (
              <Chip
                key={`${seccional}-${index}`}
                label={seccional}
                size="small"
                sx={{ 
                  maxWidth: '120px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      ...baseColumnProps,
      field: 'barrios',
      headerName: 'Barrios',
      minWidth: 200,
      flex: 1.2,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value || !Array.isArray(params.value)) {
          return <Box>-</Box>;
        }
        
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {params.value.map((barrio: string, index: number) => (
              <Chip
                key={`${barrio}-${index}`}
                label={barrio}
                size="small"
                sx={{ 
                  maxWidth: '150px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      ...baseColumnProps,
      field: 'moviles',
      headerName: 'Móviles',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'ppssEnMovil',
      headerName: 'PPSS en Móvil',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'ssoo',
      headerName: 'SSOO',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'motos',
      headerName: 'Motos',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'motosBitripuladas',
      headerName: 'Motos Bitripuladas',
      type: 'number',
      minWidth: 140,
      flex: 1,
    },
    {
      ...baseColumnProps,
      field: 'hipos',
      headerName: 'Hipos',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'canes',
      headerName: 'Canes',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'pieTierra',
      headerName: 'Pie Tierra',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'drones',
      headerName: 'Drones',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'antidisturbioApostado',
      headerName: 'Antidisturbio Apostado',
      type: 'number',
      minWidth: 160,
      flex: 1,
    },
    {
      ...baseColumnProps,
      field: 'antidisturbioAlerta',
      headerName: 'Antidisturbio Alerta',
      type: 'number',
      minWidth: 160,
      flex: 1,
    },
    {
      ...baseColumnProps,
      field: 'geoApostado',
      headerName: 'GEO Apostado',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'geoAlerta',
      headerName: 'GEO Alerta',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
    },
    {
      ...baseColumnProps,
      field: 'totalPpss',
      headerName: 'Total PPSS',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: theme.palette.success.light,
            color: theme.palette.success.contrastText,
          }}
        />
      ),
    },
  ];

  // Filtrado responsivo de columnas
  return columns.filter(column => {
    if (isMobile) {
      return ['actions', 'departamento', 'tipoOperativo', 'nombreOperativo', 'fechaInicio', 'totalPpss'].includes(column.field);
    }
    if (isTablet) {
      return ['actions', 'departamento', 'unidad', 'tipoOperativo', 'nombreOperativo', 'fechaInicio', 'horaInicio', 'totalPpss', 'moviles', 'ppssEnMovil'].includes(column.field);
    }
    return true;
  });
};
