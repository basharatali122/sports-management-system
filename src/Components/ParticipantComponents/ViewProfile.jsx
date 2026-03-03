import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useUser from "../../context/UserContext";

export default function ViewProfile() {
  const { user, setUser } = useUser();
  const [imgData, setImgData] = useState({ file: null, preview: null });
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const storedId = user.profileImageId || localStorage.getItem("profileImageId");
    if (storedId) {
      setImageUrl(`http://localhost:3000/img/${storedId}`);
    } else {
      setImageUrl(null);
    }
    setLoadingImage(false);
  }, [user]);

  // 🖼️ Generate image preview on file selection
  useEffect(() => {
    if (!imgData.file) {
      setImgData((prev) => ({ ...prev, preview: null }));
      return;
    }
    const previewUrl = URL.createObjectURL(imgData.file);
    setImgData((prev) => ({ ...prev, preview: previewUrl }));
    return () => URL.revokeObjectURL(previewUrl);
  }, [imgData.file]);

  // 📤 Handle upload
  const handleUpload = async () => {
    if (!imgData.file) return toast.error("Please select an image first.");
    if (!user) return toast.error("You must be logged in.");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imgData.file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // ✅ Update user context and storage
      const newUser = { ...user, profileImageId: data.imageId };
      setUser(newUser);
      localStorage.setItem("profileImageId", data.imageId);
      setImageUrl(`http://localhost:3000/img/${data.imageId}`);

      // ✅ Reset image data
      setImgData({ file: null, preview: null });

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // 🚫 Not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600 font-medium text-lg">
          🚫 You must be logged in to view your profile.
        </div>
      </div>
    );
  }

  // 🧩 UI
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 overflow-hidden"
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-tight">
          My Profile
        </h1>

        {/* Profile Image */}
        <motion.div className="relative flex justify-center" whileHover={{ scale: 1.02 }}>
          {loadingImage ? (
            <div className="w-36 h-36 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-400 to-blue-400 opacity-60 blur-lg"></div>
              {imgData.preview || imageUrl ? (
                <img
                  src={imgData.preview || imageUrl}
                  alt="Profile"
                  className="relative w-36 h-36 rounded-full object-cover border-[4px] border-white shadow-lg"
                />
              ) : (
                <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white text-4xl font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          )}

          {/* Upload Icon */}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-2 right-1/3 bg-white border border-gray-200 shadow-sm rounded-full w-9 h-9 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all cursor-pointer"
            title="Upload new profile picture"
          >
            <Camera size={18} />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              setImgData({ file });
            }}
          />
        </motion.div>

        {/* User Info */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <span className="inline-block mt-3 bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
            {user.role || "Participant"}
          </span>
        </div>

        {/* Upload Button */}
        {imgData.file && (
          <motion.button
            onClick={handleUpload}
            whileTap={{ scale: 0.97 }}
            disabled={uploading}
            className={`mt-6 w-full py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 text-white transition-all ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Profile Picture"
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
