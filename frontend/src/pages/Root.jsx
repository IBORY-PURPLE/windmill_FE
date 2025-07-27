import { Outlet } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import ScrollToTop from "../util/scrollToTop";
import MainLayout from "./Main";

function RootLayout() {
  return (
    <>
      <MainLayout>
        <ScrollToTop />
        <MainNavigation />
        <Outlet />
      </MainLayout>
    </>
  );
}

export default RootLayout;
