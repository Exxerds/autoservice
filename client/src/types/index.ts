export interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  working_hours: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string | null;
}

export interface Booking {
  id: number;
  datetime: string;
  status: string;
  location_name?: string;
  location_address?: string;
  service_name?: string;
  service_price?: string;
}
// Менеджер CRM
export interface Manager {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  location_id: number | null;
}

// Лид CRM
export interface Lead {
  id: number;
  client_name: string;
  phone: string;
  email: string | null;
  source: 'site' | 'manual' | 'external';
  status: 'new' | 'in_work' | 'booked' | 'done' | 'rejected';
  location_id: number | null;
  manager_id: number | null;
  booking_id: number | null;
  created_at: string;
  location_name?: string;
  manager_name?: string;
}

export interface LeadComment {
  id: number;
  lead_id: number;
  manager_id: number;
  text: string;
  created_at: string;
  manager_name?: string;
}

// Задача
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  assigned_to: number | null;
  created_by: number;
  deadline: string | null;
  created_at: string;
  assigned_name?: string;
  creator_name?: string;
}