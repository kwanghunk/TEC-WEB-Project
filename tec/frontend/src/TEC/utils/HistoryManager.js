import axiosInstance from "./FuncAxios";

// 세션에서 히스토리 가져오기
export const fetchHistory = () => {
  const savedHistory = JSON.parse(sessionStorage.getItem("translationHistory")) || [];// sessionStorage에서 히스토리 불러오기
  return savedHistory;
};

// 히스토리 업데이트 및 세션 저장
export const updateHistory = (newItem, currentHistory) => {
  const updatedHistory = [newItem, ...currentHistory].slice(0, 10) // 최근 10개까지만 유지
  sessionStorage.setItem("translationHistory", JSON.stringify(updatedHistory));
  return updatedHistory;
};

// 히스토리 저장 (API 호출)
export const saveTranslation = async (dataToSave, user) => {
  try {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    await axiosInstance.post("/api/history", dataToSave);
    alert("기록이 저장되었습니다.");
  } catch (e) {
    console.error("API 요청 실패: ", e);
    // 401 Unauthorized 에러인 경우 alert 메시지 출력
    if (e.response && e.response.status === 401) {
      alert("로그인이 필요한 기능입니다.");
    } else {
      alert("요청 실패: " + (e.response?.data?.message || "알 수 없는 오류가 발생했습니다."));
    }
  }
};

// 번역 데이터 다운로드 (API 호출)
export const downloadTranslation = async (dataToDownload) => {
  try {
    const response = await axiosInstance.post("/api/history/sessionDownload", dataToDownload, {
        responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${dataToDownload.fileName}.txt`);
    document.body.appendChild(link);
    link.click();
  } catch (e) {
    console.error("다운로드 실패: ", e);
    // 401 에러인 경우, Blob 데이터를 JSON으로 변환하여 메시지 추출
    if (e.response && e.response.status === 401) {
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const errorMessage = JSON.parse(reader.result).message || "로그인이 필요한 기능입니다.";
          alert(errorMessage);
        } catch {
          alert("로그인이 필요한 기능입니다.");
        }
      };
      reader.readAsText(e.response.data); // Blob을 JSON으로 변환
    } else {
      alert("다운로드 실패: 알 수 없는 오류가 발생했습니다.");
    }
  }
};