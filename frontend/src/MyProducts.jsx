import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function MyProducts() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    async function fetchProducts() {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/products/mine", {
          headers: { Authorization: "Bearer " + token },
        });
        if (!res.ok) throw new Error("Failed to load your products");
        setProducts(await res.json());
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProducts();
  }, [token, navigate]);

  async function handleDelete(id) {
    if (!confirm("Delete this app? This cannot be undone.")) return;
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/products/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Delete your account and ALL your apps? This cannot be undone.")) return;
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/account", {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed to delete account");
      logout();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (error) return <p>{error}</p>;
  if (!products) return <p>Loading...</p>;

  return (
    <div>
      <header className="dashboard-header"><h1>My Products</h1></header>
      <main className="dashboard-main">
        <p className="dashboard-count">
          Logged in as <span className="mono">{user?.email}</span> —{" "}
          <a href="#" onClick={handleLogout}>Log out</a> ·{" "}
          <a href="#" onClick={handleDeleteAccount} style={{ color: "#B3261E" }}>Delete account</a>
        </p>
        <a href="/" className="btn-primary" style={{ display: "inline-block", marginBottom: "24px", textDecoration: "none" }}>
          + Create new app
        </a>
        {products.length === 0 ? (
          <p className="dashboard-empty">You haven't created any products yet.</p>
        ) : (
          <table className="dashboard-table">
            <thead><tr><th>Name</th><th>Public page</th><th>Dashboard</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="title-case">{p.name}</td>
                  <td><a href={"/p/" + p.slug} target="_blank" rel="noopener noreferrer">View →</a></td>
                  <td><a href={"/dashboard/" + p.slug}>Open →</a></td>
                  <td><a href="#" onClick={() => handleDelete(p.id)} style={{ color: "#B3261E" }}>Delete</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default MyProducts;