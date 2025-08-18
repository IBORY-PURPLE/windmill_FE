import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const { setToken } = useAuth();

  const handleLogout = async () => {
    const res = await fetch(
      "https://windmill-be-5qid.onrender.com/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (res.ok) {
      localStorage.removeItem("token");
      setToken(null);
      window.location.href = "/";
    } else {
      alert("로그아웃 실패");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-2 px-4 py-2 rounded-lg font-medium text-white bg-[#C20E2F] hover:bg-red-700 transition-colors duration-200 flex items-center"
    ><span className="mr-2">🔑</span>
      로그아웃
    </button>
  );
}

export default LogoutButton;
