'use client';

import { useState, useCallback } from 'react';
import { DutyDay, DutyStatus, DutyRequest, Control222Duty } from '../types';

export const useDutyDayManagement = () => {
  const [duties, setDuties] = useState<(DutyDay | Control222Duty)[]>([
    // Servicios de Jefe Día
    {
      id: '1',
      date: '2025-02-05',
      status: 'pending',
      location: 'Comisaría 1ra',
      shift: 'mañana',
      type: 'jefeDia',
    },
    {
      id: '2',
      date: '2025-02-10',
      status: 'approved',
      location: 'Comisaría 3ra',
      shift: 'tarde',
      type: 'jefeDia',
    },
    {
      id: '3',
      date: '2025-02-15',
      status: 'rejected',
      location: 'Comisaría 2da',
      shift: 'noche',
      rejectionReason: 'Licencia médica programada',
      type: 'jefeDia',
    },
    // Servicios de Control 222
    {
      id: '4',
      startDate: '2025-02-01',
      endDate: '2025-02-07',
      status: 'pending',
      type: 'control222',
    },
    {
      id: '5',
      startDate: '2025-02-08',
      endDate: '2025-02-14',
      status: 'approved',
      type: 'control222',
    },
    {
      id: '6',
      startDate: '2025-02-15',
      endDate: '2025-02-21',
      status: 'rejected',
      type: 'control222',
    },
  ]);

  const [requests, setRequests] = useState<DutyRequest[]>([]);

  const handleUpdateStatus = (id: string, status: DutyStatus, reason?: string) => {
    setDuties((prevDuties) =>
      prevDuties.map((duty) =>
        duty.id === id
          ? {
              ...duty,
              status,
              ...(reason && { rejectionReason: reason }),
            }
          : duty
      )
    );
  };

  const handleSubmitRequests = (newRequests: Omit<DutyRequest, 'id' | 'status'>[]) => {
    const requestsWithIds = newRequests.map((request) => ({
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
    }));

    setRequests((prevRequests) => [...prevRequests, ...requestsWithIds]);
  };

  const getFilteredDuties = useCallback((type: 'jefeDia' | 'control222') => {
    return duties.filter((duty) => duty.type === type);
  }, [duties]);

  const getActiveDutyDays = useCallback(() => {
    return duties.filter((duty) => duty.status === 'pending' || duty.status === 'approved');
  }, [duties]);

  return {
    duties,
    requests,
    handleUpdateStatus,
    handleSubmitRequests,
    getFilteredDuties,
    getActiveDutyDays,
  };
};
