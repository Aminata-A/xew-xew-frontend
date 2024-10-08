export interface Event {
  id?: number;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  banner: string;
  ticket_quantity: number;
  ticket_price: number;
  event_status: 'publier' | 'brouillon' | 'archiver' | 'annuler' | 'supprimer';
  organizer_id: number;
}

export interface Ticket {
  id?: number;
  name: string;
  email: string;
  quantity: number;
  event_id: number;
}

export interface Transaction{
  id?: number;
  event_name: string;
  event_date: string;
  event_time: string;
  transaction_amount: number;
}

export interface Register {
  id?: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role: string;
  photo: string | null;
}

