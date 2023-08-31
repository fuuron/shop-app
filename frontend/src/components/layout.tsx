import React, { useState, useEffect } from 'react';
import Header from './header'; // Headerコンポーネントをインポート

const Layout = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // console.log('useEffect is running');
    fetch('http://localhost:8080/api/user')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // 取得したデータからログイン状態をセット
        setLoggedIn(data.loggedIn);

        console.log('loggedIn:', data.loggedIn);

        // ログイン状態が false の場合もログに表示
        if (!data.loggedIn) {
          console.log('User is not logged in.');
        }
      })
      .catch(error => {
        console.error('エラー:', error);
      });
  }, []);

  return (
    <div>
      <Header loggedIn={loggedIn} /> {/* Headerコンポーネントを呼び出す */}
      <main>{children}</main>
      <footer>Footer content</footer>
    </div>
  );
};

export default Layout;
