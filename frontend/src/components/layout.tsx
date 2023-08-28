import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1 className="title"><a href="/">タイトル</a></h1>
          <nav className="nav">
            <ul className="menu-group">
              <li className="menu-item"><a href="#">項目1</a></li>
              <li className="menu-item"><a href="#">項目1</a></li>
              <li className="menu-item"><a href="#">項目1</a></li>
              <li className="menu-item"><a href="#">項目1</a></li>
              <li className="menu-item"><a href="/pages/login">ログイン</a></li>
            </ul>
          </nav>
        </header>
      <main>{children}</main>
      <footer>Footer content</footer>
    </div>
  );
};

export default Layout;
