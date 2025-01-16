import { alpha, Box, CircularProgress, Typography } from '@mui/material';
import { 
  DataGrid, 
  GridToolbar, 
  GridColDef,
  GridEventListener,
  GridRowParams,
  GridFilterModel,
  GridFilterOperator,
  getGridStringOperators,
  getGridDateOperators,
  getGridNumericOperators,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { TablaPrincipal } from '../types';
import { UseResponsiveColumnsReturn } from '../hooks/useResponsiveColumns';
import { useTheme } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';

// Operadores personalizados para filtros
const customStringOperators: GridFilterOperator[] = getGridStringOperators().map(operator => ({
  ...operator,
  label: operator.label === 'contains' ? 'contiene' :
         operator.label === 'equals' ? 'es igual a' :
         operator.label === 'startsWith' ? 'comienza con' :
         operator.label === 'endsWith' ? 'termina con' :
         operator.label === 'isEmpty' ? 'está vacío' :
         operator.label === 'isNotEmpty' ? 'no está vacío' :
         operator.label,
}));

const customDateOperators: GridFilterOperator[] = getGridDateOperators().map(operator => ({
  ...operator,
  label: operator.label === 'is' ? 'es' :
         operator.label === 'not' ? 'no es' :
         operator.label === 'after' ? 'después de' :
         operator.label === 'onOrAfter' ? 'en o después de' :
         operator.label === 'before' ? 'antes de' :
         operator.label === 'onOrBefore' ? 'en o antes de' :
         operator.label,
}));

const customNumericOperators: GridFilterOperator[] = getGridNumericOperators().map(operator => ({
  ...operator,
  label: operator.label === '=' ? 'igual a' :
         operator.label === '≠' ? 'diferente de' :
         operator.label === '>' ? 'mayor que' :
         operator.label === '>=' ? 'mayor o igual que' :
         operator.label === '<' ? 'menor que' :
         operator.label === '<=' ? 'menor o igual que' :
         operator.label,
}));

interface PaginationLabelDisplayedRowsArgs {
  from: number;
  to: number;
  count: number;
}

const localeText = {
  // Mensajes generales
  noRowsLabel: 'Sin registros',
  noResultsOverlayLabel: 'No se encontraron resultados.',
  errorOverlayDefaultLabel: 'Ha ocurrido un error.',

  // Densidad
  toolbarDensity: 'Densidad',
  toolbarDensityLabel: 'Densidad',
  toolbarDensityCompact: 'Compacta',
  toolbarDensityStandard: 'Estándar',
  toolbarDensityComfortable: 'Cómoda',

  // Columnas
  toolbarColumns: 'Columnas',
  toolbarColumnsLabel: 'Seleccionar columnas',

  // Panel de columnas
  columnsPanelTextFieldLabel: 'Encontrar columna',
  columnsPanelTextFieldPlaceholder: 'Título de columna',
  columnsPanelDragIconLabel: 'Reordenar columna',
  columnsPanelShowAllButton: 'Mostrar todo',
  columnsPanelHideAllButton: 'Ocultar todo',

  // Filtros
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
  filterPanelAddFilter: 'Agregar filtro',
  filterPanelRemoveAll: 'Remover todos',
  filterPanelDeleteIconLabel: 'Borrar',
  filterPanelLogicOperator: 'Operador lógico',
  filterPanelOperator: 'Operador',
  filterPanelOperatorAnd: 'Y',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor de filtro',

  // Búsqueda rápida
  toolbarQuickFilterPlaceholder: 'Buscar...',
  toolbarQuickFilterLabel: 'Buscar',
  toolbarQuickFilterDeleteIconLabel: 'Limpiar',

  // Exportar
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descargar como CSV',
  toolbarExportPrint: 'Imprimir',
  toolbarExportExcel: 'Descargar como Excel',

  // Paginación
  footerRowSelected: (count: number) =>
    count !== 1
      ? `${count.toLocaleString()} filas seleccionadas`
      : `${count.toLocaleString()} fila seleccionada`,
  footerTotalRows: 'Filas Totales:',
  footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
  labelRowsPerPage: 'Filas por página:',
  labelDisplayedRows: ({ from, to, count }: PaginationLabelDisplayedRowsArgs) => {
    return `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`;
  },
  MuiTablePagination: {
    labelRowsPerPage: 'Filas por página:',
    labelDisplayedRows: ({ from, to, count }: PaginationLabelDisplayedRowsArgs) =>
      `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
  },

  // Selección
  checkboxSelectionHeaderName: 'Selección',
  checkboxSelectionSelectAllRows: 'Seleccionar todas las filas',
  checkboxSelectionUnselectAllRows: 'Deseleccionar todas las filas',
  checkboxSelectionSelectRow: 'Seleccionar fila',
  checkboxSelectionUnselectRow: 'Deseleccionar fila',

  // Operadores de filtro
  filterOperatorContains: 'contiene',
  filterOperatorEquals: 'es igual a',
  filterOperatorStartsWith: 'comienza con',
  filterOperatorEndsWith: 'termina con',
  filterOperatorIs: 'es',
  filterOperatorNot: 'no es',
  filterOperatorAfter: 'es después',
  filterOperatorOnOrAfter: 'es en o después',
  filterOperatorBefore: 'es antes',
  filterOperatorOnOrBefore: 'es en o antes',
  filterOperatorIsEmpty: 'está vacío',
  filterOperatorIsNotEmpty: 'no está vacío',
  filterOperatorIsAnyOf: 'es cualquiera de',

  // Menú de columnas
  columnMenuLabel: 'Menú',
  columnMenuShowColumns: 'Mostrar columnas',
  columnMenuManageColumns: 'Administrar columnas',
  columnMenuFilter: 'Filtrar',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Desordenar',
  columnMenuSortAsc: 'Ordenar ASC',
  columnMenuSortDesc: 'Ordenar DESC',
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortLabel: 'Ordenar',
  columnHeaderFilterLabel: 'Filtrar',

  // Otros
  booleanCellTrueLabel: 'Sí',
  booleanCellFalseLabel: 'No'
}

interface DataTableProps {
  rows: TablaPrincipal[];
  columns: GridColDef[];
  loading: boolean;
  error?: string | null;
  onRowClick?: (row: TablaPrincipal) => void;
  responsive: UseResponsiveColumnsReturn;
}

// Configuración de virtualización
const VIRTUALIZATION_CONFIG = {
  rowBufferPx: 60,
  columnBufferPx: 30,
};

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  backgroundColor: theme.palette.background.paper,
  '& .MuiDataGrid-main': {
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  // Estilo para el encabezado
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '0.95rem',
    minHeight: '60px !important',
    maxHeight: 'unset !important',
    lineHeight: '1.2',
  },
  // Estilo específico para las celdas de cabecera
  '& .MuiDataGrid-columnHeader': {
    height: 'unset !important',
    maxHeight: 'unset !important',
    whiteSpace: 'normal',
    padding: '8px',
    '& .MuiDataGrid-columnHeaderTitle': {
      whiteSpace: 'normal',
      lineHeight: '1.2',
      overflow: 'visible',
      textOverflow: 'unset',
    },
  },
  // Ajustar altura y alineación de las filas
  '& .MuiDataGrid-row': {
    minHeight: '52px !important',
    '&:nth-of-type(even)': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
      },
    },
  },
  // Estilo para las celdas
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    fontSize: '0.9rem',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-within': {
      outline: 'none',
    },
  },
  // Estilo para el contenido de las celdas
  '& .MuiDataGrid-cellContent': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'inherit',
  },
  // Estilo para el footer
  '& .MuiDataGrid-footerContainer': {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  // Estilo para los botones de paginación
  '& .MuiPaginationItem-root': {
    borderRadius: theme.shape.borderRadius,
  },
  // Estilo para el toolbar
  '& .MuiDataGrid-toolbarContainer': {
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
  // Estilo para los checkboxes
  '& .MuiCheckbox-root': {
    color: theme.palette.primary.main,
  },
  // Estilo para los iconos de ordenamiento
  '& .MuiDataGrid-sortIcon': {
    color: alpha(theme.palette.primary.main, 0.7),
  },
  // Estilo para el ícono de menú de columnas
  '& .MuiDataGrid-menuIcon': {
    color: alpha(theme.palette.primary.main, 0.7),
  },
  // Estilo para el mensaje de no-rows
  '& .MuiDataGrid-overlay': {
    backgroundColor: alpha(theme.palette.background.paper, 0.8)
  }
}));

export const DataTable = ({ 
  rows, 
  columns, 
  loading, 
  error,
  onRowClick,
  responsive 
}: DataTableProps) => {
  const theme = useTheme();
  const { isMobile } = responsive;
  
  // Estado para filtros
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });

  // Estado para paginación
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: isMobile ? 10 : 25,
    page: 0,
  });

  // Memorizar las columnas para evitar re-renders innecesarios
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Memorizar los rows para evitar re-renders innecesarios
  const memoizedRows = useMemo(() => rows, [rows]);

  // Manejador de eventos de click optimizado
  const handleRowClick: GridEventListener<'rowClick'> = useCallback((
    params: GridRowParams,
  ) => {
    if (onRowClick) {
      onRowClick(params.row as TablaPrincipal);
    }
  }, [onRowClick]);

  // Manejador de cambio de filtros
  const handleFilterModelChange = useCallback((model: GridFilterModel) => {
    setFilterModel(model);
  }, []);

  // Manejador de cambio de paginación
  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
  }, []);

  return (
    <Box 
      sx={{ 
        flex: 1, 
        width: '100%', 
        overflow: 'hidden',
        position: 'relative',
        '& .super-app-theme--header': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          fontSize: theme.typography.pxToRem(14),
          minHeight: '48px',
          height: '48px !important',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'normal',
        },
        '& .MuiDataGrid-root': {
          '& ::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '& ::-webkit-scrollbar-track': {
            background: theme.palette.grey[200],
          },
          '& ::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.grey[500],
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[200]}`,
        },
        '& .MuiDataGrid-virtualScroller': {
          minHeight: '300px',
          maxHeight: '600px',
          overflow: 'auto',
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.primary.main, 0.05),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            },
          },
        },
        '& .MuiDataGrid-columnHeaders': {
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
        '& .MuiDataGrid-cell': {
          padding: '8px 16px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          '&:focus': {
            outline: 'none',
          },
        },
        '& .MuiDataGrid-row': {
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      
      <StyledDataGrid
        rows={memoizedRows}
        columns={memoizedColumns.map(column => ({
          ...column,
          filterOperators: column.type === 'string' ? customStringOperators :
                          column.type === 'date' || column.type === 'dateTime' ? customDateOperators :
                          column.type === 'number' ? customNumericOperators :
                          undefined,
        }))}
        loading={loading}
        slots={{
          toolbar: GridToolbar,
          loadingOverlay: () => (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ),
          noRowsOverlay: () => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 2,
              }}
            >
              {error ? (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              ) : (
                <Typography color="text.secondary" align="center">
                  No hay registros disponibles
                </Typography>
              )}
            </Box>
          ),
        }}
        localeText={localeText}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {
              debounceMs: 500,
              placeholder: 'Buscar...',
            },
          },
          pagination: {
            labelRowsPerPage: 'Filas por página:',
          },
        }}
        rowBufferPx={VIRTUALIZATION_CONFIG.rowBufferPx}
        columnBufferPx={VIRTUALIZATION_CONFIG.columnBufferPx}
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 40}
        onRowClick={handleRowClick}
        rowSelection={false}
        disableColumnMenu={false}
        checkboxSelection
        disableRowSelectionOnClick
        density={isMobile ? 'compact' : 'comfortable'}
        columnHeaderHeight={60}
        autoHeight
        sx={{
          border: 'none',
          backgroundColor: theme.palette.background.paper,
          '& .MuiDataGrid-main': { 
            width: '100%',
          },
        }}
      />
    </Box>
  );
};
