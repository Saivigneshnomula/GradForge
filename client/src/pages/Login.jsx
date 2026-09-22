import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const EyeIcon = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {open && <path d="M4 4l16 16" />}
  </svg>
);

const GradForgeMark = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 8.5L12 4L21 8.5L12 13L3 8.5Z"
        fill="white"
      />
      <path
        d="M6 10.2V15.2C6 15.2 8.2 18 12 18C15.8 18 18 15.2 18 15.2V10.2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 9V14"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * AuthContext login() should save the token/user.
       * We also capture whatever it returns so that
       * admin users can be redirected to /admin.
       */
      const result = await login(email, password);

      /*
       * Try all possible places where the role may exist.
       * This makes the login work whether AuthContext returns:
       *
       * { role: "admin" }
       *
       * or:
       *
       * { user: { role: "admin" } }
       *
       * or stores the user in localStorage.
       */
      let role =
        result?.role ||
        result?.user?.role ||
        null;

      /*
       * If AuthContext doesn't return the user,
       * read it from localStorage.
       */
      if (!role) {
        try {
          const storedUser = JSON.parse(
            localStorage.getItem("user") || "null"
          );

          role = storedUser?.role || null;
        } catch {
          role = null;
        }
      }

      /*
       * Final redirect
       */
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a16] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl shadow-black/40">

        {/* ================= BRAND PANEL ================= */}
        <aside className="relative hidden w-[46%] overflow-hidden bg-gradient-to-br from-[#11163a] via-[#211451] to-[#090b1c] p-10 lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <GradForgeMark />

              <div>
                <div className="text-xl font-extrabold tracking-tight text-white">
                  GradForge
                </div>

                <div className="text-[9px] font-bold tracking-[2px] text-indigo-200">
                  FORGE YOUR FUTURE
                </div>
              </div>
            </div>

            <div className="mt-24 max-w-md">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
                Student career platform
              </p>

              <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight text-white">
                Learn.
                <br />
                Build.
                <br />
                Get hired.
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                One place for projects, opportunities, interview
                preparation, roadmaps and your career profile.
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-3 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]" />
            Built for students
          </div>
        </aside>

        {/* ================= FORM PANEL ================= */}
        <main className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-9 lg:hidden">
              <div className="flex items-center gap-3">
                <GradForgeMark />

                <div>
                  <div className="text-xl font-extrabold tracking-tight text-slate-900">
                    GradForge
                  </div>

                  <div className="text-[9px] font-bold tracking-[2px] text-indigo-600">
                    FORGE YOUR FUTURE
                  </div>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                Continue your journey
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your GradForge dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label className="label">
                  Email <span>*</span>
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="input"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="label !mb-0">
                    Password <span>*</span>
                  </label>
                </div>

                <div className="password-wrapper">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="input"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing you in..."
                  : "Sign in to GradForge"}
              </button>
            </form>

            {/* Register divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
                NEW TO GRADFORGE?
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Register */}
            <Link
              to="/register"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 text-center font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Create your account
            </Link>

            <p className="mt-8 text-center text-xs text-slate-400">
              © 2026 GradForge · Forge your future.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;