import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { updateUserProfile } from "./firestore";
import { updateProfile, User } from "firebase/auth";

/**
 * Upload a profile photo to Firebase Storage and update the user's
 * Firestore document + Firebase Auth profile with the new URL.
 */
export async function uploadProfilePhoto(
  user: User,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `profile-photos/${user.uid}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Update Firebase Auth displayName/photoURL
  await updateProfile(user, { photoURL: url });

  // Update Firestore user document
  await updateUserProfile(user.uid, { photoURL: url });

  return url;
}
