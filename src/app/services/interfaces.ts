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
