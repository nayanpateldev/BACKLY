import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

const RESERVED_ROUTES = new Set(["login", "signup", "home", "tool"]);

export default function RedirectHandler() {
  const { shortCode } = useParams();

  useEffect(() => {
    if (!shortCode || RESERVED_ROUTES.has(shortCode.toLowerCase())) {
      return;
    }

    const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
    const targetUrl = `${apiBase}/${shortCode}`;
    
    // Perform full window redirect so backend Express 302 redirect is followed by the browser
    window.location.replace(targetUrl);
  }, [shortCode]);

  if (RESERVED_ROUTES.has(shortCode?.toLowerCase())) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#09090b",
        color: "#a1a1aa",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
      }}
    >
      <span>Redirecting...</span>
    </div>
  );
}
