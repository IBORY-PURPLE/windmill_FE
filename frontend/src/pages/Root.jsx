import { Outlet, useNavigation } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import ScrollToTop from "../util/scrollToTop";

function RootLayout() {
  const navigation = useNavigation();

  return (
    <>
      <ScrollToTop />
      <MainNavigation />
      <main>
        {navigation.state === "loading" ? <p>Loading...</p> : <Outlet />}
      </main>
    </>
  );
}

export default RootLayout;
