import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearLoginError, USER_CREDENTIALS } from "../../store/slices/authSlice";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const dispatch = useDispatch();
  const { loginError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (loginError) dispatch(clearLoginError());
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    dispatch(login(form));
  };

  const fillCredentials = (cred) => {
    setForm({ email: cred.email, password: cred.password });
    setErrors({});
    dispatch(clearLoginError());
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f9fafb" }}>

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(160deg, #1E1E1E 0%, #2d2d2d 60%, #1a2e1a 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: "#22c55e", boxShadow: "0 0 16px rgba(34,197,94,0.4)" }}
          >
            HS
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">HSClogic</h1>
            <p className="text-xs" style={{ color: "#22c55e" }}>HR Management System</p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Streamline your<br />
            <span style={{ color: "#22c55e" }}>HR Operations</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Manage employees, track recruitment pipelines, and monitor attendance — all in one unified platform built for HSClogic.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { label: "Employee Management", desc: "Create, update and manage all employee records" },
              { label: "Recruitment Tracking", desc: "Track candidates through the full hiring pipeline" },
              { label: "Attendance Monitoring", desc: "Record check-ins, hours and attendance history" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(34,197,94,0.2)", border: "1px solid #22c55e" }}
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

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: "#22c55e" }}
            >
              HS
            </div>
            <div>
              <h1 className="font-bold text-gray-800">HSClogic HRMS</h1>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@hsclogic.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition
                    ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition
                    ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Server-side error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition"
              style={{ backgroundColor: "#22c55e" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#16a34a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#22c55e"}
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wide">
              Demo Credentials — click to fill
            </p>
            <div className="space-y-2">
              {USER_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => fillCredentials(cred)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-green-700">
                        {cred.name}
                      </p>
                      <p className="text-xs text-gray-400">{cred.email}</p>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: cred.role === "Admin"
                          ? "#dcfce7" : cred.role === "HR Staff"
                          ? "#dbeafe" : "#f3e8ff",
                        color: cred.role === "Admin"
                          ? "#15803d" : cred.role === "HR Staff"
                          ? "#1d4ed8" : "#7e22ce",
                      }}
                    >
                      {cred.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
