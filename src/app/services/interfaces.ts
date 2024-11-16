export interface Event {
  id?: number;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  banner: string;
  ticket_types: TicketType[]; // Utilisation de l'interface TicketType
  tickets_available: number;
  ticket_quantity: number;
  ticket_price: number;
  organizer_id: number;
  categories: number[]; // IDs des catégories associées à l'événement
  tickets: Ticket[]; // Liste des tickets associés à l'événement
  transactions: Transaction[]; // Liste des transactions associées à l'événement
  organizer: Organizer; // Organisateur de l'événement
  wallets: Wallet[]; // Portefeuilles associés à l'événement
}

export interface TicketType {
  id: string;
  type: string;
  price: number;
  quantity: number;
  tickets_available: number;
}

export interface Organizer {
  id: number;
  user: User; // Utilisateur associé à l'organisateur
}

export interface User {
  id: number;
  name: string;
  email: string;
  photo: string | null; // La photo peut être nulle si elle n'est pas définie
  purchaseDate: Date;
  role: string;
  amount: number;
}

export interface Category {
  id?: number;
  label: string; // Libellé de la catégorie
}

export interface Ticket {
  id?: number;
  name: string;
  email: string;
  quantity: number;
  event_id: number;
  is_paid?: boolean; // Ajout d'un champ pour indiquer si le ticket est payé
  is_scanned?: boolean; // Ajout d'un champ pour indiquer si le ticket est scanné
}

export interface Transaction {
  id?: number;
  event_name: string;
  event_date: string;
  event_time: string;
  transaction_amount: number;
  user_id?: number; // ID de l'utilisateur associé à la transaction
}

export interface Wallet {
  id?: number;
  name: string;
  balance: number; // Solde du portefeuille
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
