import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { Booking, Conversation, Message, Notification, Review, UserProfile } from "./types";

// ─── Users / Professionals ────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}

/** Fetch all professionals (for search page) */
export async function getProfessionals(
  serviceFilter?: string
): Promise<UserProfile[]> {
  let q = query(
    collection(db, "users"),
    where("role", "==", "professional")
  );
  if (serviceFilter) {
    q = query(
      collection(db, "users"),
      where("role", "==", "professional"),
      where("services", "array-contains", serviceFilter)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "bookings"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
): Promise<void> {
  await updateDoc(doc(db, "bookings", bookingId), { status });
}

/** Bookings where user is the customer */
export async function getCustomerBookings(customerId: string): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    where("customerId", "==", customerId)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  return results.sort((a, b) => {
    const aS = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0;
    const bS = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0;
    return bS - aS;
  });
}

/** Bookings where user is the professional */
export async function getProBookings(professionalId: string): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    where("professionalId", "==", professionalId)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
  return results.sort((a, b) => {
    const aS = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0;
    const bS = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0;
    return bS - aS;
  });
}

/** Real-time listener for pro bookings */
export function subscribeProBookings(
  professionalId: string,
  callback: (bookings: Booking[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "bookings"),
    where("professionalId", "==", professionalId)
  );
  return onSnapshot(q,
    (snap) => {
      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      results.sort((a, b) => {
        const aS = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0;
        const bS = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0;
        return bS - aS;
      });
      callback(results);
    },
    () => { callback([]); }
  );
}

/** Real-time listener for customer bookings */
export function subscribeCustomerBookings(
  customerId: string,
  callback: (bookings: Booking[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "bookings"),
    where("customerId", "==", customerId)
  );
  return onSnapshot(q,
    (snap) => {
      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      results.sort((a, b) => {
        const aS = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0;
        const bS = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0;
        return bS - aS;
      });
      callback(results);
    },
    () => { callback([]); }
  );
}

// ─── Conversations & Messages ─────────────────────────────────────────────────

/** Get or create a conversation between two users */
export async function getOrCreateConversation(
  uid1: string,
  uid2: string,
  name1: string,
  name2: string
): Promise<string> {
  // Check if conversation already exists
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid1)
  );
  const snap = await getDocs(q);
  const existing = snap.docs.find((d) =>
    (d.data().participants as string[]).includes(uid2)
  );
  if (existing) return existing.id;

  // Create new conversation
  const ref = await addDoc(collection(db, "conversations"), {
    participants: [uid1, uid2],
    participantNames: { [uid1]: name1, [uid2]: name2 },
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
  });
  return ref.id;
}

/** Real-time listener for user conversations */
export function subscribeConversations(
  uid: string,
  callback: (convs: Conversation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid)
  );
  return onSnapshot(q,
    (snap) => {
      const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation));
      // Sort client-side to avoid needing a composite Firestore index
      convs.sort((a, b) => {
        const aS = (a.lastMessageAt as unknown as { seconds: number })?.seconds ?? 0;
        const bS = (b.lastMessageAt as unknown as { seconds: number })?.seconds ?? 0;
        return bS - aS;
      });
      callback(convs);
    },
    () => { callback([]); }
  );
}

/** Real-time listener for messages in a conversation */
export function subscribeMessages(
  conversationId: string,
  callback: (msgs: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
    limit(100)
  );
  return onSnapshot(q,
    (snap) => { callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message))); },
    () => { callback([]); }
  );
}

/** Send a message */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<void> {
  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    conversationId,
    senderId,
    text,
    createdAt: serverTimestamp(),
  });
  // Update conversation last message
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function submitReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<void> {
  // Save the review
  await addDoc(collection(db, "reviews"), {
    ...review,
    createdAt: serverTimestamp(),
  });

  // If reviewing a professional, update their rating average
  if (review.type === "customer_to_pro") {
    try {
      const q = query(
        collection(db, "reviews"),
        where("subjectId", "==", review.subjectId),
        where("type", "==", "customer_to_pro")
      );
      const snap = await getDocs(q);
      const ratings = snap.docs.map((d) => d.data().rating as number);
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      await updateDoc(doc(db, "users", review.subjectId), {
        rating: Math.round(avg * 10) / 10,
        reviewCount: ratings.length,
      });
    } catch {
      // Rating update failed (Firestore rules) — review was still saved
    }
  }
}

export async function getReviewsForPro(proId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("subjectId", "==", proId),
    where("type", "==", "customer_to_pro"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function hasReviewed(
  bookingId: string,
  reviewerId: string
): Promise<boolean> {
  const q = query(
    collection(db, "reviews"),
    where("bookingId", "==", bookingId),
    where("reviewerId", "==", reviewerId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  type: string,
  linkId?: string
): Promise<void> {
  await addDoc(collection(db, "notifications"), {
    userId,
    title,
    body,
    type,
    linkId: linkId ?? null,
    read: false,
    createdAt: serverTimestamp(),
  });
}

/** Real-time listener for a user's notifications (newest first) */
export function subscribeNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    limit(50)
  );
  return onSnapshot(q,
    (snap) => {
      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
      results.sort((a, b) => {
        const aS = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0;
        const bS = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0;
        return bS - aS;
      });
      callback(results);
    },
    () => { callback([]); }
  );
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, "notifications", notificationId), { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { read: true })));
}
