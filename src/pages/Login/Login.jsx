import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearLoginError, USER_CREDENTIALS } from "../../store/slices/authSlice";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const dispatch = useDispatch();
  const { loginError } = useSelector((s) => s.auth);
  const [form, setForm]               = useState({ email: "", password: "" });
  const [errors, setErrors]           = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { dispatch(clearLoginError()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name])  setErrors((p) => ({ ...p, [name]: "" }));
    if (loginError)    dispatch(clearLoginError());
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim())    errs.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    dispatch(login(form));
  };

  const fillCredentials = (cred) => {
    setForm({ email: cred.email, password: cred.password });
    setErrors({});
    dispatch(clearLoginError());
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Left branding panel — desktop only ── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-10 xl:p-14 text-white shrink-0"
        style={{ background: "linear-gradient(160deg,#1E1E1E 0%,#2d2d2d 60%,#1a2e1a 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 0 16px rgba(34,197,94,.4)" }}
          >
            HS
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight">HSClogic</p>
            <p className="text-xs" style={{ color: "#22c55e" }}>HR Management System</p>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-3xl xl:text-4xl font-bold leading-snug mb-4">
            Streamline your<br />
            <span style={{ color: "#22c55e" }}>HR Operations</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Manage employees, track recruitment pipelines, and monitor attendance — all in one
            unified platform built for HSClogic.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { label: "Employee Management",   desc: "Create, update and manage all employee records"      },
              { label: "Recruitment Tracking",  desc: "Track candidates through the full hiring pipeline"   },
              { label: "Attendance Monitoring", desc: "Record check-ins, hours and attendance history"      },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(34,197,94,.2)", border: "1px solid #22c55e" }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600">© 2026 HSClogic Pvt. Ltd. All rights reserved.</p>
      </div>

      {/* ── Right — login form ── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
              style={{ backgroundColor: "#22c55e" }}
            >
              HS
            </div>
            <div>
              <p className="font-bold text-gray-800 text-base">HSClogic</p>
              <p className="text-xs text-gray-500">HR Management System</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-7">Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <MdEmail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@hsclogic.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none
                    focus:ring-2 focus:ring-green-500 transition
                    ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <MdLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl focus:outline-none
                    focus:ring-2 focus:ring-green-500 transition
                    ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 tap-target flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Auth error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold text-white rounded-xl transition tap-target"
              style={{ backgroundColor: "#22c55e" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
            >
              Sign In
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                Demo — tap to fill
              </p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-2">
              {USER_CREDENTIALS.map((cred) => {
                const roleColor =
                  cred.role === "Admin"      ? { bg: "#dcfce7", text: "#15803d" } :
                  cred.role === "HR Staff"   ? { bg: "#dbeafe", text: "#1d4ed8" } :
                                               { bg: "#f3e8ff", text: "#7e22ce" };
                return (
                  <button
                    key={cred.role}
                    onClick={() => fillCredentials(cred)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-200
                               hover:border-green-300 hover:bg-green-50 active:bg-green-100
                               transition-colors tap-target group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-700
                                      group-hover:text-green-700 truncate">
                          {cred.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{cred.email}</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: roleColor.bg, color: roleColor.text }}
                      >
                        {cred.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
