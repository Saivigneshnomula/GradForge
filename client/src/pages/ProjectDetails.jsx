import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/projects/${id}`);

      const data = response.data;

      setProject(data);

      const currentUserId = localStorage.getItem("userId");

      if (currentUserId) {
        setLiked(
          data.likes?.some(
            (user) =>
              (user?._id || user)?.toString() ===
              currentUserId.toString()
          )
        );

        setBookmarked(
          data.bookmarks?.some(
            (user) =>
              (user?._id || user)?.toString() ===
              currentUserId.toString()
          )
        );
      }
    } catch (err) {
      console.error("Fetch project error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load this project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleLike = async () => {
    if (actionLoading || !project) return;

    try {
      setActionLoading(true);

      const response = await api.post(
        `/projects/${id}/like`
      );

      setLiked(response.data.liked);

      setProject((prev) => ({
        ...prev,
        likes: response.data.liked
          ? [...(prev.likes || []), "current-user"]
          : (prev.likes || []).filter(
              (item) => item !== "current-user"
            ),
      }));
    } catch (err) {
      console.error("Like project error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (actionLoading || !project) return;

    try {
      setActionLoading(true);

      const response = await api.post(
        `/projects/${id}/bookmark`
      );

      setBookmarked(response.data.bookmarked);
    } catch (err) {
      console.error(
        "Bookmark project error:",
        err
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "Beginner") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (difficulty === "Intermediate") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="h-72 animate-pulse rounded-3xl bg-white" />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-2xl bg-white lg:col-span-2" />
            <div className="h-80 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">😕</div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Project not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "This project may no longer be available."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Project Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[70px] max-w-6xl items-center justify-between gap-4 px-6">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <span className="text-lg">←</span>
            <span>Project Hub</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/projects/my")
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            My Contributions
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* ================= HERO ================= */}
        <section className="overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-sm md:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-300">
                  {project.technology}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {project.department}
                </span>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${getDifficultyStyle(
                    project.difficulty
                  )}`}
                >
                  {project.difficulty}
                </span>
              </div>

              {/* Source */}
              <div className="mb-4">
                {project.sourceType ===
                "official" ? (
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900">
                    ✓ Official GradForge Project
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
                    👨‍💻 Student Contribution
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {project.title}
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                {project.description}
              </p>

              {/* Stats */}
              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-slate-300">
                <span>
                  ❤️ {project.likes?.length || 0} likes
                </span>

                <span>
                  👁 {project.views || 0} views
                </span>

                <span>
                  👥{" "}
                  {project.collaborators?.length ||
                    0} collaborators
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={handleLike}
                disabled={actionLoading}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  liked
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {liked ? "❤️ Liked" : "♡ Like"}
              </button>

              <button
                type="button"
                onClick={handleBookmark}
                disabled={actionLoading}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  bookmarked
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {bookmarked
                  ? "🔖 Saved"
                  : "🔖 Save"}
              </button>
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            {/* Project Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Project Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Technology
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {project.technology}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {project.department}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Difficulty
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {project.difficulty}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Project Type
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {project.projectType}
                  </p>
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            {project.techStack?.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Tech Stack
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Tags */}
            {project.tags?.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Tags
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Collaborators */}
            {project.collaborators?.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">
                    Collaborators
                  </h2>

                  <span className="text-xs text-slate-400">
                    {project.collaborators.length}{" "}
                    members
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-4">
                  {project.collaborators.map(
                    (member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {getInitial(member.name)}
                        </div>

                        <span className="text-sm font-medium text-slate-700">
                          {member.name}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contributor */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contributed By
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                  {project.submittedBy
                    ?.profilePhoto ? (
                    <img
                      src={
                        project.submittedBy
                          .profilePhoto
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitial(
                      project.submittedBy?.name
                    )
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {project.submittedBy?.name ||
                      "GradForge"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {project.department} Student
                  </p>
                </div>
              </div>
            </section>

            {/* Project Links */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Project Links
              </h2>

              <div className="mt-4 space-y-3">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span>💻 GitHub Repository</span>
                    <span>↗</span>
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <span>🌐 Live Demo</span>
                    <span>↗</span>
                  </a>
                )}

                {project.documentationUrl && (
                  <a
                    href={project.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span>📄 Documentation</span>
                    <span>↗</span>
                  </a>
                )}

                {project.branch && (
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-400">
                      Git Branch
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {project.branch}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Contribution info */}
            <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
              <h2 className="font-bold text-indigo-900">
                Want to contribute?
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-700">
                Have a project that can help other students?
                Submit it to GradForge and it will be reviewed
                before publishing.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/projects/create")
                }
                className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                + Contribute Project
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;