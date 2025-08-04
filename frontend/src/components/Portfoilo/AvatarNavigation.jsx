import { NavLink, useParams } from "react-router-dom";

function AvatarNavigation() {
  return (
    <nav className="fixed bottom-4  inset-x-0 px-4 z-50">
      <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl flex gap-10 justify-center">
        <NavLink
          to="."
          className={({ isActive }) =>
            `w-[140px] py-2 px-2 text-center py-4 rounded-md font-bold transition-colors duration-200 border border-black ${
              isActive
                ? "bg-[#C20E2F] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-[#C20E2F] hover:text-white"
            }`
          }
          end
        >
          Recommend
        </NavLink>
        <NavLink
          to="saveportfolio"
          className={({ isActive }) =>
            `w-[140px] py-2 px-2 text-center rounded-md py-4 font-bold transition-colors duration-200 border border-black ${
              isActive
                ? "bg-[#C20E2F] text-white"
                : "bg-white text-gray-800 hover:bg-[#C20E2F] hover:text-white"
            }`
          }
          end
        >
          Saved
        </NavLink>
      </div>
      {/* <ul className="flex gap-4 justify-around">
        <li>
          <NavLink
            to="."
            className={({ isActive }) =>
              `flex-1 text-center py-4 font-bold transition ${
                isActive
                  ? "border-b-2 border-[#C20E2F] pb-1 text-[#C20E2F]"
                  : "hover:underline"
              }`
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
              `flex-1 text-center py-4 font-bold transition ${
                isActive
                  ? "border-b-2 border-[#C20E2F] pb-1 text-[#C20E2F]"
                  : "hover:underline"
              }`
            }
            end
          >
            Saved
          </NavLink>
        </li>
      </ul> */}
    </nav>
  );
}

export default AvatarNavigation;
