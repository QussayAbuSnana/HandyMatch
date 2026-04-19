import { Timestamp } from "firebase/firestore";

export type UserRole = "customer" | "professional";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole | null;
  photoURL?: string;
  phone?: string;
  location?: string;
  createdAt: Timestamp;
}

export interface ProfessionalProfile extends UserProfile {
  role: "professional";
  bio: string;
  services: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  jobCount: number;
  isAvailable: boolean;
  serviceArea?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  professionalId: string;
  customerName: string;
  professionalName: string;
  service: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  scheduledAt: Timestamp;
  location: string;
  price: number;
  notes?: string;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageAt: Timestamp;
  bookingId?: string;
}
