import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const MentorProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    designation: "",
    company: "",
    experience: 0,
    expertise: "",
    mentoringAreas: "",
    bio: "",
    isAvailable: true,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "mentor") {
      navigate("/dashboard");
      return;
    }

    fetchMentorProfile();
  }, [user, authLoading, navigate]);

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/mentor-profile/me");
      const mentor = response.data.mentor;

      const profile = mentor.mentorProfile || {};

      setFormData({
        designation: profile.designation || "",
        company: profile.company || "",
        experience: profile.experience || 0,
        expertise: Array.isArray(profile.expertise)
          ? profile.expertise.join(", ")
          : "",
        mentoringAreas: Array.isArray(profile.mentoringAreas)
          ? profile.mentoringAreas.join(", ")
          : "",
        bio: profile.bio || "",
        isAvailable:
          profile.isAvailable !== undefined ? profile.isAvailable : true,
      });
    } catch (err) {
      console.error("Failed to load mentor profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load mentor profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.designation.trim()) {
      setError("Designation is required");
      return;
    }

    if (!formData.company.trim()) {
      setError("Company is required");
      return;
    }

    if (!formData.bio.trim()) {
      setError("Bio is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        designation: formData.designation.trim(),
        company: formData.company.trim(),
        experience: Number(formData.experience),
        expertise: formData.expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        mentoringAreas: formData.mentoringAreas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        bio: formData.bio.trim(),
        isAvailable: formData.isAvailable,
      };

      await api.put("/mentor-profile/me", payload);

      setMessage("Mentor profile updated successfully");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Failed to update mentor profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update mentor profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading mentor profile...</p>
      </div>
    );
  }

  if (!user || user.role !== "mentor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              GradForge
            </h1>
            <p className="text-sm text-gray-500">
              Mentor Profile
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Mentor Profile
          </h2>

          <p className="mt-2 text-gray-600">
            Tell students about your professional experience and
            how you can help them.
          </p>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-8 space-y-8"
        >
          {/* PROFESSIONAL INFORMATION */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Professional Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              {/* DESIGNATION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* COMPANY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Microsoft"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* EXPERIENCE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>

                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* EXPERTISE */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Expertise
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Expertise
            </label>

            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, System Design"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Separate multiple skills with commas.
            </p>
          </section>

          {/* MENTORING AREAS */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Mentoring
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              What can you mentor students in?
            </label>

            <input
              type="text"
              name="mentoringAreas"
              value={formData.mentoringAreas}
              onChange={handleChange}
              placeholder="Career Guidance, Interview Preparation, Web Development"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Separate multiple areas with commas.
            </p>
          </section>

          {/* BIO */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              About You
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mentor Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="6"
              maxLength="2000"
              placeholder="Tell students about your experience, career journey, and how you can help them..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <p className="text-xs text-gray-500 mt-2">
              Maximum 2000 characters.
            </p>
          </section>

          {/* AVAILABILITY */}
          <section>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-5">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Available for Mentorship
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Let students know whether you are currently
                  accepting mentorship requests.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          </section>

          {/* SOCIAL PROFILES */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Social Profiles
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>

                <input
                  type="text"
                  value={user.linkedinProfile || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub
                </label>

                <input
                  type="text"
                  value={user.githubProfile || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              These profiles are managed from your main profile.
            </p>
          </section>

          {/* ACTIONS */}
          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Mentor Profile"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default MentorProfile;