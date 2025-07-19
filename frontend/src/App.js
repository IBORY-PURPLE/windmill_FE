import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { tokenLoader } from "./util/auth";
import { StockProvider } from "./context/StockContext";

import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";

import { action as logoutAction } from "./pages/Logout";
import Authentication, { action as authAction } from "./pages/Authentication";

import NewsletterPage, { action as newsletterAction } from "./pages/Newsletter";

import PersonalPage from "./pages/PersonalPage";
import PersonalRoot, { loader as allStockLoader } from "./pages/PersonalRoot";

import AllStockPage from "./pages/AllStock";
import StockDetailPage from "./pages/StockDetail";
import MyStock from "./pages/MyStock";
import InterestStock from "./pages/InterestStock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "personal",
        element: <PersonalRoot></PersonalRoot>,
        id: "allstock",
        loader: allStockLoader,
        children: [
          {
            index: true,
            element: <PersonalPage></PersonalPage>,
          },
          {
            path: "stock",
            children: [
              { index: true, element: <AllStockPage /> },
              {
                path: ":stockId",
                element: <StockDetailPage context="all" />,
              },
            ],
          },
          {
            path: "mystock",
            children: [
              { index: true, element: <MyStock /> },
              {
                path: ":stockId",
                element: <StockDetailPage context="mystock" />,
              },
            ],
          },
          {
            path: "intereststock",
            children: [
              { index: true, element: <InterestStock /> },
              {
                path: ":stockId",
                element: <StockDetailPage context="interest" />,
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: <Authentication></Authentication>,
        action: authAction,
      },
      {
        path: "newsletter",
        element: <NewsletterPage />,
        action: newsletterAction,
      },
      {
        path: "logout",
        action: logoutAction,
        element: <></>,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <StockProvider>
        <RouterProvider router={router} />
      </StockProvider>
    </>
  );
}

export default App;
