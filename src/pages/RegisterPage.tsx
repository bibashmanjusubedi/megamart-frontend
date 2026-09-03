import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Form states matching wireframes fields
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate form fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Policy before signing up");
      return;
    }

    // Dispatch authenticated user to Redux store
    dispatch(
      setUser({
        id: Date.now(),
        name: fullName.trim(),
        email: email.trim(),
        role: "Customer",
      }),
    );
    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Header />
      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div
          className="card shadow-sm border-0 p-4 p-md-5 bg-white"
          style={{ maxWidth: "440px", width: "100%" }}
        >
          {/* Card Header */}
          <div className="text-center mb-4">
            <h5 className="text-primary fw-bold mb-1">MegaMart</h5>
            <h4 className="fw-bold text-dark mb-1">Create your account</h4>
            <p className="text-muted small">Join us to start shopping today</p>
          </div>

          {/* Validation Feedback */}
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          {/* Validation Feedback */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label
                className="form-label small fw-semibold text-muted"
                htmlFor="registerName"
              >
                Full Name
              </label>
              <input
                id="registerName"
                type="text"
                className="form-control form-control-sm"
                value={fullName}
                placeholder="John Doe"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="mb-3">
              <label
                className="form-label small fw-semibold text-muted"
                htmlFor="registerEmail"
              >
                Email Address
              </label>
              <input
                id="registerEmail"
                type="email"
                className="form-control form-control-sm"
                value={email}
                placeholder="user@emample.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                className="form-label small fw-semibold text-muted"
                htmlFor="registerPassword"
              >
                Password
              </label>
              <input
                id="registerPassword"
                type="password"
                className="form-control form-control-sm"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted" htmlFor="registerConfirmPassword">Confirm Password</label>
              <input
                id="registerConfirmPassword"
                type="password"
                value={confirmPassword}
                className="form-control form-control-sm"
                placeholder="************"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Terms & Policy Checkbox */}
            <div className="form-check mb-3">
              <input
                id="termsCheck"
                type="checkbox"
                className="form-check-input"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />

              <label className="form-check-label small text-muted" htmlFor="termsCheck">
                I agree to the <a href="#" className="text-primary text-decoration-none">Terms & Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
                type="submit"
                className="btn btn-primary w-100 fw-semibold py-2 text-uppercase"
            >
                Sign Up
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="text-center mt-4 pt-3 border-top">
            <span className="small text-muted">Already have an accoount? </span>
            <Link
                to="/signin"
                className="small text-primary fw-semibold text-decoration-none"
            >
                Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
