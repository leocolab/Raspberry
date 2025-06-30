// src/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/* ---------- UI primitives ---------- */
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg font-medium bg-[#E30B5C] hover:bg-[#B1124D] text-white disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-2xl border shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-8 space-y-5 ${className}`}>{children}</div>
);

export default function Login() {
  /* ► form state */
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* ► modal state */
  const [showInfo, setShowInfo] = useState(true);

  /* ► auth */
  const { emailSignup: signup, emailLogin: login, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user, navigate]);

  const formReady = email && pass;

  const friendly = (code, fallback) =>
    code === "auth/email-already-in-use"
      ? "That email is already registered."
      : code === "auth/user-not-found"
      ? "No account with that email."
      : fallback;

  const handleSignup = async () => {
    if (!formReady) return setError("Please enter an email and password first.");
    setLoading(true); setError("");
    try { await signup(email, pass); navigate("/", { replace: true }); }
    catch (e) { setError("Signup failed: " + friendly(e.code, e.message)); }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!formReady) return setError("Please enter an email and password first.");
    setLoading(true); setError("");
    try { await login(email, pass); navigate("/", { replace: true }); }
    catch (e) { setError("Login failed: " + friendly(e.code, e.message)); }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true); setError("");
    try { await googleLogin(); navigate("/", { replace: true }); }
    catch (e) { setError("Google login failed: " + e.message); }
    setLoading(false);
  };

  return (
    <>
      {/* ---------- Info popup ---------- */}
      {showInfo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-[90%] max-w-md text-center space-y-6 border">
            <div className="flex items-center justify-center gap-2">  
              <h2 className="text-2xl font-bold">New to Raspberry AI? </h2>
              <img
                  src="/RB Logo.png"           /* <-- put the PNG/SVG in /public */
                  alt="Raspberry logo"
                  className="w-8 h-8 md:w-9 md:h-9"
                />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Beta notice:</strong> you get <strong>5 free chats</strong> to try the app.
              No credit card required. <br /><strong>Create an account below:</strong> <br />Type in an email, passowrd, then hit "Sign UP", or use&nbsp;Google.
            </p>
            <Button onClick={() => setShowInfo(false)} className="w-full">
              Try&nbsp;for&nbsp;free
            </Button>
          </div>
        </div>
      )}

      {/* ---------- Main form ---------- */}
      <div
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{ backgroundImage: "url('/RB Login Back.avif')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <div className="relative z-10 w-full max-w-md">
        <Card className="w-full max-w-md">
          <CardContent>

            {/* Title + logo */}
            <div className="flex items-center justify-center gap-2">
              <img
                src="/RB Logo.png"           /* <-- put the PNG/SVG in /public */
                alt="Raspberry logo"
                className="w-11 h-11 md:w-12 md:h-12"
              />
              <h1 className="text-3xl font-extrabold">Raspberry AI</h1>
            </div>
            <p className="text-center text-[#E30B5C] font-semibold mb-1">
              One prompt. <em>Any</em> model.
            </p>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Access GPT-4o, Gemini 1.5 Pro, Claude Sonnet &amp; more from one workspace.
            </p>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              New here? type an email &amp; password then click <strong>Sign&nbsp;Up</strong>.<br/>
              Returning user? enter the same credentials and click <strong>Log&nbsp;In</strong>.<br/>
              Or use <strong>Continue with Google</strong>.
            </p>

            {/* Inputs */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 ${
                error && !email ? "border-red-500" : ""
              }`}
            />
            <input
              type="password"
              placeholder="Make (or Enter an Existing) Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className={`w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 ${
                error && !pass ? "border-red-500" : ""
              }`}
            />

            {/* Error */}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {/* Email actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSignup} disabled={loading || !formReady} className="w-full">
                Sign&nbsp;Up
              </Button>
              <Button
                onClick={handleLogin}
                disabled={loading || !formReady}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Log&nbsp;In
              </Button>
            </div>

            {/* Google */}
            <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-white dark:text-gray-800"
          >
            {/* full Google G icon */}
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path d="M533.5 278.4c0-17.4-1.6-34.2-4.7-50.4H272v95.4h146.9c-6.4 34.5-25.1 63.4-53.5 82.7v68.5h86.4c50.3-46.4 81.7-115.3 81.7-196.2z" fill="#4285f4"/>
              <path d="M272 544.3c72.6 0 133.6-24 177-64.9l-86.4-68.5c-24.5 16.4-55.7 25.9-90.6 25.9-69.8 0-128.9-47.1-150.1-110.3H30.7v69.3C75.6 497.7 167 544.3 272 544.3z" fill="#34a853"/>
              <path d="M121.9 327.2c-10.1-30-10.1-62.8 0-92.8v-69.3H30.7C-8.3 216.4-8.3 327.9 30.7 420l91.2-69.8z" fill="#fbbc04"/>
              <path d="M272 107.7c39.4 0 74.9 13.5 103.1 39.9l77.2-77.1C404.1-6.6 343.7-24 272-24 167 24 75.6 70.6 30.7 162.8l91.2 69.3C143.1 154.8 202.2 107.7 272 107.7z" fill="#ea4335"/>
            </svg>

            <span className="font-medium text-sm text-black">
              Sign&nbsp;in&nbsp;with&nbsp;Google
            </span>
          </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}