import { NavLink, useRouteLoaderData } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import NewsletterSignup from "./NewsletterSignup";
import LogoutButton from "./LogoutButton";

import logoImg from "../assets/logo.png";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className="sticky top-0 z-50  shadow bg-[#004e96] max-w-5xl mx-auto p-4">
      <nav>
        <div className={classes.upper}>
          <div className={classes.brand}>
            <img src={logoImg} alt="WindMill Logo" className={classes.logo} />
            <NavLink
              to="/"
              className={classes.title}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              WindMill
            </NavLink>
          </div>
          <NewsletterSignup />
        </div>
        <hr className={classes.divider} />
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Stock
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/newsletter"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              News
            </NavLink>
          </li>
          {!token && (
            <li>
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                end
              >
                Authentication
              </NavLink>
            </li>
          )}
          {token && (
            <li>
              <NavLink
                to="/personal"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                end
              >
                PersonalPage
              </NavLink>
            </li>
          )}
          {token && (
            <li>
              <LogoutButton></LogoutButton>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
