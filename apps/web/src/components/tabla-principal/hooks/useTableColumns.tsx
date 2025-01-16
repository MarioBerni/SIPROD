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
import { stringToColor } from '@/utils/colorUtils';

import {
  TipoOrden,
  TipoOperativo,
  TipoOrdenLabel,
  TipoOperativoLabel
} from '../types/generated';

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

// Componente para mostrar múltiples chips con límite
const LimitedChips = ({ values, limit = 2 }: { values: string[], limit: number }) => {
  const theme = useTheme();
  
  if (!values || values.length === 0) return null;

  const displayValues = values.slice(0, limit);
  const remaining = values.length - limit;

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {displayValues.map((value, index) => (
        <Chip
          key={index}
          label={value}
          size="small"
          sx={{
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.grey[800],
          }}
        />
      ))}
      {remaining > 0 && (
        <Tooltip title={values.slice(limit).join(', ')}>
          <Chip
            label={`+${remaining}`}
            size="small"
            sx={{
              backgroundColor: theme.palette.grey[100],
              color: theme.palette.grey[600],
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

// Función para convertir valores enum a formato legible
const formatEnumValue = (value: string | null | undefined): string => {
  if (!value) return '';
  
  // Primero intentamos obtener el valor de los mapeos específicos
  if (Object.keys(TipoOrdenLabel).includes(value)) {
    return TipoOrdenLabel[value as keyof typeof TipoOrden];
  }
  
  if (Object.keys(TipoOperativoLabel).includes(value)) {
    return TipoOperativoLabel[value as keyof typeof TipoOperativo];
  }
  
  // Si no está en los mapeos específicos, usamos el mapeo general
  const enumMappings: Record<string, string> = {
    // Departamento
    ARTIGAS: 'Artigas',
    CANELONES: 'Canelones',
    CERRO_LARGO: 'Cerro Largo',
    COLONIA: 'Colonia',
    DURAZNO: 'Durazno',
    FLORES: 'Flores',
    FLORIDA: 'Florida',
    LAVALLEJA: 'Lavalleja',
    MALDONADO: 'Maldonado',
    MONTEVIDEO: 'Montevideo',
    PAYSANDU: 'Paysandú',
    RIO_NEGRO: 'Río Negro',
    RIVERA: 'Rivera',
    ROCHA: 'Rocha',
    SALTO: 'Salto',
    SAN_JOSE: 'San José',
    SORIANO: 'Soriano',
    TACUAREMBO: 'Tacuarembó',
    TREINTA_Y_TRES: 'Treinta y Tres',
    
    // Unidad
    DIRECCION_I: 'Dirección I',
    DIRECCION_II: 'Dirección II',
    DIRECCION_III: 'Dirección III',
    DIRECCION_IV: 'Dirección IV',
    DPTO_I: 'Dpto. I',
    DPTO_II: 'Dpto. II',
    DPTO_III: 'Dpto. III',
    DPTO_IV: 'Dpto. IV',
    
    // TiempoOperativo
    PERMANENTE: 'Permanente',
    TRANSITORIO: 'Transitorio'
  };

  return enumMappings[value] || value;
};

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
    headerAlign: 'left',
    align: 'left',
  };

  const columns: GridColDef[] = [
    {
      ...baseColumnProps,
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 120,
      align: 'center',
      headerAlign: 'center',
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
      minWidth: 160,
      flex: 1,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <TruncatedText>
            {formatEnumValue(params.value)}
          </TruncatedText>
        </Box>
      ),
    },
    {
      ...baseColumnProps,
      field: 'unidad',
      headerName: 'Unidad',
      minWidth: 160,
      flex: 1,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <TruncatedText>
            {formatEnumValue(params.value)}
          </TruncatedText>
        </Box>
      ),
    },
    {
      ...baseColumnProps,
      field: 'tipoOrden',
      headerName: 'Tipo de Orden',
      minWidth: 180,
      flex: 1,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <TruncatedText>
            {formatEnumValue(params.value)}
          </TruncatedText>
        </Box>
      ),
    },
    {
      ...baseColumnProps,
      field: 'nroOrden',
      headerName: 'Nro. Orden',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center' 
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      ...baseColumnProps,
      field: 'nombreOperativo',
      headerName: 'Nombre Operativo',
      minWidth: 200,
      flex: 1.2,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return null;
        
        const backgroundColor = stringToColor(params.value);
        const textColor = theme.palette.getContrastText(backgroundColor);
        
        return (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <Chip
              label={params.value}
              size="small"
              sx={{
                backgroundColor,
                color: textColor,
                '&:hover': {
                  backgroundColor: backgroundColor,
                  opacity: 0.9,
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      ...baseColumnProps,
      field: 'tipoOperativo',
      headerName: 'Tipo de Operativo',
      minWidth: 200,
      flex: 1.2,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <TruncatedText>
            {formatEnumValue(params.value)}
          </TruncatedText>
        </Box>
      ),
    },
    {
      ...baseColumnProps,
      field: 'tiempoOperativo',
      headerName: 'Tiempo Operativo',
      minWidth: 180,
      flex: 1,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-start' 
        }}>
          <TruncatedText>
            {formatEnumValue(params.value)}
          </TruncatedText>
        </Box>
      ),
    },
    {
      ...baseColumnProps,
      field: 'seccional',
      headerName: 'Seccional',
      minWidth: 200,
      flex: 1.2,
      align: 'left',
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return null;
        
        const values = Array.isArray(params.value) 
          ? params.value 
          : typeof params.value === 'string'
            ? params.value.split(',').map(v => v.trim())
            : [];
            
        return (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <LimitedChips values={values} limit={2} />
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
      align: 'left',
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return null;
        
        const values = Array.isArray(params.value)
          ? params.value
          : typeof params.value === 'string'
            ? params.value.split(',').map(v => v.trim())
            : [];
            
        return (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <LimitedChips values={values} limit={2} />
          </Box>
        );
      },
    },
    {
      ...baseColumnProps,
      field: 'fechaInicio',
      headerName: 'Fecha Inicio',
      minWidth: 130,
      flex: 1,
      align: 'center',
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
      align: 'center',
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
      align: 'center',
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
      align: 'center',
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
      align: 'left',
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
      field: 'moviles',
      headerName: 'Móviles',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'ppssEnMovil',
      headerName: 'PPSS en Móvil',
      type: 'number',
      minWidth: 160,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'ssoo',
      headerName: 'SSOO',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'motos',
      headerName: 'Motos',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'motosBitripuladas',
      headerName: 'Motos Bitripuladas',
      type: 'number',
      minWidth: 180,
      flex: 1,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'hipos',
      headerName: 'Hipos',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'canes',
      headerName: 'Canes',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'pieTierra',
      headerName: 'Pie Tierra',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'drones',
      headerName: 'Drones',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'antidisturbioApostado',
      headerName: 'Antidisturbio Apostado',
      type: 'number',
      minWidth: 160,
      flex: 1,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'antidisturbioAlerta',
      headerName: 'Antidisturbio Alerta',
      type: 'number',
      minWidth: 160,
      flex: 1,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'geoApostado',
      headerName: 'GEO Apostado',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'geoAlerta',
      headerName: 'GEO Alerta',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
      align: 'center',
    },
    {
      ...baseColumnProps,
      field: 'totalPpss',
      headerName: 'Total PPSS',
      type: 'number',
      minWidth: 120,
      flex: 0.8,
      align: 'center',
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
