import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function CreateProject() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      setLoading(true);

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

      const response = await api.post(
        "/projects",
        payload
      );

      setSuccess(
        response.data.message ||
          "Project submitted successfully!"
      );

      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    } catch (err) {
      console.error(
        "Create project error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to submit project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Contribute a Project
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Share your project with the GradForge
              community
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Projects
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          {/* Information */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900">
              Project Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tell other students what you built.
            </p>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="label">
              Project Title <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Student Management System"
              maxLength={200}
              className="input"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="label">
              Description <span>*</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain what your project does, the problem it solves, and its main features..."
              rows={6}
              maxLength={5000}
              className="input resize-y"
              required
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {formData.description.length}/5000
            </p>
          </div>

          {/* Technology / Department */}
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="label">
                Technology / Stack <span>*</span>
              </label>

              <select
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                className="input"
              >
                {technologies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty / Type */}
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
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
                {difficulties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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
                {projectTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <label className="label">
              Technologies Used
            </label>

            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Express"
              className="input"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate technologies with commas.
            </p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <label className="label">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="web, full-stack, college, management"
              className="input"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate tags with commas.
            </p>
          </div>

          {/* Repository */}
          <div className="mb-8 border-t border-slate-200 pt-8">
            <h2 className="mb-1 text-lg font-bold text-slate-900">
              Project Links
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Add links so students can explore and use
              your project.
            </p>

            {/* GitHub */}
            <div className="mb-6">
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
            <div className="mb-6">
              <label className="label">
                Git Branch
              </label>

              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="main"
                className="input"
              />
            </div>

            {/* Demo */}
            <div className="mb-6">
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
            <div>
              <label className="label">
                Documentation URL
              </label>

              <input
                type="url"
                name="documentationUrl"
                value={formData.documentationUrl}
                onChange={handleChange}
                placeholder="Google Drive / GitHub documentation link"
                className="input"
              />
            </div>
          </div>

          {/* Approval notice */}
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <span className="text-xl">🛡️</span>

              <div>
                <h3 className="font-semibold text-amber-900">
                  Admin Review
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Your project will be reviewed by a
                  GradForge administrator before it becomes
                  publicly visible in the Project Hub.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : "Submit for Review"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateProject;