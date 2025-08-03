import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { tokenLoader } from "./util/auth";
import { fetchInterestStocks } from "./api/interest";
import { fetchAllStocks } from "./api/stocks";

import { useAuth } from "./context/AuthContext";

import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import Authentication, { action as authAction } from "./pages/Authentication";
import PersonalPage from "./pages/Personal";
import PersonalRoot from "./pages/PersonalRoot";
import StockDetailPage from "./pages/StockDetail";
import MyStockPage from "./pages/MyStock";
import InterestStockPage from "./pages/InterestStock";
import NewsPage from "./pages/NewsPage";

import PortfolioPage from "./pages/Portfolio/Portfolio";
import AvatarPage from "./pages/Portfolio/Avatar";
import SavePortfolioPage from "./pages/Portfolio/SavePortfolio";
import RecommendPortfolioPage from "./pages/Portfolio/RcommendPortfolio";

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
            children: [
              { index: true, element: <MyStockPage /> },
              {
                path: ":stockId",
                element: <StockDetailPage context="mystock" />,
              },
            ],
          },
          {
            path: "intereststock",
            children: [
              { index: true, element: <InterestStockPage /> },
              {
                path: ":stockId",
                element: <StockDetailPage context="interest" />,
              },
            ],
          },
        ],
      },
      {
        path: "portfolio",
        element: <PortfolioPage></PortfolioPage>,
        children: [
          {
            path: ":avatarId",
            element: <AvatarPage></AvatarPage>,
            children: [
              {
                index: true,
                element: <RecommendPortfolioPage></RecommendPortfolioPage>,
              },
              {
                path: "saveportfolio",
                element: <SavePortfolioPage></SavePortfolioPage>,
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
        path: "news",
        element: <NewsPage />,
      },
    ],
  },
]);

function App() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      queryClient.prefetchQuery({
        queryKey: ["interestStocks"],
        queryFn: fetchInterestStocks,
      });

      queryClient.prefetchQuery({
        queryKey: ["stocks"],
        queryFn: fetchAllStocks,
      });
    }
  }, [token, queryClient]);

  return <RouterProvider router={router} />;
}

export default App;
