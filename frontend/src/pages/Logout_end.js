import { redirect } from "react-router-dom";
import { getAuthToken } from "../util/auth";

export async function action() {
  const token = getAuthToken();
  console.log("logout token: ", token);
  const response = await fetch(
    "https://windmill-be-iqxx.onrender.com/auth/logout",
    {
      method: "post",
      credentials: "include",
    }
  );
  console.log(response.status);
  if (response.ok) {
    localStorage.removeItem("token");
    return redirect("/");
  }
}
