import React, { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import "../../shared/styles/auth.css";
import Navbar from "../../shared/components/Navbar";

function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1); // 1: Form, 2: Verification
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loadingVerify, setLoadingVerify] = useState(false);
  
  const { register, loading, error } = useAuth();
  
  // Local error state for OTP step to avoid mixing with useAuth global error
  const [otpError, setOtpError] = useState("");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* -------- STEP 1: SUBMIT FORM -------- */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match"); return;
    }
    
    // Call register to create user (unverified) and trigger OTP email
    try {
        // useAuth's register calls apiService.register
        // Note: useAuth might try to auto-login. We need to check useAuth implementation.
        // If register throws because "verify" is not done, we catch it?
        // Actually, apiService.register just returns response.
        // Let's look at useAuth again. It usually sets user state.
        // BUT, if the user is not verified, they cant login.
        // So useAuth might fail to set user if it tries to fetch profile?
        // Wait, standard JWT flow: Register -> OK (201) -> ...
        // If backend returns token immediately on register (which some do), then we are logged in.
        // But here, backend says "OTP sent". It likely DOES NOT return a token yet.
        
        // We probably shouldn't use `useAuth.register` if it expects a token.
        // We should call `apiService.register` directly to handle this custom flow.
        
        // Let's use apiService directly for step 1 to avoid useAuth assuming automatic login.
        const apiService = require("../../shared/services/api").default;
        
        setLoadingVerify(true); // Re-using loading state var for this valid purpose
        await apiService.register({ ...formData, role: "user" });
        
        // If successful, backend sent email. Move to Step 2.
        setLoadingVerify(false);
        setStep(2);
        alert(`OTP sent to ${formData.email}. Please check your inbox.`);
        
    } catch (err) {
        setLoadingVerify(false);
        console.error("Registration init failed", err);
        // Display error (e.g. Email already exists)
        alert(err.message || "Registration failed");
    }
  };

  /* -------- STEP 2: VERIFY OTP -------- */
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return;
    
    try {
        setLoadingVerify(true);
        const apiService = require("../../shared/services/api").default;
        
        await apiService.verifyOTP(formData.email, enteredOtp);
        
        setLoadingVerify(false);
        alert(`Verification Successful!\nWelcome, ${formData.name}!`);
        window.location.href = "/login/user";

    } catch (err) {
        setLoadingVerify(false);
        setOtpError(err.message || "Invalid OTP. Please try again.");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h2>
            <p className="auth-subtitle">
              {step === 1 
                ? "Join CraftConnect to explore handcrafted goods." 
                : `Enter the 6-digit code sent to ${formData.email}`}
            </p>
          </div>

          {/* STEP 1: FORM */}
          {step === 1 && (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="auth-input-group">
                <label className="auth-label">Full Name *</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-label">Email Address *</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-label">Phone *</label>
                <input
                  className="auth-input"
                  type="tel"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              <div className="auth-row">
                <div className="auth-input-group">
                  <label className="auth-label">Password *</label>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Confirm *</label>
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && <div style={{ color: 'crimson', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

              <button
                className="auth-button"
                type="submit"
                disabled={loadingVerify} // Use local loading state
              >
                {loadingVerify ? "Sending OTP..." : "Continue"}
              </button>
              <div
                className="auth-link"
                onClick={() => (window.location.href = "/login/user")}
              >
                Already have an account? Sign In
              </div>
            </form>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 2 && (
            <form className="auth-form" onSubmit={handleVerifySubmit}>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
                {otp.map((digit, index) => (
                   <input
                       key={index}
                       type="text"
                       maxLength="1"
                       value={digit}
                       onChange={(e) => handleOtpChange(e.target, index)}
                       onFocus={(e) => e.target.select()}
                       style={{
                           width: "40px", height: "50px", fontSize: "20px", textAlign: "center",
                           borderRadius: "8px", border: "1px solid var(--secondary)",
                           background: "#fff", color: "var(--accent)", fontFamily: "'Playfair Display', serif"
                       }}
                   />
                ))}
              </div>
              
              {otpError && <div style={{ color: 'crimson', marginBottom: '16px', textAlign: 'center' }}>{otpError}</div>}

              <button
                className="auth-button"
                type="submit"
                disabled={loadingVerify || otp.join("").length !== 6}
              >
                {loadingVerify ? "Verifying..." : "Verify & Create Account"}
              </button>
               <div
                className="auth-link"
                onClick={() => setStep(1)}
                style={{ marginTop: "16px" }}
              >
                ← Back to details
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserRegister;
