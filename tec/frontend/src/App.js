import React, {useEffect, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

/* 컴포넌트 IMPORT */
import TranslateComponent from './TEC/TranslateComponent';
import CodeManagement from './TEC/Admin/CodeManagement';
import Faq from './TEC/Admin/Faq';
import UserSupportList from './TEC/UserSupport/UserSupportList';
import UserSupportForm from './TEC/UserSupport/UserSupportForm';
import UserSupportDetail from './TEC/UserSupport/UserSupportDetail';
import UserSupportEdit from './TEC/UserSupport/UserSupportEdit';
import MyPage from './TEC/User/MyPage';
import PasswordChange from './TEC/User/PasswordChange';
import Profile from './TEC/User/Profile';
import SavedHistoryList from './TEC/User/SavedHistoryList';
import SavedHistoryDetail from './TEC/User/SavedHistoryDetail';
import AdminSupportList from './TEC/Admin/AdminSupportList';
import AdminSupportDetail from './TEC/Admin/AdminSupportDetail';
import Login from './TEC/Component/Login/Login';
import SignUp from './TEC/Component/SingUp/SignUp';
import Header from './TEC/Component/Header/Header';



const App = () => {
  // 로그인 상태 관리
  const [user, setUser] = useState(null);

  useEffect(() => {
    // localStorage에서 사용자 정보 로드
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div className="App">
      <Header user={ user } setUser={setUser} />
      
      <div className="pages">
        <Routes>
          <Route path='/' element={<TranslateComponent />} />
          <Route path="/Admin/CodeManagement" element={<CodeManagement />} />
          <Route path="/Admin/Faq" element={<Faq />} />
          <Route path="/AdminSupportList" element={<AdminSupportList />} />
          <Route path="/AdminSupportDetail" element={<AdminSupportDetail />} />
          <Route path="/UserSupportList" element={<UserSupportList />} />
          <Route path="/UserSupportForm" element={<UserSupportForm />} />
          <Route path="/UserSupportDetail" element={<UserSupportDetail />} />
          <Route path="/UserSupportEdit" element={<UserSupportEdit />} />
          <Route path="/User/MyPage" element={<MyPage />} />
          <Route path="/User/PasswordChange" element={<PasswordChange />} />
          <Route path="/User/Profile" element={<Profile />} />
          <Route path="/User/savedHistoryList" element={<SavedHistoryList />} />
          <Route path="/User/savedHistoryDetail/:id" element={<SavedHistoryDetail />} />

          <Route path="/Login" element={<Login setUser={setUser} />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;