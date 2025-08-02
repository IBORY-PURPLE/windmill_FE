import { useEffect, useState } from "react";
import { useNews } from "../hooks/useNews";

function NewsSection() {
  const { data: todayNews = [], isLoading } = useNews("오늘의 주요 뉴스");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (todayNews.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % todayNews.length);
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [todayNews]);

  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center text-sm text-gray-500">
        오늘의 뉴스를 불러오는 중...
      </div>
    );
  }
  const current = todayNews[index];

  return (
    <div className="group relative flex-1 bg-white p-4 rounded-lg shadow-md border border-black transition-all duration-500 ease-in-out hover:scale-y-125 hover:scale-x-110 origin-top hover-shadow-xl hover:z-10">
      <h2 className="text-lg font-bold mb-2 ml-2 text-black group-hover:text-[#C20E2F]">
        오늘의 주요 뉴스
      </h2>
      <div className="flex h-24 rounded-lg border bg-white border border-black group-hover:h-auto transition-all duration-500">
        {current && (
          <div className="flex-shrink-0 w-full p-4 transition-opacity duration-500 opacity-100 animate-fadeIn">
            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline text-gray-900 hover:text-[#C20E2F]"
            >
              {current.title}
            </a>
            <p className="text-xs text-gray-500 mt-1">{current.pubDate}</p>
            <p className="text-xs text-gray-600 mt-2 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-40">
              {current.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsSection;
