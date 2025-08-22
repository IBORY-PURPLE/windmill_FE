import PersonalNavigation from "../components/PersonalNavigation";
import { Outlet, useNavigation } from "react-router-dom";

function PersonalRoot() {
  const navigation = useNavigation();
  return (
    <>
      <PersonalNavigation />
      <main>
        {navigation.state === "loading" ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-xl font-semibold text-gray-600">Loading...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}

export default PersonalRoot;
