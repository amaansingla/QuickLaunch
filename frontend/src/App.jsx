import { Routes, Route } from "react-router-dom";
import ProductForm from "./ProductForm";
import PublicPage from "./PublicPage";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <header className="console-header">
              <h1>QuickLaunch</h1>
            </header>
            <main className="console-main">
              <div className="hero">
                <h2>Turn your idea into an email waitlist page in minutes.</h2>
              </div>
              <ProductForm />
            </main>
          </div>
        }
      />
      <Route path="/p/:slug" element={<PublicPage />} />
      <Route path="/dashboard/:slug" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
