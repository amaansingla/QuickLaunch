import { useAuth } from "./AuthContext";

function SiteHeader({ title }) {
  const { token } = useAuth();

  return (
    <header className="console-header">
      <h1>
        <a href="/" style={{ color: "inherit", textDecoration: "none" }}>QuickLaunch</a>
      </h1>
      {title ? <p className="site-header-subtitle">{title}</p> : null}
      <nav className="site-header-nav">
        <a href="/" style={{ color: "inherit" }}>Home</a>
        {" · "}
        {token ? (
          <a href="/dashboard" style={{ color: "inherit" }}>My Products</a>
        ) : (
          <a href="/login" style={{ color: "inherit" }}>Log in</a>
        )}
      </nav>
    </header>
  );
}

export default SiteHeader;
