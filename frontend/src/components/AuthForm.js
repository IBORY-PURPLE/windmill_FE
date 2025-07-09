import { useEffect } from "react";
import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  // useNavigate,
  useNavigation,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  // const [isLogin, setIsLogin] = useState(true);

  // function switchAuthHandler() {
  //   setIsLogin((isCurrentlyLogin) => !isCurrentlyLogin);
  // }
  const data = useActionData();
  const navigation = useNavigation();

  // searchParams는 객체 ?키=값,키=값 이렇게
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  // 3. 받은 message가 signup-success라면 isSignup메세지 출력하고 아니라면 폼 데이터를 그대로 출력하고싶어.
  const message = searchParams.get("message");
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (message === "signup-success") {
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/auth?mode=login";
    }
  }, [message]);

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {data && data.message && <p>{data.message}</p>}
        {!isLogin && (
          <p>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" name="userName" required />
          </p>
        )}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          {/* <button onClick={switchAuthHandler} type="button">
            {isLogin ? 'Create new user' : 'Login'}
          </button> */}
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
