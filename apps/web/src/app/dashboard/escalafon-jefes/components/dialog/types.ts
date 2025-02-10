import { Assignment, Officer, AssignmentFormData } from '../../types';

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
  onAssignmentClick: (assignment: Assignment) => void;
}
