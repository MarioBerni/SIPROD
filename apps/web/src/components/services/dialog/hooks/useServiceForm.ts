import { useState } from 'react';
import { Service, ServiceType } from '@/types/service';

export interface ServiceFormData {
  type: ServiceType;
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  courseName?: string;
  selectedDates?: Date[];
}

interface UseServiceFormProps {
  service?: Service;
  onSave: (service: Omit<Service, 'id'>) => void;
  onClose: () => void;
}

const initialFormData: ServiceFormData = {
  type: 'JEFE_DIA',
  title: '',
  description: '',
  startDate: null,
  endDate: null,
  courseName: '',
  selectedDates: []
};

export const useServiceForm = ({ service, onSave, onClose }: UseServiceFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ServiceFormData>(() => {
    if (service) {
      return {
        type: service.type,
        title: service.title,
        description: service.description || '',
        startDate: service.startDate,
        endDate: service.endDate,
        selectedDates: service.selectedDates || []
      };
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.type) {
        newErrors.type = 'Selecciona un tipo de servicio';
      }
    } else if (step === 1) {
      if (!formData.title?.trim()) {
        newErrors.title = 'El título es requerido';
      }
      if (!formData.description?.trim()) {
        newErrors.description = 'La descripción es requerida';
      }
      if (formData.type !== 'JEFE_DIA') {
        if (!formData.startDate) {
          newErrors.startDate = 'La fecha de inicio es requerida';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'La fecha de fin es requerida';
        }
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
          newErrors.dates = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
      }
      if (formData.type === 'CURSO' && !formData.courseName?.trim()) {
        newErrors.courseName = 'El nombre del curso es requerido';
      }
      if (formData.type === 'JEFE_DIA' && (!formData.selectedDates || formData.selectedDates.length === 0)) {
        newErrors.dates = 'Selecciona al menos un día';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field: keyof ServiceFormData, value: string | number | Date | null | Date[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo cuando cambia
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      const serviceData: Omit<Service, 'id'> = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date(),
        selectedDates: formData.selectedDates || [],
        status: 'pending'
      };

      onSave(serviceData);
      onClose();
    }
  };

  return {
    activeStep,
    formData,
    errors,
    handleNext,
    handleBack,
    handleSubmit,
    handleChange,
    isLastStep: activeStep === 1
  };
};
