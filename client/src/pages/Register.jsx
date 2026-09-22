import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M4 4l16 16" />
      </>
    ) : (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const GradForgeMark = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
      <path d="M3 8.5L12 4L21 8.5L12 13L3 8.5Z" fill="white" />
      <path
        d="M6 10.2V15.2C6 15.2 8.2 18 12 18C15.8 18 18 15.2 18 15.2V10.2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M21 9V14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

const Field = ({ label, name, type = "text", placeholder, required = false, className = "", formData, handleChange }) => (
  <div className={className}>
    <label className="mb-2 block text-[13px] font-bold text-slate-700">
      {label} {required && <span className="text-indigo-600">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      autoComplete={name === "password" ? "new-password" : undefined}
      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", password: "",
    linkedinProfile: "", githubProfile: "",
    institution: "", degree: "", fieldOfStudy: "",
    startYear: "", endYear: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        password: formData.password,
        linkedinProfile: formData.linkedinProfile.trim(),
        githubProfile: formData.githubProfile.trim(),
        education: {
          institution: formData.institution.trim(),
          degree: formData.degree.trim(),
          fieldOfStudy: formData.fieldOfStudy.trim(),
          startYear: formData.startYear ? Number(formData.startYear) : undefined,
          endYear: formData.endYear ? Number(formData.endYear) : undefined,
        },
      });
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-6xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[360px_1fr]">

        {/* BRAND PANEL */}
        <aside className="relative hidden overflow-hidden bg-[#0b1023] p-9 text-white lg:flex lg:flex-col">
          <div className="absolute -right-28 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />

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

            <div className="mt-20">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-indigo-300">
                Welcome to GradForge
              </p>
              <h1 className="text-4xl font-black leading-tight">
                Build skills.
                <br />
                Build projects.
                <br />
                <span className="text-indigo-300">Build your future.</span>
              </h1>
              <p className="mt-6 max-w-xs text-sm leading-6 text-slate-400">
                One student platform for projects, careers, mentors, opportunities
                and interview preparation.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              {["Create your student profile", "Discover projects and opportunities", "Prepare for your career"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-black text-indigo-200">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-auto pt-10 text-xs text-slate-500">
            © 2026 GradForge
          </div>
        </aside>

        {/* FORM */}
        <main className="overflow-y-auto">
          <div className="mx-auto max-w-3xl px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
            <div className="mb-8 flex items-center justify-between lg:hidden">
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
              <Link to="/login" className="text-sm font-bold text-indigo-600">
                Login
              </Link>
            </div>

            <div className="mb-9">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Create account
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Start your GradForge journey
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your account and complete your profile to get started.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-9">

              <section>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-black text-white shadow-lg shadow-indigo-600/20">01</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Personal information</h3>
                    <p className="text-xs text-slate-500">Required account details</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" name="name" placeholder="Enter your full name" required className="sm:col-span-2" formData={formData} handleChange={handleChange} />
                  <Field label="Mobile number" name="mobile" type="tel" placeholder="9876543210" required formData={formData} handleChange={handleChange} />
                  <Field label="Email address" name="email" type="email" placeholder="you@example.com" required formData={formData} handleChange={handleChange} />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-slate-700">
                      Password <span className="text-indigo-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        minLength={6}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Minimum 6 characters.</p>
                  </div>
                </div>
              </section>

              <section className="border-t border-slate-100 pt-9">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-xs font-black text-white shadow-lg shadow-violet-600/20">02</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Professional profiles</h3>
                    <p className="text-xs text-slate-500">Optional — you can add these later</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="LinkedIn profile" name="linkedinProfile" type="url" placeholder="https://linkedin.com/in/yourname" formData={formData} handleChange={handleChange} />
                  <Field label="GitHub profile" name="githubProfile" type="url" placeholder="https://github.com/yourusername" formData={formData} handleChange={handleChange} />
                </div>
              </section>

              <section className="border-t border-slate-100 pt-9">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-600 text-xs font-black text-white shadow-lg shadow-fuchsia-600/20">03</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Education</h3>
                    <p className="text-xs text-slate-500">Optional — helps personalize your profile</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Institution" name="institution" placeholder="College / University" className="sm:col-span-2" formData={formData} handleChange={handleChange} />
                  <Field label="Degree" name="degree" placeholder="B.Tech" formData={formData} handleChange={handleChange} />
                  <Field label="Field of study" name="fieldOfStudy" placeholder="Computer Science" formData={formData} handleChange={handleChange} />
                  <Field label="Start year" name="startYear" type="number" placeholder="2022" formData={formData} handleChange={handleChange} />
                  <Field label="End year" name="endYear" type="number" placeholder="2026" formData={formData} handleChange={handleChange} />
                </div>
              </section>

              <div className="border-t border-slate-100 pt-7">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-4 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating your account..." : "Create GradForge account"}
                </button>

                <p className="mt-5 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-indigo-600 hover:text-violet-600">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
