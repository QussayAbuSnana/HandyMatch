import { NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
  return initializeApp({ credential: cert(serviceAccount) });
}

// ─── Professionals ────────────────────────────────────────────────────────────
const PROFESSIONALS = [
  {
    displayName: "Yossi Cohen",
    email: "yossi.cohen@handymatch.dev",
    password: "Test1234!",
    bio: "אינסטלטור מורשה עם ניסיון של 12 שנים בתיקוני אינסטלציה ביתיים ומסחריים. מהיר, אמין ומסודר. זמין 24/7 לחירום.",
    services: ["Plumbing"],
    hourlyRate: 120,
    location: "תל אביב - יפו",
    phone: "+972-52-111-2233",
    rating: 4.9,
    reviewCount: 87,
    jobCount: 102,
    isAvailable: true,
  },
  {
    displayName: "Ahmed Mansour",
    email: "ahmed.mansour@handymatch.dev",
    password: "Test1234!",
    bio: "חשמלאי מוסמך עם התמחות בחיווט דירות, התקנת לוחות חשמל ובית חכם. עבודה מקצועית ובטוחה. כולל אחריות על כל עבודה.",
    services: ["Electrical"],
    hourlyRate: 130,
    location: "ירושלים - גילה",
    phone: "+972-50-222-3344",
    rating: 4.8,
    reviewCount: 64,
    jobCount: 78,
    isAvailable: true,
  },
  {
    displayName: "David Levi",
    email: "david.levi@handymatch.dev",
    password: "Test1234!",
    bio: "נגר ואיש תחזוקה מנוסה. ייצור ארונות מותאם אישית, תיקון דלתות וחלונות, מדפים ועוד. 15 שנות ניסיון באזור חיפה.",
    services: ["Carpentry", "General Handyman"],
    hourlyRate: 95,
    location: "חיפה - כרמל",
    phone: "+972-54-333-4455",
    rating: 4.7,
    reviewCount: 43,
    jobCount: 55,
    isAvailable: true,
  },
  {
    displayName: "Michal Ben-David",
    email: "michal.bendavid@handymatch.dev",
    password: "Test1234!",
    bio: "שירות ניקיון מקצועי לבתים ומשרדים. ניקיון עומק, לפני ואחרי אירועים, ניקיון מעבר דירה. מוצרים ירוקים בלבד, עבודה אמינה.",
    services: ["Cleaning"],
    hourlyRate: 70,
    location: "רמת גן - קריית קריניצי",
    phone: "+972-58-444-5566",
    rating: 4.9,
    reviewCount: 112,
    jobCount: 138,
    isAvailable: true,
  },
  {
    displayName: "Oren Shapiro",
    email: "oren.shapiro@handymatch.dev",
    password: "Test1234!",
    bio: "טכנאי מזגנים ומכשירי חשמל ביתיים. התקנה, תיקון ותחזוקה של כל מותגי המזגנים. כולל ניקוי מסנן. מכשירי חשמל — מקרר, מכונת כביסה ועוד.",
    services: ["HVAC", "Appliance Repair"],
    hourlyRate: 110,
    location: "באר שבע - נווה זאב",
    phone: "+972-50-555-6677",
    rating: 4.6,
    reviewCount: 38,
    jobCount: 47,
    isAvailable: true,
  },
  {
    displayName: "Roi Mizrahi",
    email: "roi.mizrahi@handymatch.dev",
    password: "Test1234!",
    bio: "צבעי פנים וחוץ עם עין לפרטים. הסרת טפטים, ייעוץ צבע חינם, גימור מושלם. 10 שנות ניסיון באזור גוש דן.",
    services: ["Painting"],
    hourlyRate: 85,
    location: "פתח תקווה",
    phone: "+972-52-666-7788",
    rating: 4.5,
    reviewCount: 29,
    jobCount: 36,
    isAvailable: true,
  },
  {
    displayName: "Noa Goldberg",
    email: "noa.goldberg@handymatch.dev",
    password: "Test1234!",
    bio: "גנאית מקצועית עם תואר בגננות נוי. תכנון גינות, שתילה, גיזום עצים, תחזוקה שוטפת. עבודה עם גינות פרטיות ובניינים.",
    services: ["Landscaping"],
    hourlyRate: 80,
    location: "הרצליה - פיתוח",
    phone: "+972-54-777-8899",
    rating: 4.8,
    reviewCount: 56,
    jobCount: 68,
    isAvailable: true,
  },
  {
    displayName: "Samer Khalil",
    email: "samer.khalil@handymatch.dev",
    password: "Test1234!",
    bio: "מומחה ריצוף וגגות. ריצוף קרמיקה, פורצלן ואבן טבעית. איטום גגות ומרפסות. עבודה נקייה ומדויקת בלוחות זמנים.",
    services: ["Flooring", "Roofing"],
    hourlyRate: 100,
    location: "נצרת עילית",
    phone: "+972-50-888-9900",
    rating: 4.7,
    reviewCount: 41,
    jobCount: 52,
    isAvailable: false,
  },
  {
    displayName: "Tal Katz",
    email: "tal.katz@handymatch.dev",
    password: "Test1234!",
    bio: "איש תחזוקה כללי לכל צרכי הבית. תיקוני אינסטלציה קטנים, חשמל בסיסי, תלייה, הרכבת רהיטים ועוד. מהיר ואמין.",
    services: ["General Handyman", "Moving"],
    hourlyRate: 75,
    location: "ראשון לציון",
    phone: "+972-58-999-0011",
    rating: 4.4,
    reviewCount: 22,
    jobCount: 28,
    isAvailable: true,
  },
  {
    displayName: "Ibrahim Hassan",
    email: "ibrahim.hassan@handymatch.dev",
    password: "Test1234!",
    bio: "חשמלאי ומומחה בית חכם. התקנת מערכות Alexa, Google Home, מצלמות אבטחה, תאורה חכמה. גם אינסטלציה בסיסית.",
    services: ["Electrical", "General Handyman"],
    hourlyRate: 115,
    location: "נתניה - עיר ימים",
    phone: "+972-52-000-1122",
    rating: 4.8,
    reviewCount: 33,
    jobCount: 41,
    isAvailable: true,
  },
  {
    displayName: "Rivka Peretz",
    email: "rivka.peretz@handymatch.dev",
    password: "Test1234!",
    bio: "ניקיון ואירגון הבית. ניקוי עומק, מיון ואירגון ארונות, קונמארי, לפני חגים. שירות אישי ודיסקרטי לבתים פרטיים.",
    services: ["Cleaning"],
    hourlyRate: 65,
    location: "רחובות",
    phone: "+972-54-111-2200",
    rating: 4.9,
    reviewCount: 78,
    jobCount: 94,
    isAvailable: true,
  },
  {
    displayName: "Alon Bar",
    email: "alon.bar@handymatch.dev",
    password: "Test1234!",
    bio: "שירות הובלות ומעברי דירה מקצועי. משאית ועובדים מיומנים, אריזה ופירוק רהיטים, עדין עם חפצים יקרי ערך. ביטוח מלא.",
    services: ["Moving"],
    hourlyRate: 90,
    location: "אשדוד",
    phone: "+972-50-222-3300",
    rating: 4.6,
    reviewCount: 51,
    jobCount: 63,
    isAvailable: true,
  },
];

// ─── Customers ────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { displayName: "שרה מילר",    email: "sarah.miller@handymatch.dev",   password: "Test1234!", phone: "+972-54-777-1111", location: "תל אביב - הצפון הישן" },
  { displayName: "תום בן-דוד",  email: "tom.bendavid@handymatch.dev",   password: "Test1234!", phone: "+972-58-888-2222", location: "ירושלים - בית הכרם" },
  { displayName: "יעל פרידמן",  email: "yael.friedman@handymatch.dev",  password: "Test1234!", phone: "+972-52-999-3333", location: "חיפה - נווה שאנן" },
  { displayName: "משה אזולאי",  email: "moshe.azulay@handymatch.dev",   password: "Test1234!", phone: "+972-50-111-4444", location: "ראשון לציון - נחלת יהודה" },
  { displayName: "ליהי שוורץ",  email: "lihi.schwartz@handymatch.dev",  password: "Test1234!", phone: "+972-54-222-5555", location: "רמת גן - בורוכוב" },
  { displayName: "רמי אוחיון",  email: "rami.ohayon@handymatch.dev",    password: "Test1234!", phone: "+972-58-333-6666", location: "נתניה - כיכר העצמאות" },
];

export async function POST() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json({ error: "FIREBASE_SERVICE_ACCOUNT_JSON not set." }, { status: 500 });
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
      try { uid = (await adminAuth.getUserByEmail(pro.email)).uid; }
      catch { uid = (await adminAuth.createUser({ email: pro.email, password: pro.password, displayName: pro.displayName })).uid; }

      await db.collection("users").doc(uid).set({
        uid, email: pro.email, displayName: pro.displayName,
        role: "professional", phone: pro.phone, location: pro.location,
        bio: pro.bio, services: pro.services, hourlyRate: pro.hourlyRate,
        rating: pro.rating, reviewCount: pro.reviewCount, jobCount: pro.jobCount,
        isAvailable: pro.isAvailable, createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      proUids.push(uid);
    }

    // ── Create customers ──────────────────────────────────────────────────────
    for (const cust of CUSTOMERS) {
      let uid: string;
      try { uid = (await adminAuth.getUserByEmail(cust.email)).uid; }
      catch { uid = (await adminAuth.createUser({ email: cust.email, password: cust.password, displayName: cust.displayName })).uid; }

      await db.collection("users").doc(uid).set({
        uid, email: cust.email, displayName: cust.displayName,
        role: "customer", phone: cust.phone, location: cust.location,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      customerUids.push(uid);
    }

    const now = Date.now();
    const day = 86400000;

    // ── Create bookings ───────────────────────────────────────────────────────
    const bookings = [
      // Completed
      { customerId: customerUids[0], customerName: CUSTOMERS[0].displayName, professionalId: proUids[0], professionalName: PROFESSIONALS[0].displayName, service: "Plumbing",          status: "completed",  location: "תל אביב - הצפון הישן",    price: 120, notes: "צינור דולף תחת הכיור במטבח",        scheduledAt: new Date(now - 10 * day) },
      { customerId: customerUids[1], customerName: CUSTOMERS[1].displayName, professionalId: proUids[1], professionalName: PROFESSIONALS[1].displayName, service: "Electrical",        status: "completed",  location: "ירושלים - בית הכרם",         price: 130, notes: "התקנת 4 שקעים חדשים בסלון",         scheduledAt: new Date(now - 8  * day) },
      { customerId: customerUids[2], customerName: CUSTOMERS[2].displayName, professionalId: proUids[2], professionalName: PROFESSIONALS[2].displayName, service: "Carpentry",         status: "completed",  location: "חיפה - נווה שאנן",            price: 95,  notes: "בניית ספריה מותאמת אישית בסלון",    scheduledAt: new Date(now - 7  * day) },
      { customerId: customerUids[3], customerName: CUSTOMERS[3].displayName, professionalId: proUids[3], professionalName: PROFESSIONALS[3].displayName, service: "Cleaning",          status: "completed",  location: "ראשון לציון - נחלת יהודה",   price: 70,  notes: "ניקיון עומק לדירה 4 חדרים לפני חג", scheduledAt: new Date(now - 5  * day) },
      { customerId: customerUids[4], customerName: CUSTOMERS[4].displayName, professionalId: proUids[4], professionalName: PROFESSIONALS[4].displayName, service: "HVAC",              status: "completed",  location: "רמת גן - בורוכוב",            price: 110, notes: "תיקון מזגן שלא מקרר - דגם LG",      scheduledAt: new Date(now - 14 * day) },
      { customerId: customerUids[5], customerName: CUSTOMERS[5].displayName, professionalId: proUids[5], professionalName: PROFESSIONALS[5].displayName, service: "Painting",          status: "completed",  location: "נתניה - כיכר העצמאות",       price: 85,  notes: "צביעת 3 חדרים בגוונים בהירים",      scheduledAt: new Date(now - 20 * day) },
      { customerId: customerUids[0], customerName: CUSTOMERS[0].displayName, professionalId: proUids[6], professionalName: PROFESSIONALS[6].displayName, service: "Landscaping",       status: "completed",  location: "תל אביב - הצפון הישן",    price: 80,  notes: "עיצוב וסידור גינת הגג",              scheduledAt: new Date(now - 30 * day) },
      { customerId: customerUids[1], customerName: CUSTOMERS[1].displayName, professionalId: proUids[8], professionalName: PROFESSIONALS[8].displayName, service: "General Handyman",  status: "completed",  location: "ירושלים - בית הכרם",         price: 75,  notes: "הרכבת רהיטים מאיקאה - 6 פריטים",   scheduledAt: new Date(now - 6  * day) },

      // Accepted / In Progress
      { customerId: customerUids[2], customerName: CUSTOMERS[2].displayName, professionalId: proUids[0], professionalName: PROFESSIONALS[0].displayName, service: "Plumbing",          status: "accepted",   location: "חיפה - נווה שאנן",            price: 120, notes: "בעיית לחץ מים בדירה",               scheduledAt: new Date(now + 2  * day) },
      { customerId: customerUids[3], customerName: CUSTOMERS[3].displayName, professionalId: proUids[9], professionalName: PROFESSIONALS[9].displayName, service: "Electrical",        status: "accepted",   location: "ראשון לציון",                 price: 115, notes: "התקנת מערכת בית חכם - Alexa",       scheduledAt: new Date(now + 3  * day) },
      { customerId: customerUids[4], customerName: CUSTOMERS[4].displayName, professionalId: proUids[6], professionalName: PROFESSIONALS[6].displayName, service: "Landscaping",       status: "in_progress",location: "רמת גן",                      price: 80,  notes: "תחזוקה חודשית של גינת הבניין",      scheduledAt: new Date(now) },
      { customerId: customerUids[5], customerName: CUSTOMERS[5].displayName, professionalId: proUids[11],professionalName: PROFESSIONALS[11].displayName,service: "Moving",             status: "accepted",   location: "נתניה",                       price: 90,  notes: "מעבר דירה - 4 חדרים, קומה 3",       scheduledAt: new Date(now + 5  * day) },

      // Pending
      { customerId: customerUids[0], customerName: CUSTOMERS[0].displayName, professionalId: proUids[1], professionalName: PROFESSIONALS[1].displayName, service: "Electrical",        status: "pending",    location: "תל אביב - הצפון הישן",    price: 130, notes: "החלפת לוח חשמל ישן",                scheduledAt: new Date(now + 7  * day) },
      { customerId: customerUids[1], customerName: CUSTOMERS[1].displayName, professionalId: proUids[7], professionalName: PROFESSIONALS[7].displayName, service: "Flooring",          status: "pending",    location: "ירושלים",                     price: 100, notes: "ריצוף מחדש חדר שינה - 20 מ״ר",      scheduledAt: new Date(now + 10 * day) },
      { customerId: customerUids[2], customerName: CUSTOMERS[2].displayName, professionalId: proUids[10],professionalName: PROFESSIONALS[10].displayName, service: "Cleaning",         status: "pending",    location: "חיפה",                        price: 65,  notes: "ניקיון לפני כניסה לדירה חדשה",      scheduledAt: new Date(now + 4  * day) },
      { customerId: customerUids[3], customerName: CUSTOMERS[3].displayName, professionalId: proUids[5], professionalName: PROFESSIONALS[5].displayName, service: "Painting",          status: "pending",    location: "ראשון לציון",                 price: 85,  notes: "צביעת חזית הבניין",                  scheduledAt: new Date(now + 14 * day) },
    ];

    const bookingIds: string[] = [];
    for (const b of bookings) {
      const ref = await db.collection("bookings").add({ ...b, createdAt: FieldValue.serverTimestamp() });
      bookingIds.push(ref.id);
    }

    // ── Create reviews ────────────────────────────────────────────────────────
    const reviews = [
      { bookingId: bookingIds[0], reviewerId: customerUids[0], reviewerName: CUSTOMERS[0].displayName, subjectId: proUids[0], subjectName: PROFESSIONALS[0].displayName, type: "customer_to_pro", rating: 5, comment: "יוסי הגיע תוך שעה, תיקן את הצינור הדולף בצורה מקצועית לגמרי. ניקה אחריו ולא השאיר בלגן. ממליצה בחום!" },
      { bookingId: bookingIds[1], reviewerId: customerUids[1], reviewerName: CUSTOMERS[1].displayName, subjectId: proUids[1], subjectName: PROFESSIONALS[1].displayName, type: "customer_to_pro", rating: 5, comment: "אחמד חשמלאי מעולה. הסביר כל שלב, עבד בצורה בטוחה ומדויקת. השקעים עובדים מצוין. בהחלט אחזור אליו." },
      { bookingId: bookingIds[2], reviewerId: customerUids[2], reviewerName: CUSTOMERS[2].displayName, subjectId: proUids[2], subjectName: PROFESSIONALS[2].displayName, type: "customer_to_pro", rating: 4, comment: "עבודת נגרות מרשימה. הספרייה יצאה יפה מאוד. לקח יום יותר ממה שתכנן אבל התוצאה שווה את זה." },
      { bookingId: bookingIds[3], reviewerId: customerUids[3], reviewerName: CUSTOMERS[3].displayName, subjectId: proUids[3], subjectName: PROFESSIONALS[3].displayName, type: "customer_to_pro", rating: 5, comment: "מיכל ניקתה את הדירה מקצה לקצה. הכל נוצץ. הגיעה בזמן, עבדה במרץ, ניחוח נעים נשאר. שירות מעולה!" },
      { bookingId: bookingIds[4], reviewerId: customerUids[4], reviewerName: CUSTOMERS[4].displayName, subjectId: proUids[4], subjectName: PROFESSIONALS[4].displayName, type: "customer_to_pro", rating: 4, comment: "אורן תיקן את המזגן תוך פחות משעה. אבחן את הבעיה מהר ותיקן בקיצוניות. יש לי אחריות לשנה. מרוצה." },
      { bookingId: bookingIds[5], reviewerId: customerUids[5], reviewerName: CUSTOMERS[5].displayName, subjectId: proUids[5], subjectName: PROFESSIONALS[5].displayName, type: "customer_to_pro", rating: 5, comment: "רועי צייר את 3 החדרים בצורה מושלמת. קווים ישרים, ללא טפטופים, גוונים בדיוק כמו שביקשתי. הצביע גם בסוף שבוע!" },
      { bookingId: bookingIds[6], reviewerId: customerUids[0], reviewerName: CUSTOMERS[0].displayName, subjectId: proUids[6], subjectName: PROFESSIONALS[6].displayName, type: "customer_to_pro", rating: 5, comment: "נועה עיצבה לנו את גינת הגג — תוצאה מדהימה! ידע מקצועי, הצעות יצירתיות ועבודה קפדנית. שכנים כבר שאלו מי עשה." },
      { bookingId: bookingIds[7], reviewerId: customerUids[1], reviewerName: CUSTOMERS[1].displayName, subjectId: proUids[8], subjectName: PROFESSIONALS[8].displayName, type: "customer_to_pro", rating: 4, comment: "טל הרכיב 6 פריטי איקאה תוך 3 שעות. מהיר, מדויק ואמין. מחיר הוגן. אחזור אליו בפעם הבאה." },

      // Pro to customer reviews
      { bookingId: bookingIds[0], reviewerId: proUids[0], reviewerName: PROFESSIONALS[0].displayName, subjectId: customerUids[0], subjectName: CUSTOMERS[0].displayName, type: "pro_to_customer", rating: 5, comment: "לקוחה נעימה ומכבדת. הגישה ברורה, התשלום מהיר. שמחתי לעזור." },
      { bookingId: bookingIds[3], reviewerId: proUids[3], reviewerName: PROFESSIONALS[3].displayName, subjectId: customerUids[3], subjectName: CUSTOMERS[3].displayName, type: "pro_to_customer", rating: 5, comment: "לקוח מסודר ומכבד. קיבל אותי בחום, הדירה הייתה נגישה ונוחה לעבודה. מומלץ!" },
      { bookingId: bookingIds[5], reviewerId: proUids[5], reviewerName: PROFESSIONALS[5].displayName, subjectId: customerUids[5], subjectName: CUSTOMERS[5].displayName, type: "pro_to_customer", rating: 4, comment: "רמי ידע בדיוק מה הוא רוצה — זה עוזר מאוד. תשלום מסודר בסיום העבודה." },
    ];

    for (const r of reviews) {
      await db.collection("reviews").add({ ...r, createdAt: FieldValue.serverTimestamp() });
    }

    // ── Create conversations & messages ───────────────────────────────────────
    const convos = [
      {
        participants: [customerUids[0], proUids[0]],
        names: { [customerUids[0]]: CUSTOMERS[0].displayName, [proUids[0]]: PROFESSIONALS[0].displayName },
        messages: [
          { senderId: customerUids[0], text: "שלום יוסי! יש לי צינור דולף תחת הכיור, האם אתה זמין מחר בבוקר?" },
          { senderId: proUids[0],      text: "שלום! כן, אני זמין מחר בין 9:00 ל-11:00. מה הכתובת המדויקת?" },
          { senderId: customerUids[0], text: "מצוין! הרחוב דיזנגוף 45, קומה 3, דירה 8. תודה רבה!" },
          { senderId: proUids[0],      text: "קיבלתי, אהיה שם ב-9:30. נסה לפנות את הארון מתחת לכיור אם אפשר." },
          { senderId: customerUids[0], text: "בסדר, אעשה זאת. תודה!" },
        ],
      },
      {
        participants: [customerUids[1], proUids[1]],
        names: { [customerUids[1]]: CUSTOMERS[1].displayName, [proUids[1]]: PROFESSIONALS[1].displayName },
        messages: [
          { senderId: customerUids[1], text: "היי אחמד, אני צריך להתקין 4 שקעים חדשים בסלון. כמה זמן לוקח לך?" },
          { senderId: proUids[1],      text: "שלום! בדרך כלל 2-3 שעות לפי מצב הקירות. יש גישה ללוח החשמל?" },
          { senderId: customerUids[1], text: "כן, לוח החשמל בכניסה. מתי אתה יכול להגיע?" },
          { senderId: proUids[1],      text: "אוכל להגיע ב-12 ביוני, יום ג׳ בבוקר. מתאים?" },
          { senderId: customerUids[1], text: "מושלם, נקבע!" },
        ],
      },
      {
        participants: [customerUids[4], proUids[6]],
        names: { [customerUids[4]]: CUSTOMERS[4].displayName, [proUids[6]]: PROFESSIONALS[6].displayName },
        messages: [
          { senderId: customerUids[4], text: "שלום נועה! ראיתי את הפרופיל שלך וממש אהבתי את העבודות. יש לנו גינה קטנה על הגג שצריכה עיצוב." },
          { senderId: proUids[6],      text: "שלום! שמחה לשמוע 😊 כמה מ״ר הגג בערך? ומה הסגנון שאתם מחפשים?" },
          { senderId: customerUids[4], text: "בערך 25 מ״ר. אנחנו רוצים משהו ירוק ומזמין, עם פינת ישיבה." },
          { senderId: proUids[6],      text: "נשמע מדהים! אני יכולה להגיע לסייר ביום ראשון בשעה 10:00. נסתכל ביחד ואציע תוכנית." },
          { senderId: customerUids[4], text: "מעולה, נחכה לך! הכתובת: ביאליק 12 רמת גן." },
        ],
      },
      {
        participants: [customerUids[2], proUids[3]],
        names: { [customerUids[2]]: CUSTOMERS[2].displayName, [proUids[3]]: PROFESSIONALS[3].displayName },
        messages: [
          { senderId: customerUids[2], text: "שלום מיכל, אני צריכה ניקיון עומק לדירה 5 חדרים לפני פסח. מה המחיר?" },
          { senderId: proUids[3],      text: "שלום! לדירה 5 חדרים זה בדרך כלל 6-8 שעות עבודה. יוצא כ-480-560 ₪. מה מצב הדירה כרגע?" },
          { senderId: customerUids[2], text: "סטנדרטי, לא גרוע במיוחד. אבל המטבח צריך תשומת לב." },
          { senderId: proUids[3],      text: "אין בעיה, אני מביאה את כל ציוד הניקיון כולל מוצרים לגריסה של שומן. אוכל ב-2 באפריל?" },
          { senderId: customerUids[2], text: "כן! מתאים מאוד. תודה רבה 🙏" },
        ],
      },
    ];

    for (const convo of convos) {
      const lastMsg = convo.messages[convo.messages.length - 1];
      const convRef = await db.collection("conversations").add({
        participants: convo.participants,
        participantNames: convo.names,
        lastMessage: lastMsg.text,
        lastMessageAt: FieldValue.serverTimestamp(),
      });

      for (const msg of convo.messages) {
        await db.collection("conversations").doc(convRef.id).collection("messages").add({
          ...msg,
          conversationId: convRef.id,
          createdAt: FieldValue.serverTimestamp(),
        });
      }
    }

    // ── Create notifications ──────────────────────────────────────────────────
    const notifications = [
      { userId: customerUids[0], title: "הזמנה אושרה!", body: `${PROFESSIONALS[0].displayName} אישר את הזמנתך לשירות אינסטלציה.`, type: "booking_accepted", read: false },
      { userId: customerUids[1], title: "עבודה הושלמה", body: `${PROFESSIONALS[1].displayName} סימן את העבודה כהושלמה. השאר ביקורת!`, type: "job_completed", read: false },
      { userId: customerUids[2], title: "הודעה חדשה", body: `${PROFESSIONALS[0].displayName} שלח לך הודעה.`, type: "new_message", read: true },
      { userId: customerUids[3], title: "הזמנה אושרה!", body: `${PROFESSIONALS[9].displayName} אישר את הזמנתך לחשמל ובית חכם.`, type: "booking_accepted", read: false },
      { userId: proUids[0], title: "בקשת עבודה חדשה!", body: `${CUSTOMERS[2].displayName} שלח בקשה לשירות אינסטלציה בחיפה.`, type: "booking_request", read: false },
      { userId: proUids[1], title: "בקשת עבודה חדשה!", body: `${CUSTOMERS[0].displayName} שלח בקשה להתקנת שקעים חשמל.`, type: "booking_request", read: false },
      { userId: proUids[3], title: "ביקורת חדשה!", body: `${CUSTOMERS[3].displayName} השאיר לך ביקורת 5 כוכבים.`, type: "new_review", read: false },
      { userId: proUids[6], title: "הודעה חדשה", body: `${CUSTOMERS[4].displayName} שלחה לך הודעה על גינת הגג.`, type: "new_message", read: false },
    ];

    for (const n of notifications) {
      await db.collection("notifications").add({ ...n, createdAt: FieldValue.serverTimestamp() });
    }

    return NextResponse.json({
      success: true,
      professionals: PROFESSIONALS.length,
      customers: CUSTOMERS.length,
      bookings: bookings.length,
      reviews: reviews.length,
      conversations: convos.length,
      notifications: notifications.length,
      logins: [
        ...CUSTOMERS.map((c) => ({ name: c.displayName, email: c.email, password: c.password, role: "customer" })),
        ...PROFESSIONALS.map((p) => ({ name: p.displayName, email: p.email, password: p.password, role: "professional" })),
      ],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
