import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AssignmentFormSchema } from '../../../types';

const assignmentSchema = z.object({
  officerId: z.string().min(1, 'Seleccione un oficial'),
  type: z.enum(['direccionI', 'direccionII_GEO'] as const, {
    required_error: 'Seleccione un tipo de asignación',
  }),
  description: z.string().optional(),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function useAssignmentForm(defaultValues?: Partial<AssignmentFormSchema>) {
  const form = useForm<AssignmentFormSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      officerId: '',
      type: 'direccionI',
      description: '',
      ...defaultValues,
    },
  });

  return form;
}
