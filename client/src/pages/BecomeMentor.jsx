import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const BecomeMentor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  const [formData, setFormData] = useState({
    designation: "",
    company: "",
    experience: "",
    expertise: "",
    skills: "",
    mentoringAreas: "",
    bio: "",
    linkedinProfile: "",
    githubProfile: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CHECK EXISTING APPLICATION
  // ==========================================

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const response = await api.get("/mentor-applications/me");

        setExistingApplication(response.data.application);
      } catch (error) {
        // 404 simply means no application exists
        if (error.response?.status !== 404) {
          console.error("Application check error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkApplication();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // SUBMIT APPLICATION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        designation: formData.designation.trim(),
        company: formData.company.trim(),
        experience: Number(formData.experience),
        expertise: formData.expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        mentoringAreas: formData.mentoringAreas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        bio: formData.bio.trim(),
        linkedinProfile: formData.linkedinProfile.trim(),
        githubProfile: formData.githubProfile.trim(),
      };

      const response = await api.post(
        "/mentor-applications",
        payload
      );

      setExistingApplication(response.data.application);

      setSuccess(
        "Your mentor application has been submitted successfully."
      );
    } catch (error) {
      console.error("Mentor application error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit mentor application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  // ==========================================
  // NON-STUDENT
  // ==========================================

  if (user?.role !== "student") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="text-5xl mb-4">
            👨‍🏫
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Mentor Application
          </h1>

          <p className="mt-3 text-slate-500">
            Only student accounts can apply to become mentors.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // EXISTING APPLICATION
  // ==========================================

  if (existingApplication) {
    const status = existingApplication.status;

    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-3xl mx-auto">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

            <div className="bg-slate-900 px-8 py-10 text-white">
              <p className="text-sm text-slate-300 font-medium">
                GradForge Mentor Program
              </p>

              <h1 className="text-3xl font-bold mt-2">
                Mentor Application
              </h1>

              <p className="mt-3 text-slate-300">
                Your application status is shown below.
              </p>
            </div>

            <div className="p-8">

              {status === "pending" && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mb-5">
                    ⏳
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Application Under Review
                  </h2>

                  <p className="mt-3 text-slate-600 leading-7">
                    Your mentor application has been submitted and
                    is waiting for admin review. You will become a
                    mentor after your application is approved.
                  </p>

                  <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                    Status: <strong>Pending</strong>
                  </div>
                </>
              )}

              {status === "approved" && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-5">
                    ✓
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    You're a Mentor!
                  </h2>

                  <p className="mt-3 text-slate-600 leading-7">
                    Congratulations! Your mentor application has
                    been approved.
                  </p>

                  <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
                    Status: <strong>Approved</strong>
                  </div>
                </>
              )}

              {status === "rejected" && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-2xl mb-5">
                    !
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Application Rejected
                  </h2>

                  <p className="mt-3 text-slate-600 leading-7">
                    Your application was not approved. You can
                    review the feedback and resubmit an improved
                    application.
                  </p>

                  {existingApplication.rejectionReason && (
                    <div className="mt-6 p-5 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm font-semibold text-red-800">
                        Admin Feedback
                      </p>

                      <p className="mt-2 text-red-700">
                        {existingApplication.rejectionReason}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        designation:
                          existingApplication.designation || "",
                        company:
                          existingApplication.company || "",
                        experience:
                          existingApplication.experience ?? "",
                        expertise:
                          existingApplication.expertise?.join(", ") ||
                          "",
                        skills:
                          existingApplication.skills?.join(", ") ||
                          "",
                        mentoringAreas:
                          existingApplication.mentoringAreas?.join(
                            ", "
                          ) || "",
                        bio:
                          existingApplication.bio || "",
                        linkedinProfile:
                          existingApplication.linkedinProfile || "",
                        githubProfile:
                          existingApplication.githubProfile || "",
                      });

                      setExistingApplication(null);
                    }}
                    className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    Edit & Resubmit
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // APPLICATION FORM
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      <div className="max-w-4xl mx-auto">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          {/* HEADER */}

          <div className="bg-slate-900 px-8 py-10 text-white">

            <p className="text-sm font-medium text-indigo-300">
              GradForge Mentor Program
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Become a Mentor
            </h1>

            <p className="mt-3 text-slate-300 max-w-2xl leading-7">
              Share your knowledge, experience and guidance with
              students who are building their careers.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8"
          >

            {/* PROFESSIONAL INFORMATION */}

            <section>

              <h2 className="text-xl font-bold text-slate-900">
                Professional Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Tell students about your professional background.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                <div>
                  <label className="label">
                    Designation <span>*</span>
                  </label>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    Company <span>*</span>
                  </label>

                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Microsoft"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    Years of Experience <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    min="0"
                    step="0.5"
                    className="input"
                    required
                  />
                </div>

              </div>

            </section>

            {/* EXPERTISE */}

            <section>

              <h2 className="text-xl font-bold text-slate-900">
                Expertise & Skills
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Separate multiple items with commas.
              </p>

              <div className="space-y-6 mt-6">

                <div>
                  <label className="label">
                    Areas of Expertise
                  </label>

                  <input
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g. Web Development, System Design, Cloud"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    Skills
                  </label>

                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, MongoDB, AWS"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    What Can You Mentor Students In?
                  </label>

                  <input
                    name="mentoringAreas"
                    value={formData.mentoringAreas}
                    onChange={handleChange}
                    placeholder="e.g. Projects, Placements, Interview Preparation"
                    className="input"
                  />
                </div>

              </div>

            </section>

            {/* BIO */}

            <section>

              <h2 className="text-xl font-bold text-slate-900">
                About You
              </h2>

              <div className="mt-6">

                <label className="label">
                  Mentor Bio <span>*</span>
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell students about your experience and how you can help them..."
                  rows="6"
                  maxLength="2000"
                  className="input resize-none"
                  required
                />

                <p className="text-xs text-slate-400 mt-2">
                  {formData.bio.length}/2000
                </p>

              </div>

            </section>

            {/* SOCIAL PROFILES */}

            <section>

              <h2 className="text-xl font-bold text-slate-900">
                Professional Links
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                <div>
                  <label className="label">
                    LinkedIn Profile
                  </label>

                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    GitHub Profile
                  </label>

                  <input
                    type="url"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="input"
                  />
                </div>

              </div>

            </section>

            {/* REVIEW NOTICE */}

            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">

              <div className="flex gap-3">

                <div className="text-xl">
                  ℹ️
                </div>

                <div>

                  <h3 className="font-semibold text-indigo-900">
                    Admin Review Required
                  </h3>

                  <p className="text-sm text-indigo-700 mt-1 leading-6">
                    Your application will be reviewed by GradForge
                    administrators. You will become a mentor only
                    after your application is approved.
                  </p>

                </div>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                {success}
              </div>
            )}

            {/* SUBMIT */}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Mentor Application"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-7 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeMentor;