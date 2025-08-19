import { useSearchParams, useNavigate } from "react-router-dom";
import { useNews } from "../hooks/useNews";
import { useState, useEffect } from "react";

const categories = [
  { name: '경제', value: 'economy' },
  { name: '암호화폐', value: 'cryptocurrency' },
  { name: '주식시장', value: 'stock' },
  { name: '정치', value: 'politics' },
];

function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const query = searchParams.get("query") || "경제";
  const { data: news, isLoading, error } = useNews(query);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-[#C20E2F] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">뉴스를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">뉴스를 불러오는 중 문제가 발생했습니다.</p>
          <p className="text-sm text-gray-500">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#C20E2F] text-white rounded-md hover:bg-red-700 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">최신 뉴스</h1>
            <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  🔍
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C20E2F] focus:border-transparent"
                  placeholder="뉴스 검색..."
                />
              </div>
              <button
                type="submit"
                className="ml-0.5 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-[#C20E2F] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C20E2F] transition-colors"
              >
                검색
              </button>
            </form>
          </div>
          
          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => navigate(`/news?query=${category.name}`)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  query === category.name
                    ? 'bg-[#C20E2F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {news && news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {news.map((article, index) => (
              <article
                key={index}
                className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {article.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="mr-1">📅</span>
                      <span>{formatDate(article.pubDate)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3">
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#C20E2F] transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="mt-3 text-base text-gray-600 line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#C20E2F] hover:text-red-700 inline-flex items-center"
                    >
                      기사 보기 ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다. 다른 키워드로 시도해 주세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default NewsPage;
