import { getAuthToken } from "../util/auth";

export const fetchPortfolio = async (avatarId) => {
  const res = await fetch(
    `https://windmill-be-5qid.onrender.com/portfolio/${avatarId}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) throw new Error("포트폴리오 조회 실패했습니다.");
  const data = await res.json();
  console.log(data.data);
  return data.data;
};

export const fetchSavedPortfolioList = async (avatarId) => {
  const token = getAuthToken();
  const res = await fetch(
    `https://windmill-be-5qid.onrender.com/portfolio/${avatarId}/save`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) throw new Error("저장된 포트폴리오를 불러오는 데 실패했습니다.");

  const data = await res.json();
  return data.data;
};

export const togglePortfolio = async (
  avatarId,
  portfolioId,
  isAlreadySaved
) => {
  const token = getAuthToken();
  const method = isAlreadySaved ? "DELETE" : "POST";
  const res = await fetch(
    `https://windmill-be-5qid.onrender.com/portfolio/${avatarId}/save/${portfolioId}`,
    {
      method,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) throw new Error("포트폴리오 저장 실패했습니다.");
  return res.json();
};
