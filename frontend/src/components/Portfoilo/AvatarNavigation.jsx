import { NavLink } from "react-router-dom";

function AvatarNavigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="."
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[#C20E2F] pb-1 text-[#C20E2F]"
                : "hover:underline"
            }
            end
          >
            Recommend
          </NavLink>
        </li>
        <li>
          <NavLink
            to="saveportfolio"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[#C20E2F] pb-1 text-[#C20E2F]"
                : "hover:underline"
            }
            end
          >
            Saved
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AvatarNavigation;
