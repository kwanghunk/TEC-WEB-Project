import axiosInstance from "./FuncAxios";

// 현재 사용자 IP 및 요청 가능 여부 조회 함수
export const fetchUserIpStatus = async () => {
  try {
    const response = await axiosInstance.get("/api/ip/check");
    return {
      ip: response.data.ip || "unknown",
      isMember: response.data.isMember || false
    };
  } catch (e) {
    console.error("IP 정보 조회 오류: ", e);
    return {
      ip: "unknown",
      isMember: false
    };
  }
};

// 비회원 요청 가능여부 검증 함수수
export const validateGuestRequest = async () => {
  try {
    const response = await axiosInstance.get("/api/ip/validate");
    return response.data.isAllowed; // 요청 가능여부 반환
  } catch (e) {
    console.error("비회원 요청제한 초과: ", e);
    return false;
  }
};