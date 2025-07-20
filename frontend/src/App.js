import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { tokenLoader } from "./util/auth";
import { StockProvider } from "./context/StockContext";

import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";

import Authentication, { action as authAction } from "./pages/Authentication";

import NewsletterPage, { action as newsletterAction } from "./pages/Newsletter";

import PersonalPage from "./pages/PersonalPage";
import PersonalRoot from "./pages/PersonalRoot";

import StockDetailPage from "./pages/StockDetail";
import MyStock from "./pages/MyStock";
import { loader as myStockLoader } from "./pages/MyStock";

import InterestStock from "./pages/InterestStock";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "stocks/:stockId",
        element: <StockDetailPage context="Home" />,
      },
      {
        path: "personal",
        element: <PersonalRoot></PersonalRoot>,
        children: [
          {
            index: true,
            element: <PersonalPage></PersonalPage>,
          },
          {
            path: "mystock",
            id: "mystock",
            loader: myStockLoader,
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
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <StockProvider>
          <RouterProvider router={router} />
        </StockProvider>
      </AuthProvider>
    </>
  );
}

export default App;
