import { useSearchParams } from "react-router-dom";
import { useNews } from "../hooks/useNews";

function NewsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "경제";
  const { data: data, isLoading, error } = useNews(query);

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-1 pb-3 pt-2">뉴스 - {query}</h1>
      <ul className="space-y-4">
        {data?.map((article, index) => (
          <li
            key={index}
            className="p-4 border rounded shadow-sm border-black bg-white transition-all duration-300 hover:scale-105 hover-shadow-xl hover:z-10"
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold hover:underline hover:text-[#C20E2F]"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-500">{article.pubDate}</p>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsPage;
