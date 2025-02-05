import { Assignment, Officer } from '../../types';

export interface AssignmentFormData {
  officerId: string;
  startDate: string;
  endDate: string;
  type: 'direccionI' | 'direccionII' | 'geo';
  description?: string;
}

export interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: AssignmentFormData) => Promise<void>;
  officers: Officer[];
  initialData?: Assignment;
}

export interface AssignmentFormProps {
  onSubmit: (data: AssignmentFormData) => Promise<void>;
  officers: Officer[];
  selectedDate: Date;
  initialData?: Assignment;
  onCancel: () => void;
  loading?: boolean;
}

export interface AssignmentDayDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  assignments: Assignment[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => Promise<void>;
}
