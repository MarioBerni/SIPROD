'use client';

import { Box, Container, Paper } from '@mui/material';
import { TableHeader } from '@/components/tabla-principal/components/TableHeader';
import { DataTable } from '@/components/tabla-principal/components/DataTable';
import { AddRecordModal } from '@/components/tabla-principal/components/AddRecordModal';
import { DeleteConfirmationDialog } from '@/components/tabla-principal/components/DeleteConfirmationDialog';
import { useTableData } from '@/components/tabla-principal/hooks/useTableData';
import { useTableColumns } from '@/components/tabla-principal/hooks/useTableColumns';
import { useResponsiveColumns } from '@/components/tabla-principal/hooks/useResponsiveColumns';

export default function TablaPrincipalPage() {
  // Hooks personalizados para manejar la lógica
  const responsive = useResponsiveColumns();
  const {
    rows,
    loading,
    error,
    validationErrors,
    isAddModalOpen,
    editingRecord,
    handleEditClick,
    handleDeleteClick,
    handleAddClick,
    handleAddAfterClick,
    handleCloseAddModal,
    handleSubmit,
    isDeleteDialogOpen,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useTableData();

  // Configuración de columnas usando el hook personalizado
  const columns = useTableColumns({
    responsive,
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
    onAddAfter: handleAddAfterClick,
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          py: 2,
          px: { xs: 1, sm: 2, md: 3 },
          flex: 1,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <TableHeader 
            responsive={responsive}
            onAddClick={handleAddClick}
          />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <DataTable
              rows={rows}
              columns={columns}
              loading={loading}
              error={error}
              responsive={responsive}
            />
          </Box>
        </Paper>
      </Container>

      {/* Modal para agregar/editar registros */}
      <AddRecordModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        validationErrors={validationErrors}
        mode={editingRecord ? 'edit' : 'add'}
        initialData={editingRecord}
      />

      {/* Diálogo de confirmación para eliminar */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </Box>
  );
}