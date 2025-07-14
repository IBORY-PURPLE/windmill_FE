import { RouterProvider, createBrowserRouter } from "react-router-dom";

import EditEventPage from "./pages/EditEvent";
import ErrorPage from "./pages/Error";
import EventDetailPage, {
  loader as eventDetailLoader,
  action as deleteEventAction,
} from "./pages/EventDetail";
import EventsPage, { loader as eventsLoader } from "./pages/Events";
import EventsRootLayout from "./pages/EventsRoot";
import HomePage from "./pages/Home";
import NewEventPage from "./pages/NewEvent";
import RootLayout from "./pages/Root";

import { action as manipulateEventAction } from "./components/EventForm";
import { action as logoutAction } from "./pages/Logout";
import Authentication, { action as authAction } from "./pages/Authentication";
import NewsletterPage, { action as newsletterAction } from "./pages/Newsletter";

import { tokenLoader } from "./util/auth";
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
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
                action: deleteEventAction,
              },
              {
                path: "edit",
                element: <EditEventPage />,
                action: manipulateEventAction,
              },
            ],
          },
          {
            path: "new",
            element: <NewEventPage />,
            action: manipulateEventAction,
          },
        ],
      },
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
