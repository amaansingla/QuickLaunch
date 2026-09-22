import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProductForm from "./ProductForm";
import PublicPage from "./PublicPage";
import Dashboard from "./Dashboard";
import MyProducts from "./MyProducts";
import Signup from "./Signup";
import Login from "./Login";
import EntryGate from "./EntryGate";
import { useAuth } from "./AuthContext";

function Home() {
  const { token } = useAuth();
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem("entered") === "true",
  );

  function handleGuestContinue() {
    sessionStorage.setItem("entered", "true");
    setEntered(true);
  }

  return (
    <div>
      <header className="console-header">
        <h1>QuickLaunch</h1>
        {token ? (
          <a
            href="/dashboard"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            My Products
          </a>
        ) : (
          <a href="/login" style={{ color: "inherit" }}>
            Log in
          </a>
        )}
      </header>
      <main className="console-main">
        <div className="hero">
          <h2>Turn your idea into a waitlist page in minutes.</h2>
          <p>
            Describe what you're building — QuickLaunch generates a name,
            tagline, and feature list, then creates a shareable page where
            people can sign up to hear when you launch.
          </p>
        </div>
        <ProductForm />
      </main>
      {!entered && !token && <EntryGate onContinue={handleGuestContinue} />}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/p/:slug" element={<PublicPage />} />
      <Route path="/dashboard" element={<MyProducts />} />
      <Route path="/dashboard/:slug" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
