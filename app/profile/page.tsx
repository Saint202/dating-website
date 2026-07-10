"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let photoUrl = "";

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          setError(uploadData.error || "Photo upload failed");
          setLoading(false);
          return;
        }

        photoUrl = uploadData.url;
      }

      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: age ? parseInt(age) : null,
          bio,
          photoUrl,
        }),
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        setError(profileData.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="stack-card w-full max-w-sm space-y-5 p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-foreground">Your profile</h1>
          <p className="mt-1 text-sm text-muted">Tell people a bit about you</p>
        </div>

        {error && (
          <p className="rounded-lg bg-coral/10 p-3 text-sm text-coral-dark">
            {error}
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-background bg-background shadow-md">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                No photo
              </div>
            )}
          </div>
          <label className="cursor-pointer rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-foreground hover:bg-background">
            Choose photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Age
          </label>
          <input
            type="number"
            required
            min={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-coral py-3 font-semibold text-white shadow-md shadow-coral/25 transition hover:bg-coral-dark disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}