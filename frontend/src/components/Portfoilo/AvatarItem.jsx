function AvatarItem({ avatar }) {
  return (
    <div className="relative rounded-xl shadow-md border p-4 bg-white border-black transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10">
      <p>{avatar?.name}</p>
      <p>{avatar?.age}</p>
      <p>{avatar?.loss}</p>
    </div>
  );
}

export default AvatarItem;
