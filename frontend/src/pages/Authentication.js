import { redirect, json } from "react-router-dom";

import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw new Response(JSON.stringify({ message: "Unsupported mode" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
    username: data.get("userName"),
  };

  const response = await fetch(
    "https://windmill-be-iqxx.onrender.com/auth/" + mode,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    }
  );

  // authform에서 useActionData 훅으로 오류를 폼 안에서 생성.
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (response.status === 404) {
    throw json(
      { message: "OOOOOOOOOOOOOOOOOOOO" },
      {
        status: 400,
        statusText: "Could not register",
      }
    );
  }

  if (!response.ok) {
    throw new Response(null, {
      status: 500,
      statusText: "Could not authenticate user.",
    });
  }

  const resData = await response.json();
  const token = resData.data.access_token;

  localStorage.setItem("token", token);

  return redirect("/");
}
