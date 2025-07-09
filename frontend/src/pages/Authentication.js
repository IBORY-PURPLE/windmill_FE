import { redirect } from "react-router-dom";

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
    userName: data.get("userName"),
  };

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  // authform에서 useActionData 훅으로 오류를 폼 안에서 생성.
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  // Response객체는 심각한 오류객체로 errorpage에서 따로 표시할 것이다.
  if (!response.ok) {
    throw new Response(null, {
      status: 500,
      statusText: "Could not authenticate user.",
    });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  return redirect("/");
}
