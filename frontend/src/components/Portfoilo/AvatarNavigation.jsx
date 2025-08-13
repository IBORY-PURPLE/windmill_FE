import { NavLink, useParams } from "react-router-dom";
import { Home, Bookmark } from "lucide-react";

function AvatarNavigation() {
  return (
    <>
      {/* 데스크탑: 상단 탭 */}
      <nav className="hidden md:block sticky bottom-0 inset-x-0  z-40 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <ul className="flex">
            <Tab to="." label="Recommend" end />
            <Tab to="saveportfolio" label="Saved" />
          </ul>
        </div>
      </nav>

      {/* 모바일: 하단 바 */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t shadow-lg z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around">
          <BottomItem to="." label="Recommend" icon={Home} end />
          <BottomItem to="saveportfolio" label="Saved" icon={Bookmark} />
        </div>
      </nav>
    </>
  );
}

function Tab({ to, label, end }) {
  return (
    <li className="flex-1">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `block text-center py-3 font-medium transition-colors ${
            isActive
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500 hover:text-gray-800"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}

function BottomItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        `flex flex-col items-center py-2 flex-1 transition-colors ${
          isActive ? "text-red-600 font-semibold" : "text-gray-500"
        }`
      }
    >
      <Icon size={20} aria-hidden="true" />
      <span className="text-xs">{label}</span>
    </NavLink>
  );
}

export default AvatarNavigation;
