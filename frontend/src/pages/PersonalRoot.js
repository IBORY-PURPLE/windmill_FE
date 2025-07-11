import PersonalNavigation from "../components/PersonalNavigation";
import { Outlet } from "react-router-dom";
function PersonalRoot() {
  return (
    <>
      <PersonalNavigation></PersonalNavigation>
      <Outlet></Outlet>
    </>
  );
}

export default PersonalRoot;
