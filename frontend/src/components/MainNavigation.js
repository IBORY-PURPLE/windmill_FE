import { NavLink, Form, useRouteLoaderData } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import NewsletterSignup from "./NewsletterSignup";
import logoImg from "../assets/logo.png";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className={classes.header}>
      

      <nav>
        <div className={classes.upper}>
        <div className={classes.brand}>
        <img src={logoImg} alt="WindMill Logo" className={classes.logo} />
          <NavLink
              to="/"
              className={classes.title}
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
              <Form action="/logout" method="POST">
                <button>Logout</button>
              </Form>
            </li>
          )}
        </ul>
      </nav>

  
    </header>
  );
}

export default MainNavigation;
