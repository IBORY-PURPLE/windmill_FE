import { NavLink, useLocation } from "react-router-dom";
import classes from "./PersonalNavigation.module.css";

function PersonalNavigation() {
  const location = useLocation();
  const basePath = "/personal";

  const query = new URLSearchParams(location.search);
  const currentFilter = query.get("filter") || "all";
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to={`${basePath}?filter=all`}
              className={({ isActive }) =>
                currentFilter === "all" ? classes.active : undefined
              }
              end
            >
              All stocks
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`${basePath}?filter=mystock`}
              className={({ isActive }) =>
                currentFilter === "mystock" ? classes.active : undefined
              }
            >
              Mystock
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`${basePath}?filter=interest`}
              className={({ isActive }) =>
                currentFilter === "interest" ? classes.active : undefined
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
