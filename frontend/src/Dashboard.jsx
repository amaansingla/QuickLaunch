import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

function Dashboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSignups() {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/products/" + slug + "/signups");
        if (!res.ok) throw new Error("Could not load signups");
        setData(await res.json());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchSignups();
  }, [slug]);

  function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet(
      data.signups.map((s) => ({ Email: s.email, "Signed up": new Date(s.created_at).toLocaleString() }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Signups");
    XLSX.writeFile(wb, slug + "-signups.xlsx");
  }

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Dashboard for <span className="mono">{slug}</span></h1>
      </header>
      <main className="dashboard-main">
        <p className="dashboard-count">Total signups: <strong>{data.count}</strong></p>
        {data.count > 0 && (
          <button className="btn-primary" onClick={downloadExcel} style={{ marginBottom: "20px" }}>
            Download as Excel
          </button>
        )}
        {data.count === 0 ? (
          <p className="dashboard-empty">No signups yet.</p>
        ) : (
          <table className="dashboard-table">
            <thead><tr><th>Email</th><th>Signed up</th></tr></thead>
            <tbody>
              {data.signups.map((s, i) => (
                <tr key={i}>
                  <td className="mono">{s.email}</td>
                  <td className="mono">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Dashboard;