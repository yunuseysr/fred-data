import Link from "next/link";
import { categories, type IconKey } from "../lib/categories";

function TrendingUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function Activity() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function Users() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Percent() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function Globe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function Cart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

const ICONS: Record<IconKey, () => React.ReactNode> = {
  trending: TrendingUp,
  activity: Activity,
  users: Users,
  percent: Percent,
  globe: Globe,
  home: HomeIcon,
  cart: Cart,
};

function Chevron({ down }: { down?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={down ? "rotate-90" : ""}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-5 pb-4 pt-5">
        <h1 className="text-lg font-bold text-gray-900">FRED Indicators</h1>
        <p className="text-xs text-gray-500">Economic Data Dashboard</p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {categories.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = item.id === active;
          return (
            <Link
              key={item.id}
              href={`/?category=${item.id}`}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-md bg-[#2563eb] px-3 py-2 text-sm font-medium text-white"
                  : "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              }
            >
              <span className={isActive ? "text-white" : "text-gray-500"}>
                <Icon />
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              <span className={isActive ? "text-white" : "text-gray-400"}>
                <Chevron down={isActive} />
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-5 pt-6">
        <p className="text-xs leading-relaxed text-gray-400">
          Data provided by Federal Reserve Economic Data (FRED)
        </p>
      </div>
    </aside>
  );
}
