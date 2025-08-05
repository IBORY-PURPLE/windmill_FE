import { getAuthToken } from "../util/auth";

export const fetchAvatars = async () => {
  const token = getAuthToken();
  const res = await fetch(
    "https://windmill-be-iqxx.onrender.com/portfolio/avatar",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!res.ok) {
    // 실패한 경우에만 텍스트 출력
    const errorText = await res.text();
    console.error("서버 에러 응답 내용:", errorText);
    throw new Error("아바타를 불러오는데 실패했습니다.");
  }

  // if (!res.ok) throw new Error("아바타를 불러오는데 실패했습니다.");
  const data = await res.json();
  return data.data;
};

export const addAvatar = async (avatarData) => {
  const token = getAuthToken();
  const res = await fetch(
    "https://windmill-be-iqxx.onrender.com/portfolio/avatar",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: avatarData.age,
        loss: avatarData.loss,
        name: avatarData.name,
      }),
    }
  );

  if (!res.ok) throw new Error("아바타 추가 실패");
  const data = await res.json();
  return data.data;
};

export const allDeleteAvatar = async () => {
  const token = getAuthToken();
  const res = await fetch(
    "https://windmill-be-iqxx.onrender.com/portfolio/delete_all",
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) throw new Error("전체 삭제 실패");
};

export const fetchPortfolio = async (avatarId) => {
  const token = getAuthToken();
  const res = await fetch(
    `https://windmill-be-iqxx.onrender.com/portfolio/${avatarId}`,
    {
      method: "POST",
      // headers: {
      //   Authorization: "Bearer " + token,
      //   "Content-Type": "application/json",
      // },
    }
  );

  const text = await res.text(); // JSON이 아닐 수도 있으므로
  console.log("서버 응답 내용:", text);

  if (!res.ok) throw new Error("포트폴리오 조회 실패했습니다.");
  const data = await res.json();
  console.log(data);
  return data.data;
};
