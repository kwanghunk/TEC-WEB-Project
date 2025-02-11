import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 API URL
  withCredentials: true, // Refresh Token을 HttpOnly Secure 쿠키에서 자동전송
});

let accessToken = null; // Access Token을 메모리에서만 유지지

// 요청 인터셉터 (API 요청 시 Access Token 자동 포함)
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (Access Token 만료 시 Refresh Token을 이용한 재발급 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) { // Unauthorized (Access Token 만료)
      try {
        console.log("Access Token이 만료됨. Refresh Token으로 재발급 요청 중...");

        // Refresh Token을 이용해 새로운 Access Token 요청
        const refreshResponse = await axiosInstance.post("/user/refresh", {}, { withCredentials: true });

        // 새로운 Access Token을 저장
        accessToken = refreshResponse.data.accessToken;
        console.log("새로운 Access Token 발급 완료:", accessToken);

        // 원래 요청을 다시 실행
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Refresh Token이 만료됨. 로그인 필요.");
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
