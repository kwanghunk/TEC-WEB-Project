import axios from "axios";

// 현재 사용자 IP 및 요청 가능 여부 조회 함수
export const fetchUserIpStatus = async () => {
  try {
    const response = await axios.get("/api/ip/check");
    return {
      ip: response.data.ip,
      username: response.data.user,
      isAllowed: response.data.isAllowed
    };
  } catch (e) {
    console.error("IP 정보 조회 오류: ", e);
    return {
      ip: "unknown",
      username: "비회원",
      isAllowed: false
    };
  }
};

// 비회원 여부 판단 함수
export const isGuestUser = (username) => {
  return username === "비회원" || username === "ROLE_GUEST";
}