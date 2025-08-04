// 1. 뉴스 api생성하고
// 2. 뉴스 content page컴포넌트 생성
// 3. 뉴스 react-query훅 생성
// 4. /news페이지 생성 -> newsletter페이지를 삭제하고
// 기본 newsroot를 만들어서 전체 뉴스 띄우는 창을 기본으로하고
// 메인네비게이터에서 news메뉴 하위 드롭다운으로 경제, 금융, S&P500지수 페이지 만들어서 각각 전달할 수 있게 설정하기.

export const fetchNews = async (query) => {
  const res = await fetch(
    `https://windmill-be-iqxx.onrender.com/news?query=${encodeURIComponent(
      query
    )}&display=50`
  );

  if (!res.ok) {
    throw new Error("뉴스를 불러오는 데 실패했습니다.");
  }

  const data = await res.json();
  return data.data;
};
