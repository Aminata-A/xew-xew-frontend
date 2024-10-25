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
  organizer_id: number;
  categories: number[]; // Array of category IDs
  tickets: Ticket[];
  transactions: Transaction[];
  organizer: Organizer;

}

export interface Organizer {
  id: number;
  user: User; // Utilisateur associé à l'organisateur
}

export interface User {
  id: number;
  name: string;
  email: string;
  photo: string;
}

export interface Category {
  id?: number;
  label: string;
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

