'use client';

import { useState, useCallback } from 'react';
import { Course } from '../../types';

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Curso de Actualización en Procedimientos',
      startDate: '2025-02-10',
      endDate: '2025-02-15',
      status: 'pending',
      location: 'Academia de Policía',
      type: 'mandatory',
    },
    {
      id: '2',
      name: 'Taller de Manejo de Crisis',
      startDate: '2025-02-20',
      endDate: '2025-02-22',
      status: 'approved',
      location: 'Centro de Entrenamiento',
      type: 'optional',
    },
    {
      id: '3',
      name: 'Seminario de Liderazgo',
      startDate: '2025-03-01',
      endDate: '2025-03-05',
      status: 'pending',
      location: 'Sede Central',
      type: 'mandatory',
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  // Función simple para formatear la fecha para mostrar
  const formatDateForDisplay = useCallback((dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  }, []);

  const getActiveCourses = useCallback(() => {
    return courses.filter(course => 
      course.status === 'pending' || course.status === 'approved'
    );
  }, [courses]);

  const updateCourseStatus = useCallback((id: string, status: Course['status']) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === id ? { ...course, status } : course
      )
    );
  }, []);

  const handleAdd = useCallback(() => {
    setIsAdding(true);
    setNewCourse({});
  }, []);

  const handleSaveNew = useCallback(() => {
    if (newCourse.startDate && newCourse.endDate && newCourse.name) {
      setCourses([
        ...courses,
        {
          id: Date.now().toString(),
          name: newCourse.name,
          startDate: newCourse.startDate,
          endDate: newCourse.endDate,
          status: 'pending',
          location: '',
          type: 'mandatory',
        },
      ]);
      setIsAdding(false);
      setNewCourse({});
    }
  }, [courses, newCourse]);

  const handleEdit = useCallback((course: Course) => {
    setEditingId(course.id);
    setEditCourse(course);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editCourse.id
            ? {
                ...editCourse,
                name: editCourse.name,
                startDate: editCourse.startDate,
                endDate: editCourse.endDate,
              }
            : c
        )
      );
      setEditingId(null);
      setEditCourse(null);
    }
  }, [courses, editCourse]);

  const handleDelete = useCallback((id: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditCourse(null);
  }, []);

  const handleCancelAdd = useCallback(() => {
    setIsAdding(false);
    setNewCourse({});
  }, []);

  return {
    courses,
    isAdding,
    editingId,
    newCourse,
    editCourse,
    formatDateForDisplay,
    getActiveCourses,
    updateCourseStatus,
    handleAdd,
    handleSaveNew,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleCancelEdit,
    handleCancelAdd,
    setNewCourse,
    setEditCourse,
  };
};
