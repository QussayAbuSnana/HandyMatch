import { Timestamp } from "firebase/firestore";

export type UserRole = "customer" | "professional";

export type DaySchedule = {
  enabled: boolean;
  start: string; // "09:00"
  end: string;   // "17:00"
};

export type WeeklyAvailability = {
  sunday:    DaySchedule;
  monday:    DaySchedule;
  tuesday:   DaySchedule;
  wednesday: DaySchedule;
  thursday:  DaySchedule;
  friday:    DaySchedule;
  saturday:  DaySchedule;
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole | null;
  photoURL?: string;
  phone?: string;
  location?: string;
  availability?: WeeklyAvailability;
  serviceArea?: string;
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

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "booking_request" | "booking_accepted" | "booking_declined" | "booking_completed" | "new_message" | "new_review" | string;
  linkId?: string | null;
  read: boolean;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  bookingId: string;
  /** Who wrote the review */
  reviewerId: string;
  reviewerName: string;
  /** Who is being reviewed */
  subjectId: string;
  subjectName: string;
  /** "customer_to_pro" or "pro_to_customer" */
  type: "customer_to_pro" | "pro_to_customer";
  rating: number;
  comment: string;
  createdAt: Timestamp;
}
