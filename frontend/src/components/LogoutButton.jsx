import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const { setToken } = useAuth();

  const handleLogout = async () => {
    const res = await fetch(
      "https://windmill-be-iqxx.onrender.com/auth/logout",
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
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm transition duration-200"
    >
      <LogOut className="w-4 h-4 " />
      logout
    </button>
  );
}

export default LogoutButton;
