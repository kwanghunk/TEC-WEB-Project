import axios from "axios";

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
export const saveTranslation = async (dataToSave, token) => {
  try {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    await axios.post("/api/history", dataToSave, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("기록이 저장되었습니다.");
  } catch (e) {
    console.error("기록 저장 실패: ", e);
    alert("저장 실패");
  }
};

// 번역 데이터 다운로드 (API 호출)
export const downloadTranslation = async (dataToDownload) => {
  try {
    const response = await axios.post("/api/history/sessionDownload", dataToDownload, {
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
    alert("다운로드 실패");
  }
};