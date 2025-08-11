// 1. 뉴스 api생성하고
// 2. 뉴스 content page컴포넌트 생성
// 3. 뉴스 react-query훅 생성
// 4. /news페이지 생성 -> newsletter페이지를 삭제하고
// 기본 newsroot를 만들어서 전체 뉴스 띄우는 창을 기본으로하고
// 메인네비게이터에서 news메뉴 하위 드롭다운으로 경제, 금융, S&P500지수 페이지 만들어서 각각 전달할 수 있게 설정하기.

export const fetchNews = async (query) => {
  const res = await fetch(
    `https://windmill-be-5qid.onrender.com/news?query=${encodeURIComponent(
      query
    )}&display=50`
  );

  if (!res.ok) {
    throw new Error("뉴스를 불러오는 데 실패했습니다.");
  }

  const data = await res.json();

  // 안전한 HTML을 텍스트로 변환하는 헬퍼 함수
  const htmlToText = (html) => {
    if (!html || typeof html !== "string") {
      return "";
    }

    try {
      // 1. 위험한 스크립트 태그들을 먼저 제거 (보안 1차 방어)
      let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // script 태그 완전 제거
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // style 태그 제거
        .replace(/javascript:/gi, "") // javascript: 프로토콜 제거
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "") // on* 이벤트 핸들러 제거
        .replace(/on\w+\s*=\s*[^"'\s>]+/gi, ""); // 따옴표 없는 이벤트 핸들러 제거

      // 2. DOMParser를 사용한 안전한 파싱 (브라우저 환경에서만)
      if (typeof window !== "undefined" && window.DOMParser) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sanitized, "text/html");

        // DOMParser로 파싱된 문서에서 텍스트만 추출
        const textContent = doc.body
          ? doc.body.textContent || doc.body.innerText || ""
          : "";

        return textContent
          .replace(/\s+/g, " ") // 연속된 공백을 하나로
          .trim(); // 앞뒤 공백 제거
      }

      // 3. Node.js 환경이거나 DOMParser가 없는 경우 - 정규식 사용 (fallback)
      else {
        return sanitized
          .replace(/<[^>]*>/g, "") // 모든 HTML 태그 제거
          .replace(/&nbsp;/gi, " ") // &nbsp; -> 공백
          .replace(/&lt;/gi, "<") // &lt; -> <
          .replace(/&gt;/gi, ">") // &gt; -> >
          .replace(/&amp;/gi, "&") // &amp; -> &
          .replace(/&quot;/gi, '"') // &quot; -> "
          .replace(/&#x27;/gi, "'") // &#x27; -> '
          .replace(/&#x2F;/gi, "/") // &#x2F; -> /
          .replace(/&#x60;/gi, "`") // &#x60; -> `
          .replace(/&#x3D;/gi, "=") // &#x3D; -> =
          .replace(/&[a-zA-Z0-9#]+;/gi, "") // 기타 HTML 엔티티 제거
          .replace(/\s+/g, " ") // 연속된 공백을 하나로
          .trim(); // 앞뒤 공백 제거
      }
    } catch (error) {
      console.error("HTML to text conversion failed:", error);
      // 에러 발생 시 가장 보수적인 접근: 모든 태그 제거
      return html.replace(/<[^>]*>/g, "").trim();
    }
  };

  // 데이터 처리하여 HTML을 안전한 텍스트로 변환
  const processedData = data.data.map((item) => {
    const processedItem = { ...item };

    // 각 텍스트 필드를 안전하게 변환
    if (processedItem.title) {
      processedItem.title = htmlToText(processedItem.title);
    }

    if (processedItem.description) {
      processedItem.description = htmlToText(processedItem.description);
    }

    if (processedItem.content) {
      processedItem.content = htmlToText(processedItem.content);
    }

    // 다른 필드들도 HTML이 포함될 수 있다면 처리
    if (processedItem.summary) {
      processedItem.summary = htmlToText(processedItem.summary);
    }

    return processedItem;
  });

  return processedData;
};

// 추가: 별도의 유틸리티 함수로도 사용 가능
export const safeHtmlToText = (html) => {
  if (!html || typeof html !== "string") {
    return "";
  }

  try {
    // 1. 위험한 요소들 사전 제거
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/on\w+\s*=\s*[^"'\s>]+/gi, "");

    // 2. DOMParser 사용 (브라우저)
    if (typeof window !== "undefined" && window.DOMParser) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitized, "text/html");
      const textContent = doc.body
        ? doc.body.textContent || doc.body.innerText || ""
        : "";
      return textContent.replace(/\s+/g, " ").trim();
    }

    // 3. 정규식 사용 (Node.js)
    return sanitized
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#x27;/gi, "'")
      .replace(/&#x2F;/gi, "/")
      .replace(/&#x60;/gi, "`")
      .replace(/&#x3D;/gi, "=")
      .replace(/&[a-zA-Z0-9#]+;/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    console.error("HTML to text conversion failed:", error);
    return html.replace(/<[^>]*>/g, "").trim();
  }
};
