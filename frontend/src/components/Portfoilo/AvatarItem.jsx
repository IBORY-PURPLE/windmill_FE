function AvatarItem({ avatar }) {
  return (
    <div>
      <p>{avatar?.id}</p>
      <p>{avatar?.age}</p>
      <p>{avatar?.demage}</p>
    </div>
  );
}

export default AvatarItem;
