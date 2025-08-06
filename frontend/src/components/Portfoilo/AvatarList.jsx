import AvatarItem from "./AvatarItem";
import { useNavigate } from "react-router-dom";

function AvatarList({ avatars }) {
  const navigate = useNavigate();

  if (!avatars || avatars.length === 0) {
    return <p>No avatar found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-5">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          onClick={() => navigate(`/portfolio/${avatar.id}`)}
        >
          <AvatarItem avatar={avatar}></AvatarItem>
        </div>
      ))}
    </div>
  );
}

export default AvatarList;
