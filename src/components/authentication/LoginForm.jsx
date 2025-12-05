import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LoginForm = ({ registerPath, resetPath }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (token) {
      handleTokenStorage(token);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    }

    if (oauthError) {
      setError(oauthError);
    }
  }, []);

  const handleTokenStorage = (token) => {
    try {
      const payload = jwtDecode(token);
      const userData = { id: payload.id || 0, role: payload.role || "user" };
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", payload.role || "user");
    } catch (err) {
      console.error("Token decode error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
        setSuccess("Login successful!");

        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  return (
    <div className="w-100">
      <h2 className="fw-bold mb-2" style={{ fontSize: "clamp(22px, 4vw, 26px)" }}>
        Welcome Back
      </h2>

      <p className="text-muted mb-4" style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
        Login to continue to your dashboard
      </p>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-4">
          <label className="text-muted mb-1 fs-13">Username</label>
          <input
            type="text"
            name="username"
            className="form-control form-control-lg"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="mb-3">
          <label className="text-muted mb-1 fs-13">Password</label>
          <input
            type="password"
            name="password"
            className="form-control form-control-lg"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
          <label className="form-check-label d-flex align-items-center gap-2">
            <input type="checkbox" className="form-check-input" />
            <span className="fs-12">Remember Me</span>
          </label>

          <Link
            to={resetPath}
            className="text-primary fw-semibold"
            style={{ fontSize: "12px" }}
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 py-3"
            disabled={loading}
            style={{ fontWeight: "600", fontSize: "16px" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>

        
      </form>
    </div>
  );
};

export default LoginForm;
