import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import MyPageNav from "./MyPageNav";
import MyPageDashboard from "./MyPageDashboard";
import Profile from "./Sections/Profile";
import History from "./Sections/History";
import Settings from "./Sections/Settings";
import DeleteAccount from "./Sections/DeleteAccount";
import "./MyPage.css";
import HistoryDetail from "./Sections/HistoryDetail";

const MyPage = ({ setUser }) => {
  const [activeTab, setActiveTab] = useState(null); // 대시보드 화면
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  return (
    <Container className="mypage-container">
      {activeTab !== null && <MyPageNav setActiveTab={setActiveTab} />}
      {activeTab === null && <MyPageDashboard setActiveTab={setActiveTab} />}
      {activeTab === "profile" && <Profile setActiveTab={setActiveTab} />}
      {activeTab === "history" && (
        <History setActiveTab={setActiveTab} setSelectedHistoryId={setSelectedHistoryId} />
      )}
      {activeTab === "historyDetail" && (
        <HistoryDetail selectedHistoryId={selectedHistoryId} setSelectedHistoryId={setSelectedHistoryId} setActiveTab={setActiveTab} />
      )}
      {activeTab === "settings" && <Settings setActiveTab={setActiveTab} />}
      {activeTab === "delete" && <DeleteAccount setUser={setUser} setActiveTab={setActiveTab} />}
    </Container>
  )
}

export default MyPage;