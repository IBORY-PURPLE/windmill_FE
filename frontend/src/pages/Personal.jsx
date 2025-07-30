function PersonalPage() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div
          className="h-64 rounded-xl shadow-md border p-4 text-white
             bg-gradient-to-r from-green-100 via-green-400 to-green-500
             bg-[length:200%_200%] animate-pulse-gradient-green"
        >
          <p className="text-lg font-semibold">포트폴리오</p>
        </div>
        <div className="h-64 relative rounded-xl shodow-md border p-4 bg-white animate-pulse-green hover:animate-none">
          <p>포트폴리오</p>
        </div>
        <div className="h-64 relative rounded-xl shodow-md border p-4 bg-white animate-pulse-red hover:animate-none">
          <p>포트폴리오</p>
        </div>
        <div className="h-64 relative rounded-xl shodow-md border p-4 bg-white animate-pulse-green hover:animate-none">
          <p>포트폴리오</p>
        </div>
        <div className="h-64 relative rounded-xl shodow-md border p-4 bg-white animate-pulse-red hover:animate-none">
          <p>포트폴리오</p>
        </div>
      </div>
    </>
  );
}

export default PersonalPage;
