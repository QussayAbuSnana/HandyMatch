import { NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
  return initializeApp({ credential: cert(serviceAccount) });
}

// ─── Realistic seed data ──────────────────────────────────────────────────────

const PROFESSIONALS = [
  {
    displayName: "Daniel Cohen",
    email: "daniel.cohen@handymatch.dev",
    password: "Test1234!",
    bio: "Licensed plumber with 8 years of experience in residential and commercial repairs. Fast, reliable, and clean.",
    services: ["Plumbing"],
    hourlyRate: 85,
    location: "Tel Aviv",
    phone: "+972-50-111-2233",
    rating: 4.8,
    reviewCount: 34,
    jobCount: 41,
    isAvailable: true,
  },
  {
    displayName: "Amir Hassan",
    email: "amir.hassan@handymatch.dev",
    password: "Test1234!",
    bio: "Certified electrician specializing in home wiring, panel upgrades, and smart home installations.",
    services: ["Electrical"],
    hourlyRate: 95,
    location: "Jerusalem",
    phone: "+972-52-222-3344",
    rating: 4.9,
    reviewCount: 52,
    jobCount: 60,
    isAvailable: true,
  },
  {
    displayName: "Oren Shapiro",
    email: "oren.shapiro@handymatch.dev",
    password: "Test1234!",
    bio: "Experienced carpenter and general handyman. Custom furniture, shelving, door repairs — no job too small.",
    services: ["Carpentry", "General Handyman"],
    hourlyRate: 70,
    location: "Haifa",
    phone: "+972-54-333-4455",
    rating: 4.6,
    reviewCount: 28,
    jobCount: 35,
    isAvailable: true,
  },
  {
    displayName: "Maya Levi",
    email: "maya.levi@handymatch.dev",
    password: "Test1234!",
    bio: "Professional cleaner offering deep cleaning, move-in/move-out, and weekly maintenance. Eco-friendly products only.",
    services: ["Cleaning"],
    hourlyRate: 55,
    location: "Tel Aviv",
    phone: "+972-58-444-5566",
    rating: 4.7,
    reviewCount: 45,
    jobCount: 58,
    isAvailable: true,
  },
  {
    displayName: "Yossi Ben-David",
    email: "yossi.bendavid@handymatch.dev",
    password: "Test1234!",
    bio: "HVAC technician and appliance repair expert. AC installs, fridge, washer/dryer — all major brands.",
    services: ["HVAC", "Appliance Repair"],
    hourlyRate: 90,
    location: "Beer Sheva",
    phone: "+972-50-555-6677",
    rating: 4.5,
    reviewCount: 19,
    jobCount: 24,
    isAvailable: false,
  },
  {
    displayName: "Ron Mizrahi",
    email: "ron.mizrahi@handymatch.dev",
    password: "Test1234!",
    bio: "Painter with an eye for detail. Interior, exterior, wallpaper removal, and colour consultation included.",
    services: ["Painting"],
    hourlyRate: 65,
    location: "Ramat Gan",
    phone: "+972-52-666-7788",
    rating: 4.4,
    reviewCount: 22,
    jobCount: 27,
    isAvailable: true,
  },
];

const CUSTOMERS = [
  {
    displayName: "Sarah Miller",
    email: "sarah.miller@handymatch.dev",
    password: "Test1234!",
    phone: "+972-54-777-8899",
    location: "Tel Aviv",
  },
  {
    displayName: "Tom Katz",
    email: "tom.katz@handymatch.dev",
    password: "Test1234!",
    phone: "+972-58-888-9900",
    location: "Jerusalem",
  },
];

export async function POST() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json(
      { error: "FIREBASE_SERVICE_ACCOUNT_JSON env variable is not set." },
      { status: 500 }
    );
  }

  try {
    const app = getAdminApp();
    const db = getFirestore(app);
    const adminAuth = getAuth(app);

    const proUids: string[] = [];
    const customerUids: string[] = [];

    // ── Create professionals ──────────────────────────────────────────────────
    for (const pro of PROFESSIONALS) {
      let uid: string;
      try {
        const existing = await adminAuth.getUserByEmail(pro.email);
        uid = existing.uid;
      } catch {
        const created = await adminAuth.createUser({
          email: pro.email,
          password: pro.password,
          displayName: pro.displayName,
        });
        uid = created.uid;
      }

      await db.collection("users").doc(uid).set({
        uid,
        email: pro.email,
        displayName: pro.displayName,
        role: "professional",
        phone: pro.phone,
        location: pro.location,
        bio: pro.bio,
        services: pro.services,
        hourlyRate: pro.hourlyRate,
        rating: pro.rating,
        reviewCount: pro.reviewCount,
        jobCount: pro.jobCount,
        isAvailable: pro.isAvailable,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      proUids.push(uid);
    }

    // ── Create customers ──────────────────────────────────────────────────────
    for (const cust of CUSTOMERS) {
      let uid: string;
      try {
        const existing = await adminAuth.getUserByEmail(cust.email);
        uid = existing.uid;
      } catch {
        const created = await adminAuth.createUser({
          email: cust.email,
          password: cust.password,
          displayName: cust.displayName,
        });
        uid = created.uid;
      }

      await db.collection("users").doc(uid).set({
        uid,
        email: cust.email,
        displayName: cust.displayName,
        role: "customer",
        phone: cust.phone,
        location: cust.location,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      customerUids.push(uid);
    }

    // ── Create bookings ───────────────────────────────────────────────────────
    const now = Date.now();
    const bookingSamples = [
      {
        customerId: customerUids[0],
        customerName: CUSTOMERS[0].displayName,
        professionalId: proUids[0],
        professionalName: PROFESSIONALS[0].displayName,
        service: "Plumbing",
        status: "completed",
        location: "Tel Aviv",
        price: PROFESSIONALS[0].hourlyRate,
        notes: "Kitchen sink leaking badly.",
        scheduledAt: new Date(now - 7 * 86400000),
        createdAt: FieldValue.serverTimestamp(),
      },
      {
        customerId: customerUids[0],
        customerName: CUSTOMERS[0].displayName,
        professionalId: proUids[1],
        professionalName: PROFESSIONALS[1].displayName,
        service: "Electrical",
        status: "accepted",
        location: "Tel Aviv",
        price: PROFESSIONALS[1].hourlyRate,
        notes: "Install 3 new power outlets in living room.",
        scheduledAt: new Date(now + 2 * 86400000),
        createdAt: FieldValue.serverTimestamp(),
      },
      {
        customerId: customerUids[1],
        customerName: CUSTOMERS[1].displayName,
        professionalId: proUids[2],
        professionalName: PROFESSIONALS[2].displayName,
        service: "Carpentry",
        status: "completed",
        location: "Jerusalem",
        price: PROFESSIONALS[2].hourlyRate,
        notes: "Build custom wardrobe in master bedroom.",
        scheduledAt: new Date(now - 14 * 86400000),
        createdAt: FieldValue.serverTimestamp(),
      },
      {
        customerId: customerUids[1],
        customerName: CUSTOMERS[1].displayName,
        professionalId: proUids[3],
        professionalName: PROFESSIONALS[3].displayName,
        service: "Cleaning",
        status: "pending",
        location: "Jerusalem",
        price: PROFESSIONALS[3].hourlyRate,
        notes: "Deep clean 3-bedroom apartment before moving in.",
        scheduledAt: new Date(now + 4 * 86400000),
        createdAt: FieldValue.serverTimestamp(),
      },
    ];

    const bookingRefs: string[] = [];
    for (const b of bookingSamples) {
      const ref = await db.collection("bookings").add(b);
      bookingRefs.push(ref.id);
    }

    // ── Create reviews ────────────────────────────────────────────────────────
    const reviewSamples = [
      {
        bookingId: bookingRefs[0],
        reviewerId: customerUids[0],
        reviewerName: CUSTOMERS[0].displayName,
        subjectId: proUids[0],
        subjectName: PROFESSIONALS[0].displayName,
        type: "customer_to_pro",
        rating: 5,
        comment: "Daniel was fantastic! Fixed the leak quickly and left the kitchen spotless. Highly recommend.",
        createdAt: FieldValue.serverTimestamp(),
      },
      {
        bookingId: bookingRefs[2],
        reviewerId: customerUids[1],
        reviewerName: CUSTOMERS[1].displayName,
        subjectId: proUids[2],
        subjectName: PROFESSIONALS[2].displayName,
        type: "customer_to_pro",
        rating: 4,
        comment: "Great craftsmanship on the wardrobe. Took a bit longer than expected but the result is beautiful.",
        createdAt: FieldValue.serverTimestamp(),
      },
      {
        bookingId: bookingRefs[0],
        reviewerId: proUids[0],
        reviewerName: PROFESSIONALS[0].displayName,
        subjectId: customerUids[0],
        subjectName: CUSTOMERS[0].displayName,
        type: "pro_to_customer",
        rating: 5,
        comment: "Very polite and the location was easy to access. Payment was prompt.",
        createdAt: FieldValue.serverTimestamp(),
      },
    ];

    for (const r of reviewSamples) {
      await db.collection("reviews").add(r);
    }

    return NextResponse.json({
      success: true,
      professionals: PROFESSIONALS.length,
      customers: CUSTOMERS.length,
      bookings: bookingSamples.length,
      reviews: reviewSamples.length,
      logins: [
        ...CUSTOMERS.map((c) => ({ email: c.email, password: c.password, role: "customer" })),
        ...PROFESSIONALS.map((p) => ({ email: p.email, password: p.password, role: "professional" })),
      ],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
