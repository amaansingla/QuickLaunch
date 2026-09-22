import { useNavigate } from "react-router-dom";

function EntryGate({ onContinue }) {
  const navigate = useNavigate();
  return (
    <div className="gate-overlay">
      <div className="gate-card">
        <h2>Welcome to QuickLaunch</h2>
        <p>Continue as a guest, or log in to manage your products.</p>
        <div className="gate-buttons">
          <button className="btn-primary" onClick={onContinue}>Continue as Guest</button>
          <button className="btn-generate" onClick={() => navigate("/login")}>Log in / Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default EntryGate;