import { getAuthToken } from "../util/auth";

export const fetchAvatars = async () => {
  const token = getAuthToken();
  const res = await fetch("https://windmill-be-iqxx.onrender.com/user/avatar", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) throw new Error("아바타를 불러오는데 실패했습니다.");
  const data = await res.json();
  return data.data;
};

export const addAvatar = async (avatarData) => {
  const token = getAuthToken();
  const res = await fetch("https://windmill-be-iqxx.onrender.com/user/avatar", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      age: avatarData.age,
      loss: avatarData.loss,
    }),
  });

  if (!res.ok) throw new Error("아바타 추가 실패");
  const data = await res.json();
  return data.data;
};

export const fetchPortfolio = async (avatarId) => {
  const token = getAuthToken();
  const res = await fetch(
    `https://windmill-be-iqxx.onrender.com/user/avatar/${avatarId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) throw new Error("포트폴리오 조회 실패했습니다.");
  const data = await res.json();
  return data.data;
};
