import React, {useEffect, useRef, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

/* 컴포넌트 IMPORT */
import TranslateComponent from './TEC/TranslateComponent';
import CodeManagement from './TEC/Admin/CodeManagement';
import Faq from './TEC/Admin/Faq';
import UserSupportList from './TEC/Component/UserSupport/UserSupportList';
import UserSupportForm from './TEC/Component/UserSupport/UserSupportForm';
import UserSupportDetail from './TEC/Component/UserSupport/UserSupportDetail';
import UserSupportEdit from './TEC/Component/UserSupport/UserSupportEdit';

import AdminSupportList from './TEC/Component/Admin/AdminSupport/AdminSupportList';
import AdminSupportDetail from './TEC/Component/Admin/AdminSupport/AdminSupportDetail';
import Login from './TEC/Component/Login/Login';
import SignUp from './TEC/Component/SingUp/SignUp';
import Header from './TEC/Component/Header/Header';
import axiosInstance, { setAccessToken } from './TEC/utils/FuncAxios';

import MyPage from './TEC/Component/MyPage/MyPage';
import MyPageNav from './TEC/Component/MyPage/MyPageNav';
import MyPageDashboard from './TEC/Component/MyPage/MyPageDashboard';
import Profile from './TEC/Component/MyPage/Sections/Profile';
import History from './TEC/Component/MyPage/Sections/History';
import HistoryDetail from './TEC/Component/MyPage/Sections/HistoryDetail';
import Settings from './TEC/Component/MyPage/Sections/Settings';
import DeleteAccount from './TEC/Component/MyPage/Sections/DeleteAccount';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("app /user/me 전: ", user);
      try {
        const storedAccessToken = sessionStorage.getItem("accessToken");
        if ( storedAccessToken ) setAccessToken(storedAccessToken);

        const storedUser = sessionStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // Access Token을 이용하여 로그인 정보 가져오기
        const response = await axiosInstance.get("/user/me");

        // 새 Access Token이 응답 헤더에 포함된 경우, 자동 저장
        const newAccessToken = response.headers["authorization"];
        if (newAccessToken) setAccessToken(newAccessToken);

        const userData = {
          username: response.data.username,
          userType: response.data.userType
        };
        setUser(userData);
        console.log("app /user/me 후: ", user);
        // 사용자 정보 최신화
        sessionStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.log("새로고침 시 로그인 유지 실패 - 로그아웃 처리됨");
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="App">
      <Header user={ user } setUser={ setUser } />
      
      <div className="pages">
        <Routes>
          <Route path='/' element={<TranslateComponent user={ user } setUser={ setUser }  />} />
          <Route path="/Admin/CodeManagement" element={<CodeManagement />} />
          <Route path="/Admin/Faq" element={<Faq />} />

          <Route path="/AdminSupportList" element={<AdminSupportList />} />
          <Route path="/AdminSupportDetail" element={<AdminSupportDetail />} />

          <Route path="/UserSupportList" element={<UserSupportList />} />
          <Route path="/UserSupportForm" element={<UserSupportForm />} />
          <Route path="/UserSupportDetail" element={<UserSupportDetail />} />
          <Route path="/UserSupportEdit" element={<UserSupportEdit />} />
          
          <Route path="/User/MyPage" element={<MyPage setUser={ setUser } />} />
          <Route path="/User/MyPageNav" element={<MyPageNav />} />
          <Route path="/User/MyPageDashboard" element={<MyPageDashboard />} />
          <Route path="/User/MyPage/profile" element={<Profile />} />
          <Route path="/User/MyPage/history" element={<History />} />
          <Route path="/User/MyPage/historyDetail/:id" element={<HistoryDetail />} />
          <Route path="/User/MyPage/settings" element={<Settings />} />
          <Route path="/User/MyPage/deleteAccount" element={<DeleteAccount />} />

          <Route path="/Login" element={<Login setUser={ setUser } />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;