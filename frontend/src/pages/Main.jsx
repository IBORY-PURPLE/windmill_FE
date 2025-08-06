function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F6F6F6]">
      {/* <aside className="hidden md:flex md:w-[30%] bg-gray-100 p-6 flex-col gap-4">
        <h2 className="text-xl font-bold mb-2"></h2>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="px-4 py-2 border rounded w-full"
        />
        <div className="flex flex-wrap gap-2">
          {["국장", "미장", "스테이블코인", "떡상"].map((name) => (
            <span
              key={name}
              className="bg-blue-100 px-3 py-1 rounded-full text-sm"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <p className="text-sm text-gray-500">앱 다운로드</p>
        </div>
      </aside> */}
      {/* 우측 콘텐츠 영역 */}
      <main className="flex-1 w-full p-0 flex justify-center m-0 font-customSerif text-xl">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-beige mx-auto shadow-2xl z-10 rounded-xl">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
