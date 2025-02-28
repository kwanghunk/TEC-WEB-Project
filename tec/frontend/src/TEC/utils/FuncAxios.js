import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 API URL
  withCredentials: true, // Refresh Token을 HttpOnly Secure 쿠키에서 자동 전송
});

let accessToken = sessionStorage.getItem("accessToken") || null; // 🔹 메모리에서 유지

// Access Token을 설정하는 함수
export const setAccessToken = (token) => {
  accessToken = token;
  sessionStorage.setItem("accessToken", token);
  console.log("[FuncAxios] Access Token 설정됨:", accessToken);
};

// 요청 인터셉터 - Access Token이 있을 때만 Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 새 Access Token이 있으면 자동 저장
axiosInstance.interceptors.response.use(
  (response) => {
    // 백엔드에서 새로운 Access Token을 응답 헤더에 포함하면, 자동 저장
    const newAccessToken = response.headers["authorization"];
    if (newAccessToken) {
      setAccessToken(newAccessToken);
      console.log("[FuncAxios] 새로운 Access Token 자동 설정됨");
    }
    return response;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;
