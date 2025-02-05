import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AssignmentFormData } from '../types';

const assignmentSchema = z.object({
  officerId: z.string().min(1, 'Seleccione un oficial'),
  startDate: z.string().min(1, 'Seleccione una fecha de inicio'),
  endDate: z.string().min(1, 'Seleccione una fecha de finalización'),
  type: z.enum(['direccionI', 'direccionII', 'geo'], {
    required_error: 'Seleccione un tipo de asignación',
  }),
  description: z.string().optional(),
});

export function useAssignmentForm(defaultValues?: Partial<AssignmentFormData>) {
  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      officerId: '',
      startDate: '',
      endDate: '',
      type: 'direccionI',
      description: '',
      ...defaultValues,
    },
  });

  return form;
}
