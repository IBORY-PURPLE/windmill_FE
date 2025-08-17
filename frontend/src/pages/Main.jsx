function MainLayout({ children }) {
  return (
    <div className="bg-[#F6F6F6] font-customSerif text-xl">
      <div
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-0
                      flex flex-col min-h-screen"
      >
        <div className="min-h-screen bg-beige shadow-2xl rounded-xl">
          {children}
        </div>

        {/* 남는 공간을 먹어서 footer를 바닥으로 밀어냄 */}
        <div className="flex-1" />

        <footer className="bg-gray-200 text-black py-6 shadow-2xl">
          <p className="mb-2 text-center text-sm">
            © 2025 WindMill All rights reserved.
          </p>
          <ul className="flex justify-center gap-4 text-sm">
            <li>
              <a href="/about" className="hover:underline">
                회사소개
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                개인정보 처리방침
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                AI model: made by gpt
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
