import React, { useState } from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useAuth } from "./contexts/AuthContext";
import { getAuth } from "firebase/auth";          // ← NEW

/* ---------- UI Primitives ---------- */
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg font-medium bg-[#E30B5C] hover:bg-[#B1124D] text-white disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-2xl border shadow ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-8 ${className}`}>{children}</div>
);

const Select = ({ value, onChange, children, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`border rounded-md px-3 py-2 bg-white dark:bg-gray-800 ${className}`}
  >
    {children}
  </select>
);

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

/* ---------- Auth Header ---------- */
function Header() {
  const { user, logout, loading } = useAuth();

  if (loading) return null; // avoid flicker while auth resolves

  return (
    <header className="w-full flex justify-end p-4 fixed top-0 left-0 z-20">
      {user && (
        <button
          onClick={logout}
          className="text-sm font-medium text-white underline hover:text-gray-200"
        >
          Sign&nbsp;out
        </button>
      )}
    </header>
  );
}

/* ---------- Sections ---------- */
function WelcomeSection() {
  return (
    <section id="welcome" className="relative h-screen w-full overflow-hidden">
      <Parallax speed={-190} className="absolute inset-0 -z-10">
        <img
          src="/raspberrypic.webp"
          alt="Raspberrry Hero Background"
          className="object-cover w-full h-full"
        />
      </Parallax>
      <div className="relative flex flex-col items-center justify-center h-full bg-black/40">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Raspberrry
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-white opacity-90">
          One prompt. <em>Any</em> model.
        </p>
        <Button
          className="mt-10"
          onClick={() =>
            document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Start Chatting
        </Button>
      </div>
    </section>
  );
}

function ChatSection() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("openai");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- UPDATED send() ---------- */
  const send = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const user = getAuth().currentUser;
      if (!user) {
        setAnswer("Please log in first.");
        setLoading(false);
        return;
      }

      const API_BASE = import.meta.env.VITE_API_BASE || "";
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ provider: model, prompt }),
      });

      if (res.status === 429) {
        setAnswer("You’ve used all 5 free prompts. Upgrade coming soon!");
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer ?? "");
      } else {
        setAnswer(data.detail ?? "Server error");
      }
    } catch {
      setAnswer("Error contacting server. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="chat"
      className="min-h-screen flex flex-col items-center justify-start pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <h2 className="text-4xl font-semibold mb-8">Chat Playground</h2>
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="space-y-6">
          <textarea
            className="w-full border rounded-lg p-4 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] dark:bg-gray-800 dark:border-gray-700"
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Select value={model} onChange={setModel}>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
            </Select>
            <Button onClick={send} disabled={loading} className="w-full md:w-auto">
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </div>
          {answer && (
            <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
              {answer}
            </pre>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

/* ---------- App ---------- */
export default function App() {
  return (
    <ParallaxProvider>
      <div className="font-sans antialiased text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <Header />
        <WelcomeSection />
        <ChatSection />
      </div>
    </ParallaxProvider>
  );
}
