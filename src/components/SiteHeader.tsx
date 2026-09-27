import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation, useNavigate } from "react-router";

const LINKS = [
  { to: "/catalog", label: "Catálogo" },
  { to: "/train", label: "Doomsday" },
  { to: "/music", label: "Música" },
];

export function SiteHeader() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-sm border font-mono text-[10px] leading-none text-[color:var(--brand)]">
            YT
          </span>
          <span className="font-mono text-sm tracking-tight">YuriTune</span>
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  "rounded px-2.5 py-1.5 font-mono text-xs transition-colors " +
                  (active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="font-mono text-xs">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sair
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
