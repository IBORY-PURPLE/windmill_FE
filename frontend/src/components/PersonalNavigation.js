import { NavLink } from "react-router-dom";
import classes from "./PersonalNavigation.module.css";

function PersonalNavigation() {
  // const location = useLocation();
  // const basePath = "/personal";

  // const query = new URLSearchParams(location.search);
  // const currentFilter = query.get("filter") || "all";
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/personal/stock"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              All stocks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/personal/mystock"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Mystock
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/personal/intereststock"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Interest Stock
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default PersonalNavigation;
