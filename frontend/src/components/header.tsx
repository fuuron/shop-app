import React from 'react';

const Header = ({ loggedIn }) => {
  return (
    <header>
      <h1 className="title"><a href="/">タイトル</a></h1>
      <nav className="nav">
        <ul className="menu-group">
          <li className="menu-item"><a href="#">項目1</a></li>
          <li className="menu-item"><a href="#">項目1</a></li>
          <li className="menu-item"><a href="#">項目1</a></li>
          {loggedIn ? (
            <li className="menu-item"><a href="/pages/account">アカウント情報</a></li>
          ) : (
            <>
              <li className="menu-item"><a href="/pages/register">新規登録</a></li>
              <li className="menu-item"><a href="/pages/login">ログイン</a></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
