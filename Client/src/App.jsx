import { useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.scss";
import BACKLYLogo from "./assets/BACKLY.webp";
import ToolLibrary from "./pages/ToolLibrary.jsx";
import ToolPage from "./pages/ToolPage.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import RedirectHandler from "./components/RedirectHandler.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const tools = [
  {
    id: "url-shortner",
    name: "URL Shortner",
    description: "Create a short, shareable link for any destination URL.",
    icon: "↗",
    tag: "Utility",
  },
  {
    id: "pastebin",
    name: "Pastebin",
    description: "Store and share text snippets with a simple link.",
    icon: "⌘",
    tag: "Utility",
  },
  {
    id: "qr",
    name: "QR",
    description: "Generate a QR code for URLs or text.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.5249 2H16.5932C17.477 1.99999 18.1897 1.99999 18.7635 2.05454C19.3552 2.1108 19.8707 2.22996 20.3343 2.51405C20.8037 2.80168 21.1983 3.19632 21.486 3.6657C21.77 4.12929 21.8892 4.64482 21.9455 5.23653C22 5.8103 22 6.52304 22 7.40683V7.47517C22 8.05587 22 8.54048 21.9626 8.9341C21.9235 9.34559 21.8386 9.72907 21.623 10.0808C21.4121 10.425 21.1227 10.7144 20.7785 10.9254C20.4267 11.1409 20.0433 11.2258 19.6318 11.2649C19.2382 11.3024 18.7535 11.3023 18.1728 11.3023L17.0679 11.3023C16.2321 11.3024 15.5352 11.3024 14.9819 11.228C14.3979 11.1495 13.8706 10.9768 13.4469 10.5531C13.0232 10.1294 12.8505 9.60212 12.772 9.01812C12.6976 8.46484 12.6976 7.76789 12.6977 6.93209L12.6977 5.82725C12.6977 5.24654 12.6976 4.76185 12.7351 4.36823C12.7742 3.95674 12.8591 3.57325 13.0746 3.22152C13.2856 2.87731 13.575 2.5879 13.9192 2.37697C14.2709 2.16142 14.6544 2.07653 15.0659 2.0374C15.4595 1.99998 15.9442 1.99999 16.5249 2ZM17.3488 7.81395C16.8694 7.81395 16.6297 7.81395 16.4604 7.69385C16.4007 7.65148 16.3485 7.59933 16.3061 7.5396C16.186 7.37034 16.186 7.13061 16.186 6.65117C16.186 6.17173 16.186 5.93199 16.3061 5.76273C16.3485 5.703 16.4007 5.65085 16.4604 5.60847C16.6297 5.48837 16.8694 5.48837 17.3488 5.48837C17.8283 5.48837 18.068 5.48837 18.2373 5.60847C18.297 5.65085 18.3491 5.703 18.3915 5.76273C18.5116 5.93199 18.5116 6.17171 18.5116 6.65116C18.5116 7.13061 18.5116 7.37034 18.3915 7.5396C18.3491 7.59933 18.297 7.65148 18.2373 7.69385C18.068 7.81395 17.8283 7.81395 17.3488 7.81395Z"
            fill="#c4b5fd"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0808 2.37697C9.72907 2.16142 9.34559 2.07653 8.9341 2.0374C8.54047 1.99998 8.05583 1.99999 7.4751 2H7.40684C6.52307 1.99999 5.81029 1.99999 5.23653 2.05454C4.64482 2.1108 4.12929 2.22996 3.6657 2.51405C3.19632 2.80168 2.80168 3.19632 2.51405 3.6657C2.22996 4.12929 2.1108 4.64482 2.05454 5.23653C1.99999 5.81029 1.99999 6.52302 2 7.40679V7.47506C1.99999 8.05579 1.99998 8.54047 2.0374 8.9341C2.07653 9.34559 2.16142 9.72907 2.37697 10.0808C2.5879 10.425 2.87731 10.7144 3.22152 10.9254C3.57325 11.1409 3.95674 11.2258 4.36823 11.2649C4.76183 11.3024 5.24643 11.3023 5.82711 11.3023L6.93209 11.3023C7.76787 11.3024 8.46484 11.3024 9.01812 11.228C9.60212 11.1495 10.1294 10.9768 10.5531 10.5531C10.9768 10.1294 11.1495 9.60212 11.228 9.01812C11.3024 8.46484 11.3024 7.7679 11.3023 6.93212L11.3023 5.82726C11.3023 5.24658 11.3024 4.76183 11.2649 4.36823C11.2258 3.95674 11.1409 3.57325 10.9254 3.22152C10.7144 2.87731 10.425 2.5879 10.0808 2.37697ZM5.76273 7.69385C5.93199 7.81395 6.17171 7.81395 6.65116 7.81395C7.13061 7.81395 7.37034 7.81395 7.5396 7.69385C7.59933 7.65148 7.65148 7.59933 7.69385 7.5396C7.81395 7.37034 7.81395 7.13061 7.81395 6.65116C7.81395 6.17171 7.81395 5.93199 7.69385 5.76273C7.65148 5.703 7.59933 5.65085 7.5396 5.60847C7.37034 5.48837 7.13061 5.48837 6.65116 5.48837C6.17171 5.48837 5.93199 5.48837 5.76273 5.60847C5.703 5.65085 5.65085 5.703 5.60847 5.76273C5.48837 5.93199 5.48837 6.17171 5.48837 6.65116C5.48837 7.13061 5.48837 7.37034 5.60847 7.5396C5.65085 7.59933 5.703 7.65148 5.76273 7.69385Z"
            fill="#c4b5fd"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.01812 12.772C9.60212 12.8505 10.1294 13.0232 10.5531 13.4469C10.9768 13.8706 11.1495 14.3979 11.228 14.9819C11.3024 15.5352 11.3024 16.2321 11.3023 17.0679L11.3023 18.1728C11.3023 18.7535 11.3024 19.2382 11.2649 19.6318C11.2258 20.0433 11.1409 20.4267 10.9254 20.7785C10.7144 21.1227 10.425 21.4121 10.0808 21.623C9.72907 21.8386 9.34559 21.9235 8.9341 21.9626C8.54048 22 8.05577 22 7.47507 22H7.40683C6.52304 22 5.8103 22 5.23653 21.9455C4.64482 21.8892 4.12929 21.77 3.6657 21.486C3.19632 21.1983 2.80168 20.8037 2.51405 20.3343C2.22996 19.8707 2.1108 19.3552 2.05454 18.7635C1.99999 18.1897 1.99999 17.477 2 16.5932V16.5249C1.99999 15.9442 1.99998 15.4595 2.0374 15.0659C2.07653 14.6544 2.16142 14.2709 2.37697 13.9192C2.5879 13.575 2.87731 13.2856 3.22152 13.0746C3.57325 12.8591 3.95674 12.7742 4.36823 12.7351C4.76184 12.6976 5.24648 12.6977 5.82717 12.6977L6.93209 12.6977C7.76789 12.6976 8.46484 12.6976 9.01812 12.772ZM6.65116 18.5116C6.17171 18.5116 5.93199 18.5116 5.76273 18.3915C5.703 18.3491 5.65085 18.297 5.60847 18.2373C5.48837 18.068 5.48837 17.8283 5.48837 17.3488C5.48837 16.8694 5.48837 16.6297 5.60847 16.4604C5.65085 16.4007 5.703 16.3485 5.76273 16.3061C5.93199 16.186 6.17171 16.186 6.65115 16.186C7.13059 16.186 7.37034 16.186 7.5396 16.3061C7.59933 16.3485 7.65148 16.4007 7.69385 16.4604C7.81395 16.6297 7.81395 16.8694 7.81395 17.3488C7.81395 17.8283 7.81395 18.068 7.69385 18.2373C7.65148 18.297 7.59933 18.3491 7.5396 18.3915C7.37034 18.5116 7.13061 18.5116 6.65116 18.5116Z"
            fill="#c4b5fd"
          />
          <path
            d="M12.6977 16.6155V16.6512H14.093C14.093 15.9834 14.0939 15.5351 14.1286 15.1933C14.1622 14.8632 14.2216 14.7107 14.289 14.6098C14.3738 14.4828 14.4828 14.3738 14.6098 14.289C14.7107 14.2216 14.8632 14.1622 15.1933 14.1286C15.5351 14.0939 15.9834 14.093 16.6512 14.093H18.5116V12.6977H16.6155C15.9926 12.6977 15.4729 12.6976 15.0521 12.7404C14.6117 12.7853 14.203 12.8827 13.8346 13.1288C13.5553 13.3154 13.3154 13.5553 13.1288 13.8346C12.8827 14.203 12.7853 14.6117 12.7404 15.0521C12.6976 15.4729 12.6977 15.9926 12.6977 16.6155Z"
            fill="#c4b5fd"
          />
          <path
            d="M22 18.5351V18.5116H20.6046C20.6046 18.9546 20.6043 19.2519 20.5886 19.4821C20.5733 19.706 20.5459 19.8151 20.5161 19.8868C20.3981 20.1718 20.1718 20.3981 19.8868 20.5161C19.8151 20.5459 19.706 20.5733 19.4821 20.5886C19.2519 20.6043 18.9546 20.6046 18.5116 20.6046H16.6512V22H18.5351C18.9486 22 19.2937 22 19.5771 21.9807C19.8721 21.9606 20.1507 21.9172 20.4208 21.8053C21.0476 21.5456 21.5456 21.0476 21.8053 20.4208C21.9172 20.1507 21.9606 19.8721 21.9807 19.5771C22 19.2937 22 18.9486 22 18.5351Z"
            fill="#c4b5fd"
          />
          <path
            d="M14.093 21.3023C14.093 21.6876 13.7807 22 13.3953 22C13.01 22 12.6977 21.6876 12.6977 21.3023V18.5116H14.093V21.3023Z"
            fill="#c4b5fd"
          />
          <path
            d="M21.3023 12.6977C20.917 12.6977 20.6046 13.01 20.6046 13.3953V16.6512H22V13.3953C22 13.01 21.6876 12.6977 21.3023 12.6977Z"
            fill="#c4b5fd"
          />
          <path
            d="M16.0761 16.6173C16 16.8011 16 17.0341 16 17.5C16 17.9659 16 18.1989 16.0761 18.3827C16.1776 18.6277 16.3723 18.8224 16.6173 18.9239C16.8011 19 17.0341 19 17.5 19C17.9659 19 18.1989 19 18.3827 18.9239C18.6277 18.8224 18.8224 18.6277 18.9239 18.3827C19 18.1989 19 17.9659 19 17.5C19 17.0341 19 16.8011 18.9239 16.6173C18.8224 16.3723 16.1776 16.3723 16.0761 16.6173Z"
            fill="#c4b5fd"
          />
        </g>
      </svg>
    ),
    tag: "Utility",
  },
  {
    id: "file-sharing",
    name: "File Sharing",
    description: "Upload files and share them quickly.",
    icon: (
      <svg
        viewBox="-2 2 29 20"
        aria-hidden="true"
        focusable="false"
        fill="currentColor"
      >
        <path d="M4 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      </svg>
    ),
    tag: "Utility",
  },
  {
    id: "authkit",
    name: "Authkit",
    description: "Handle authentication flows for your app.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 2C11.7614 2 14 4.23858 14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7C4 4.23858 6.23858 2 9 2ZM9 4.6C10.3255 4.6 11.4 5.67452 11.4 7C11.4 8.32548 10.3255 9.4 9 9.4C7.67452 9.4 6.6 8.32548 6.6 7C6.6 5.67452 7.67452 4.6 9 4.6ZM6.5 11.5L11.5 11.5L11.5 14L13.75 14L13.75 16L11.5 16L11.5 18L13.75 18L13.75 20L11.5 20L11.5 21L6.5 21Z"
          fill="#c4b5fd"
        />
      </svg>
    ),
    tag: "Auth",
  },
];

function ToolIcon({ children }) {
  return (
    <span className="tool-icon" aria-hidden="true">
      {children}
    </span>
  );
}


function AppLayout({
  children,
  handleLogout,
  isLoggingOut,
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand brand-link" to="/home">
          <span className="brand-mark">
            <img src={BACKLYLogo} alt="BACKLY logo" />
          </span>
          <span>BACKLY</span>
        </NavLink>

        <nav className="sidebar-nav" aria-label="Tools navigation">
          <NavLink
            className={({ isActive }) =>
              `nav-item ${isActive ? "is-active" : ""}`
            }
            to="/home"
            end
          >
            <ToolIcon>⌂</ToolIcon>
            <span>Home</span>
          </NavLink>
          <p className="nav-label">TOOLS</p>
          {tools.map((tool) => (
            <NavLink
              className={({ isActive }) =>
                `nav-item ${isActive ? "is-active" : ""}`
              }
              key={tool.id}
              to={`/tool/${tool.id}`}
            >
              <ToolIcon>{tool.icon}</ToolIcon>
              <span>{tool.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span>
            Made with efforts by <strong>Nayan Patel</strong>💜
          </span>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">DEVELOPER WORKSPACE</p>
            <h1>Backend Training :)</h1>
          </div>

          <button
            className="signup-link logout-button"
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </button>
        </header>

        <main className="main-content">{children}</main>

        <footer>© 2026 BACKLY. All Rights Reserved.</footer>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Clear the local session view even if an expired server session rejects logout.
    } finally {
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const currentToolId = location.pathname.startsWith("/tool/")
    ? location.pathname.replace("/tool/", "").split("/")[0]
    : null;
  const toolExists = currentToolId
    ? tools.some((tool) => tool.id === currentToolId)
    : true;

  function ToolPageRoute() {
    if (!toolExists) {
      return <Navigate to="/home" replace />;
    }
    return <ToolPage tools={tools} />;
  }

  return (
    <Routes location={location}>
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayout
              handleLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            >
              <ToolLibrary tools={tools} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tool/:toolId"
        element={
          <ProtectedRoute>
            <AppLayout
              handleLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            >
              <ToolPageRoute />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/home" replace />
          </ProtectedRoute>
        }
      />
      <Route path="/r/:shortCode" element={<RedirectHandler />} />
      <Route path="/s/:shortCode" element={<RedirectHandler />} />
      <Route path="/:shortCode" element={<RedirectHandler />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
