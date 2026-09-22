import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const technologies = [
  "MERN",
  "MEAN",
  "JavaFSD",
  "PythonFSD",
  "AI-ML",
  "Data Science",
  "DevOps",
  "VLSI",
  "Android",
  "Flutter",
  "IoT",
  "Mechanical",
  "Civil",
  "Other",
];

const departments = [
  "CSE",
  "ECE",
  "EEE",
  "AIML",
  "EIE",
  "Mechanical",
  "Civil",
  "IT",
  "Other",
];

const difficulties = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const projectTypes = [
  "Mini Project",
  "Major Project",
  "Academic Project",
  "Personal Project",
  "Hackathon Project",
  "Research Project",
  "Other",
];

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technology: "MERN",
    department: "CSE",
    difficulty: "Beginner",
    projectType: "Personal Project",
    techStack: "",
    tags: "",
    repositoryUrl: "",
    branch: "main",
    demoUrl: "",
    documentationUrl: "",
  });

  const [projectStatus, setProjectStatus] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // LOAD PROJECT
  // ===============================
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/projects/my"
        );

        const project = response.data.projects.find(
          (item) => item._id === id
        );

        if (!project) {
          setError("Project not found.");
          return;
        }

        if (project.status === "approved") {
          setError(
            "Approved projects cannot be edited directly."
          );
          return;
        }

        setProjectStatus(project.status);

        setFormData({
          title: project.title || "",
          description: project.description || "",
          technology:
            project.technology || "MERN",
          department:
            project.department || "CSE",
          difficulty:
            project.difficulty || "Beginner",
          projectType:
            project.projectType ||
            "Personal Project",
          techStack:
            project.techStack?.join(", ") || "",
          tags:
            project.tags?.join(", ") || "",
          repositoryUrl:
            project.repositoryUrl || "",
          branch: project.branch || "main",
          demoUrl: project.demoUrl || "",
          documentationUrl:
            project.documentationUrl || "",
        });
      } catch (err) {
        console.error(
          "Load project error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // UPDATE PROJECT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      setError(
        "Project title and description are required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,

        techStack: formData.techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        tags: formData.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await api.put(
        `/projects/${id}`,
        payload
      );

      setSuccess(
        response.data.message ||
          "Project updated successfully."
      );

      setTimeout(() => {
        navigate("/projects/my");
      }, 1200);
    } catch (err) {
      console.error(
        "Update project error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update project."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 h-[700px] animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">⚠️</div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to edit project
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/projects/my")
            }
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to My Contributions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Contribution
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update your project and resubmit it for review.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/projects/my")
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← My Contributions
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Rejected notice */}
        {projectStatus === "rejected" && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex gap-3">
              <span className="text-xl">
                ⚠️
              </span>

              <div>
                <h3 className="font-semibold text-red-900">
                  Project needs changes
                </h3>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Update the requested information and
                  submit the project again. It will return
                  to the pending review queue.
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          {/* BASIC INFO */}
          <section>
            <h2 className="text-lg font-bold text-slate-900">
              Project Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the basic details of your project.
            </p>

            {/* Title */}
            <div className="mt-6">
              <label className="label">
                Project Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
                className="input"
                required
              />
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="label">
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={7}
                maxLength={5000}
                className="input resize-y"
                required
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {formData.description.length}/5000
              </p>
            </div>

            {/* Technology / Department */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="label">
                  Technology <span>*</span>
                </label>

                <select
                  name="technology"
                  value={formData.technology}
                  onChange={handleChange}
                  className="input"
                >
                  {technologies.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="label">
                  Department <span>*</span>
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input"
                >
                  {departments.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Difficulty / Type */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="label">
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="input"
                >
                  {difficulties.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="label">
                  Project Type
                </label>

                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="input"
                >
                  {projectTypes.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Tech stack */}
            <div className="mt-6">
              <label className="label">
                Technologies Used
              </label>

              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="input"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate technologies with commas.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="label">
                Tags
              </label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="web, full-stack, college"
                className="input"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate tags with commas.
              </p>
            </div>
          </section>

          {/* LINKS */}
          <section className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900">
              Project Links
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep your project links up to date.
            </p>

            {/* GitHub */}
            <div className="mt-6">
              <label className="label">
                GitHub Repository
              </label>

              <input
                type="url"
                name="repositoryUrl"
                value={formData.repositoryUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                className="input"
              />
            </div>

            {/* Branch */}
            <div className="mt-6">
              <label className="label">
                Git Branch
              </label>

              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Demo */}
            <div className="mt-6">
              <label className="label">
                Live Demo URL
              </label>

              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                placeholder="https://your-project.com"
                className="input"
              />
            </div>

            {/* Documentation */}
            <div className="mt-6">
              <label className="label">
                Documentation URL
              </label>

              <input
                type="url"
                name="documentationUrl"
                value={formData.documentationUrl}
                onChange={handleChange}
                placeholder="Google Drive / GitHub documentation"
                className="input"
              />
            </div>
          </section>

          {/* REVIEW NOTICE */}
          <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="flex gap-3">
              <span className="text-xl">
                🔄
              </span>

              <div>
                <h3 className="font-semibold text-indigo-900">
                  Resubmission
                </h3>

                <p className="mt-1 text-sm leading-6 text-indigo-700">
                  After you submit these changes, the
                  project will return to{" "}
                  <strong>Pending Review</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate("/projects/my")
              }
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Submitting..."
                : "Save & Resubmit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProject;