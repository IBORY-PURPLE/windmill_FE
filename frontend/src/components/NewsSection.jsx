import { useEffect, useState } from "react";
import { useNews } from "../hooks/useNews";

function NewsSection() {
  const { data: todayNews = [], isLoading } = useNews("오늘의 주요 경제 뉴스");
  const [index, setIndex] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    if (todayNews.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % todayNews.length);
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [todayNews]);

  // 좌우 화살표 클릭
  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? todayNews.length - 1 : prev - 1));
  };
  const goNext = () => {
    setIndex((prev) => (prev + 1) % todayNews.length);
  };

  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center text-sm text-gray-500">
        오늘의 뉴스를 불러오는 중...
      </div>
    );
  }

  const current = todayNews[index];
  const total = todayNews.length;
  const maxVisible = 3;

  // 인디케이터 데이터: 최대 maxVisible 개만 보이도록 startIndex 계산
  let start = 0;
  if (total > maxVisible) {
    const half = Math.floor(maxVisible / 2);
    if (index <= half) {
      start = 0;
    } else if (index >= total - half) {
      start = total - maxVisible;
    } else {
      start = index - half;
    }
  }
  const visibleIndicators = todayNews.slice(
    start,
    start + Math.min(total, maxVisible)
  );

  return (
    <div className="group relative flex-1 bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-all duration-500 ease-in-out origin-top">
      <h2 className="text-lg font-bold mb-2 ml-2 text-black group-hover:text-[#C20E2F]">
        오늘의 주요 뉴스
      </h2>

      {/* 뉴스 슬라이드 영역 */}
      <div className="relative flex h-24 rounded-lg border bg-white border-gray-200 group-hover:h-auto transition-all duration-500 overflow-hidden pl-3 pr-3">
        {/* 왼쪽 화살표 */}
        <button
          onClick={goPrev}
          aria-label="이전 뉴스"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-3xl text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          &#x276E;
        </button>

        {/* 뉴스 내용 */}
        {current && (
          <div className="flex-shrink-0 w-full p-3 transition-opacity duration-500 opacity-100 ">
            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold hover:underline text-gray-900 hover:text-[#C20E2F]"
            >
              {current.title}
            </a>
            <p className="text-xs text-gray-500 mt-1">{current.pubDate}</p>
            <p className="text-xs text-gray-600 mt-2 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-40 ">
              {current.description}
            </p>
          </div>
        )}

        {/* 오른쪽 화살표 */}
        <button
          onClick={goNext}
          aria-label="다음 뉴스"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-3xl text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          &#x276F;
        </button>
      </div>

      {/* 인디케이터: 가로 스크롤, 크기 감소 효과, 중앙 정렬 */}
      <div className="mt-3 overflow-x-auto">
        <div className="flex justify-center items-center space-x-2 px-2">
          {visibleIndicators.map((_, idx) => {
            const realIndex = start + idx;
            const distance = Math.abs(realIndex - index);
            const size = Math.max(4, 12 - distance * 2); // 최대 12px, 최소 4px
            const color = realIndex === index ? "bg-black" : "bg-gray-400";
            return (
              <button
                key={realIndex}
                onClick={() => setIndex(realIndex)}
                className={`${color} rounded-full transition-all duration-200`}
                style={{ width: size, height: size }}
                aria-label={`${realIndex + 1}번째 뉴스로 이동`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NewsSection;
