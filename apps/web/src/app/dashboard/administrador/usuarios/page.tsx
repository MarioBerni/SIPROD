'use client';

import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CircularProgress,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useUsers } from './hooks/useUsers';
import { UserDialog } from './components/UserDialog';
import { UsersTable } from './components/UsersTable';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  margin: '0 auto',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& .MuiTableContainer-root': {
    maxHeight: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
}));

export default function UsersPage() {
  const {
    users,
    loading,
    error,
    openDialog,
    editingId,
    formData,
    loadUsers,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseDialog,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleDelete
  } = useUsers();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <PageContainer>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreateDialog}
          disabled={loading}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <StyledCard>
          <UsersTable
            users={users}
            onEdit={handleOpenEditDialog}
            onDelete={handleDelete}
          />
        </StyledCard>
      )}

      <UserDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        error={error}
        isEditing={!!editingId}
        loading={loading}
      />
    </PageContainer>
  );
}