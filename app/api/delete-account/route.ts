import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
  return initializeApp({ credential: cert(serviceAccount) });
}

export async function POST(req: NextRequest) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json({ error: "FIREBASE_SERVICE_ACCOUNT_JSON not set." }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!idToken) {
    return NextResponse.json({ error: "Missing Authorization bearer token." }, { status: 401 });
  }

  try {
    const app = getAdminApp();
    const db = getFirestore(app);
    const adminAuth = getAuth(app);

    const { uid } = await adminAuth.verifyIdToken(idToken);

    // Delete the user's own notifications — private to them, worthless to anyone else once gone.
    const notifSnap = await db.collection("notifications").where("userId", "==", uid).get();
    await Promise.all(notifSnap.docs.map((d) => d.ref.delete()));

    // Remove this uid from any other user's favorites list.
    const favSnap = await db.collection("users").where("favoriteIds", "array-contains", uid).get();
    await Promise.all(
      favSnap.docs.map((d) => d.ref.update({ favoriteIds: FieldValue.arrayRemove(uid) }))
    );

    // Bookings, reviews, and conversations/messages are intentionally left untouched —
    // they're the other party's historical record, not just this user's data.

    await db.collection("users").doc(uid).delete();
    await adminAuth.deleteUser(uid);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("delete-account error:", e);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
