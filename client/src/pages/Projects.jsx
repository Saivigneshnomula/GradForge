import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const technologies = [
  "All",
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
];

const departments = [
  "All",
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
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [technology, setTechnology] = useState("All");
  const [department, setDepartment] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (technology !== "All") {
        params.technology = technology;
      }

      if (department !== "All") {
        params.department = department;
      }

      if (difficulty !== "All") {
        params.difficulty = difficulty;
      }

      const response = await api.get("/projects", {
        params,
      });

      setProjects(response.data.projects || []);
    } catch (err) {
      console.error("Fetch projects error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [technology, department, difficulty]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const clearFilters = () => {
    setSearch("");
    setTechnology("All");
    setDepartment("All");
    setDifficulty("All");

    setTimeout(() => {
      fetchProjects();
    }, 0);
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getDifficultyStyle = (value) => {
    if (value === "Beginner") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (value === "Intermediate") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-red-50 text-red-700 border-red-100";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            {/* Brand */}
            <div
              className="cursor-pointer"
              onClick={() => navigate("/projects")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-sm">
                  🚀
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Project Hub
                  </h1>

                  <p className="hidden text-xs text-slate-500 sm:block">
                    Build • Discover • Contribute
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:px-4"
              >
                <span className="sm:hidden">←</span>
                <span className="hidden sm:inline">← Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate("/projects/my")
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:px-4"
              >
                <span className="hidden sm:inline">
                  My Contributions
                </span>
                <span className="sm:hidden">
                  My Projects
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/projects/create")
                }
                className="rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:px-5"
              >
                +{" "}
                <span className="hidden sm:inline">
                  Contribute Project
                </span>
                <span className="sm:hidden">
                  Contribute
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* ================= HERO ================= */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-sm md:px-10 md:py-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
              <span>✨</span>
              <span>GradForge Project Community</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Discover projects.
              <br />
              Build something great.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Explore projects built by students, learn from
              real-world code, and contribute your own work
              to the GradForge community.
            </p>
          </div>
        </section>

        {/* ================= SEARCH ================= */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search projects, technologies, tags..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </section>

        {/* ================= FILTERS ================= */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Explore by filters
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Find projects that match your interests.
              </p>
            </div>

            {(technology !== "All" ||
              department !== "All" ||
              difficulty !== "All" ||
              search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Technology */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Technology
              </label>

              <select
                value={technology}
                onChange={(e) =>
                  setTechnology(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
              >
                {technologies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
              >
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white"
              >
                {difficulties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ================= TITLE ================= */}
        {!loading && !error && (
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Explore Projects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Discover projects from the GradForge
                community.
              </p>
            </div>

            <div className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block">
              {projects.length}{" "}
              {projects.length === 1
                ? "Project"
                : "Projects"}
            </div>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="text-4xl">⚠️</div>

            <h3 className="mt-3 font-semibold text-red-900">
              Something went wrong
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProjects}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                🚀
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No projects found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your filters or search terms.
                You can also contribute the first project
                matching your interests.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/projects/create")
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  + Contribute Project
                </button>
              </div>
            </div>
          )}

        {/* ================= PROJECT GRID ================= */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project._id}
                  onClick={() =>
                    navigate(
                      `/projects/${project._id}`
                    )
                  }
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                >
                  {/* Card top */}
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                        {project.technology}
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
                    <div className="mb-3">
                      {project.sourceType ===
                      "official" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                          ✓ GradForge Project
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                          👨‍💻 Student Contribution
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-slate-900 transition group-hover:text-indigo-600">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    {project.techStack?.length > 0 && (
                      <div className="mt-5 flex min-h-[28px] flex-wrap gap-2">
                        {project.techStack
                          .slice(0, 4)
                          .map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}

                        {project.techStack.length >
                          4 && (
                          <span className="px-1 py-1 text-xs text-slate-400">
                            +
                            {project.techStack.length -
                              4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card bottom */}
                  <div className="mt-auto border-t border-slate-100 px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      {/* Contributor */}
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {project.submittedBy
                            ?.profilePhoto ? (
                            <img
                              src={
                                project
                                  .submittedBy
                                  .profilePhoto
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitial(
                              project.submittedBy
                                ?.name
                            )
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-700">
                            {project.submittedBy
                              ?.name ||
                              "GradForge"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {project.department}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex shrink-0 items-center gap-3 text-xs text-slate-400">
                        <span>
                          ❤️{" "}
                          {project.likes?.length ||
                            0}
                        </span>

                        <span>
                          👁 {project.views || 0}
                        </span>
                      </div>
                    </div>

                    {/* Quick links */}
                    {(project.repositoryUrl ||
                      project.demoUrl) && (
                      <div className="mt-4 flex gap-2">
                        {project.repositoryUrl && (
                          <a
                            href={
                              project.repositoryUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            GitHub ↗
                          </a>
                        )}

                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="flex-1 rounded-lg bg-indigo-50 px-3 py-2 text-center text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default Projects;