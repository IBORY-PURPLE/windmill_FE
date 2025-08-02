import AvatarItem from "./AvatarItem";

function AvatarList({ avatars }) {
  if (!avatars || avatars.length === 0) {
    return <p>No avatar found.</p>;
  }
  return (
    <div>
      {avatars.map((avatar) => (
        <div key={avatar.avatarId} onClick={`/${avatar.avatarId}`}>
          <AvatarItem avatar={avatar}></AvatarItem>
        </div>
      ))}
    </div>
  );
}

export default AvatarList;
