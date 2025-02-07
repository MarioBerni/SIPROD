export interface Course {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface License {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type DutyStatus = 'pending' | 'approved' | 'rejected';

export interface DutyDay {
  id: string;
  date: string;
  status: DutyStatus;
}

export interface DutyRequest {
  id: string;
  date: string;
  status: DutyStatus;
}
