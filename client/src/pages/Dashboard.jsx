import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/* =========================================================
   GRADFORGE LOGO
========================================================= */

const GradForgeLogo = ({ collapsed = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Graduation cap */}
          <path
            d="M3 9.5L12 5L21 9.5L12 14L3 9.5Z"
            fill="white"
          />

          <path
            d="M6.5 11.2V15.5C6.5 17.2 8.9 19 12 19C15.1 19 17.5 17.2 17.5 15.5V11.2L12 14L6.5 11.2Z"
            fill="white"
            fillOpacity="0.85"
          />

          <path
            d="M21 10V15"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Forge spark */}
          <path
            d="M18.5 4.5L19.1 6.2L20.8 6.8L19.1 7.4L18.5 9.1L17.9 7.4L16.2 6.8L17.9 6.2L18.5 4.5Z"
            fill="white"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="leading-tight">
          <div className="text-xl font-extrabold tracking-tight text-slate-900">
            Grad<span className="text-indigo-600">Forge</span>
          </div>

          <div className="text-[10px] font-medium tracking-[0.18em] text-slate-400 uppercase">
            Forge Your Future
          </div>
        </div>
      )}
    </div>
  );
};


/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const firstName =
    user?.name?.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <nav className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-50">

        <div className="flex items-center gap-4">

          {/* Mobile menu */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <span className="text-xl text-slate-700">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>

          {/* Logo */}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-left"
          >
            <GradForgeLogo />
          </button>

        </div>


        {/* Right side */}

        <div className="flex items-center gap-3">

          {/* Notification */}

          <button
            type="button"
            className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-slate-600"
            >
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 21h4"
                strokeLinecap="round"
              />
            </svg>

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
          </button>


          {/* User */}

          <div className="hidden sm:flex items-center gap-3 pl-2">

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Student"}
              </p>

              <p className="text-xs text-slate-400 capitalize">
                {user?.role || "student"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "S"}
            </div>

          </div>

        </div>

      </nav>


      <div className="flex">

        {/* ===================================================
            DESKTOP SIDEBAR
        =================================================== */}

        <aside className="hidden lg:flex flex-col w-[250px] min-h-[calc(100vh-72px)] bg-white border-r border-slate-200 p-5">

          <SidebarContent
            navigate={navigate}
          />

          <div className="mt-auto pt-5 border-t border-slate-100">

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
            >
              <span className="text-lg">↪</span>

              <span>
                Sign out
              </span>
            </button>

          </div>

        </aside>


        {/* ===================================================
            MOBILE SIDEBAR
        =================================================== */}

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">

            <div
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() =>
                setMobileMenuOpen(false)
              }
            />

            <aside className="absolute left-0 top-[72px] bottom-0 w-[270px] bg-white border-r border-slate-200 p-5 shadow-xl">

              <SidebarContent
                navigate={navigate}
                closeMenu={() =>
                  setMobileMenuOpen(false)
                }
              />

              <div className="absolute bottom-5 left-5 right-5 pt-5 border-t border-slate-100">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  <span className="text-lg">
                    ↪
                  </span>

                  Sign out
                </button>

              </div>

            </aside>

          </div>
        )}


        {/* ===================================================
            MAIN
        =================================================== */}

        <main className="flex-1 min-w-0">

          <div className="max-w-[1500px] mx-auto p-5 sm:p-7 lg:p-10">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-7 sm:p-9 lg:p-10 text-white shadow-sm">

              {/* Decorative circles */}

              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10" />

              <div className="absolute right-20 -bottom-28 w-72 h-72 rounded-full bg-white/5" />

              <div className="relative z-10 max-w-3xl">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Your career journey starts here
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Good afternoon, {firstName}.
                </h1>

                <p className="mt-4 text-indigo-100 text-sm sm:text-base max-w-2xl leading-7">
                  Build your skills, strengthen your profile,
                  create real projects, and get ready for your
                  next career opportunity.
                </p>

                <div className="flex flex-wrap gap-3 mt-7">

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/roadmaps")
                    }
                    className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition shadow-sm"
                  >
                    Explore Roadmaps
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/resume-builder")
                    }
                    className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition"
                  >
                    Build Resume
                  </button>

                </div>

              </div>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-7">

              <StatCard
                icon="🎯"
                title="Job Readiness"
                value="0%"
                description="Complete your career profile"
              />

              <StatCard
                icon="📚"
                title="Learning Progress"
                value="0%"
                description="Start a career roadmap"
              />

              <StatCard
                icon="⌘"
                title="Problems Solved"
                value="0"
                description="Explore coding resources"
              />

              <StatCard
                icon="◈"
                title="Projects"
                value="0"
                description="Build your portfolio"
              />

            </section>


            {/* =================================================
                ROADMAP
            ================================================= */}

            <section className="mt-8">

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Your Career Roadmap
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Follow a structured path toward your target career.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/roadmaps")
                    }
                    className="hidden sm:block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View all →
                  </button>

                </div>


                <div className="p-6">

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 sm:p-10 text-center">

                    <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">

                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />

                        <path
                          d="M8 14l2-5 6-2-2 6-6 1Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                    </div>

                    <h3 className="font-bold text-slate-900">
                      No roadmap selected yet
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-6">
                      Choose a career path and GradForge
                      will help you organize what to learn,
                      practice, and build next.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/roadmaps")
                      }
                      className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                    >
                      Explore Career Paths
                    </button>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="mt-8">

              <div className="mb-5">

                <h2 className="text-lg font-bold text-slate-900">
                  Continue Building
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Everything you need to move closer to your career goals.
                </p>

              </div>


              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <ActionCard
                  icon="🧭"
                  title="Career Roadmaps"
                  description="Choose a career path and follow a structured learning journey."
                  button="Explore Roadmaps"
                  onClick={() =>
                    navigate("/roadmaps")
                  }
                />


                <ActionCard
                  icon="🚀"
                  title="Project Hub"
                  description="Discover projects and build practical experience for your portfolio."
                  button="Explore Projects"
                  onClick={() =>
                    navigate("/projects")
                  }
                />


                <ActionCard
                  icon="🎤"
                  title="Interview Questions"
                  description="Explore HR and technical questions across popular development technologies."
                  button="View Questions"
                  onClick={() =>
                    navigate("/interview-prep")
                  }
                />


                <ActionCard
                  icon="📄"
                  title="Resume Builder"
                  description="Create a polished professional resume using your GradForge profile."
                  button="Build Resume"
                  onClick={() =>
                    navigate("/resume-builder")
                  }
                />


                {user?.role === "student" && (
                  <ActionCard
                    icon="✦"
                    title="Become a Mentor"
                    description="Share your experience and help other students grow."
                    button="Apply as Mentor"
                    onClick={() =>
                      navigate("/become-mentor")
                    }
                  />
                )}

              </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">

              <div className="flex items-center gap-2">
                <GradForgeLogo collapsed />
                <span>
                  © {new Date().getFullYear()} GradForge
                </span>
              </div>

              <span>
                Forge your skills. Build your future.
              </span>

            </footer>

          </div>

        </main>

      </div>

    </div>
  );
};


/* =========================================================
   SIDEBAR
========================================================= */

const SidebarContent = ({
  navigate,
  closeMenu,
}) => {

  const handleNavigation = (path) => {
    navigate(path);

    if (closeMenu) {
      closeMenu();
    }
  };

  return (
    <nav className="space-y-1">

      <SidebarLabel>
        WORKSPACE
      </SidebarLabel>

      <SidebarItem
        label="Dashboard"
        icon="⌂"
        active
        onClick={() =>
          handleNavigation("/dashboard")
        }
      />

      <SidebarItem
        label="Roadmaps"
        icon="◇"
        onClick={() =>
          handleNavigation("/roadmaps")
        }
      />

      <SidebarItem
        label="Community"
        icon="◎"
        onClick={() =>
          handleNavigation("/community")
        }
      />

      <SidebarItem
        label="Ask & Solve"
        icon="?"
        onClick={() =>
          handleNavigation("/ask-solve")
        }
      />

      <SidebarItem
        label="Projects"
        icon="◈"
        onClick={() =>
          handleNavigation("/projects")
        }
      />

      <SidebarLabel>
        CAREER
      </SidebarLabel>

      <SidebarItem
        label="Interviews"
        icon="◉"
        onClick={() =>
          handleNavigation("/interview-prep")
        }
      />

      <SidebarItem
        label="Resume Builder"
        icon="▣"
        onClick={() =>
          handleNavigation("/resume-builder")
        }
      />

      <div className="pt-5 mt-5 border-t border-slate-100">

        <SidebarItem
          label="My Profile"
          icon="○"
          onClick={() =>
            handleNavigation("/profile")
          }
        />

        <SidebarItem
          label="Settings"
          icon="⚙"
          onClick={() => {}}
        />

      </div>

    </nav>
  );
};


/* =========================================================
   SIDEBAR LABEL
========================================================= */

const SidebarLabel = ({ children }) => {
  return (
    <div className="px-4 pt-2 pb-2 text-[10px] font-bold tracking-[0.16em] text-slate-400">
      {children}
    </div>
  );
};


/* =========================================================
   SIDEBAR ITEM
========================================================= */

const SidebarItem = ({
  label,
  icon,
  active,
  onClick,
}) => {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >

      <span
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
          active
            ? "bg-indigo-100 text-indigo-600"
            : "text-slate-400"
        }`}
      >
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );
};


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  title,
  value,
  description,
}) => {

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-semibold">
          {icon}
        </div>

      </div>

      <p className="text-xs text-slate-400 mt-4">
        {description}
      </p>

    </div>
  );
};


/* =========================================================
   ACTION CARD
========================================================= */

const ActionCard = ({
  icon,
  title,
  description,
  button,
  onClick,
}) => {

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition">

      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-semibold mb-5 group-hover:bg-indigo-600 group-hover:text-white transition">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-6 min-h-[48px]">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 text-sm text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center gap-1"
      >
        {button}

        <span className="group-hover:translate-x-1 transition">
          →
        </span>
      </button>

    </div>
  );
};


export default Dashboard;