import { useState } from "react";
import PagePreview from "./PagePreview";
import { useAuth } from "./AuthContext";

function ProductForm() {
  const { token } = useAuth();
  const [idea, setIdea] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [bullet1, setBullet1] = useState("");
  const [bullet2, setBullet2] = useState("");
  const [bullet3, setBullet3] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (!idea.trim()) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setName(data.name || "");
      setOneLiner(data.oneLiner || "");
      setBullet1(data.bullets?.[0] || "");
      setBullet2(data.bullets?.[1] || "");
      setBullet3(data.bullets?.[2] || "");
    } catch (err) {
      setGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: name,
          oneLiner: oneLiner,
          bullets: [bullet1, bullet2, bullet3],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="editor-layout">
      <div className="editor-form-panel">
        <div className="generate-box">
          <label>Have an idea? Let AI fill in the rest</label>
          <div className="generate-row">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. an app for tracking gym progress"
            />
            <button
              type="button"
              className="btn-generate"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? "Generating..." : name ? "Regenerate" : "Generate"}
            </button>
          </div>
          {generateError ? (
            <p className="generate-error">{generateError}</p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Product name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. QuickLaunch"
            />
          </div>
          <div className="field">
            <label>One-liner</label>
            <input
              type="text"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder="e.g. Launch a waitlist page in 5 minutes"
            />
          </div>
          <div className="field">
            <label>Feature 1</label>
            <input
              type="text"
              value={bullet1}
              onChange={(e) => setBullet1(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Feature 2</label>
            <input
              type="text"
              value={bullet2}
              onChange={(e) => setBullet2(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Feature 3</label>
            <input
              type="text"
              value={bullet3}
              onChange={(e) => setBullet3(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Create page
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}

        {result ? (
          <p className="form-success">
            Page created!{" "}
            <a
              href={"/p/" + result.slug}
              target="_blank"
              rel="noopener noreferrer"
            >
              View your page →
            </a>
            {" · "}
            <a href={"/dashboard/" + result.slug}>Go to admin dashboard →</a>
          </p>
        ) : null}
      </div>

      <div className="editor-preview-panel">
        <PagePreview
          name={name}
          oneLiner={oneLiner}
          bullets={[bullet1, bullet2, bullet3]}
        />
      </div>
    </div>
  );
}

export default ProductForm;
