"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";

export default function SetupProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/register");
  }, [loading, user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5 MB.");
      return;
    }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleContinue = async () => {
    if (!user) return;
    setUploading(true);
    setError("");
    try {
      if (file) {
        const fileRef = storageRef(storage, `avatars/${user.uid}/${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        await updateProfile(auth.currentUser!, { photoURL: url });
        await updateDoc(doc(db, "users", user.uid), { photoURL: url });
        await refreshProfile();
      }
      router.push("/select-role");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => router.push("/select-role");

  const initials = userProfile?.displayName
    ? userProfile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/30 text-white text-sm font-bold">1</div>
        <div className="h-0.5 w-10 bg-white/40 rounded" />
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-violet-600 text-sm font-bold shadow">2</div>
        <div className="h-0.5 w-10 bg-white/40 rounded" />
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/30 text-white text-sm font-bold">3</div>
      </div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center">

        <div className="flex justify-center mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">Add a Profile Photo</h1>
        <p className="mt-2 text-lg text-slate-500">Help professionals and customers recognise you</p>

        {/* Avatar */}
        <div className="relative mx-auto mt-8 mb-6 w-36 h-36">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-36 h-36 rounded-full object-cover shadow-xl border-4 border-violet-200"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-5xl font-extrabold shadow-xl border-4 border-white">
              {initials}
            </div>
          )}

          {/* Camera button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg border-2 border-white hover:bg-violet-700 transition"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 px-6 py-3 text-base font-semibold text-violet-700 hover:bg-violet-100 transition"
        >
          <Upload className="h-5 w-5" />
          {preview ? "Change Photo" : "Upload Photo"}
        </button>

        <p className="mt-2 text-sm text-slate-400">JPG, PNG or WEBP · Max 5 MB</p>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
        )}

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={uploading}
          className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-lg font-bold text-white shadow-lg hover:opacity-95 transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              {preview ? (
                <><CheckCircle2 className="h-5 w-5" /> Save & Continue</>
              ) : (
                <>Continue <ArrowRight className="h-5 w-5" /></>
              )}
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          className="mt-3 w-full py-3 text-base font-semibold text-slate-400 hover:text-slate-600 transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
