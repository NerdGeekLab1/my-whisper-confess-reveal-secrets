import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; onClick?: () => void };

const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-4">
    <ol className="flex items-center flex-wrap gap-1 text-sm text-slate-400">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i} className="flex items-center gap-1">
            {i === 0 && <Home className="w-3.5 h-3.5 mr-1 opacity-70" />}
            {c.onClick && !last ? (
              <button onClick={c.onClick} className="hover:text-white transition-colors">
                {c.label}
              </button>
            ) : (
              <span className={last ? "text-white font-medium" : ""}>{c.label}</span>
            )}
            {!last && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
