import React, { useState, ReactNode } from 'react'
import axios from 'axios'
import useSWR from 'swr'

interface LayoutProps {
  children: ReactNode;
}

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const { data: user, error, isLoading } = useSWR('http://localhost/api/user', () =>
    http.get('http://localhost/api/user').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const [isActive, setIsActive] = useState(false);

  const toggleHeader = () => {
    setIsActive(!isActive);
  };

  if (isLoading) {
    return (
      <>
      </>
    )
  }

  if (error) {
    return (
      <div>
        <header className='unauthorizedHeader'>
          <h1 className='title'><a href='/pages/login'>めだか屋</a></h1>
          <nav className='unauthorizednav'>
            <ul className='unauthorizedMenu-group'>
              <div className='menu-item'><a href='/pages/login'>ログイン</a></div>
              <div className='menu-item'><a href='/pages/register'>新規登録</a></div>
            </ul>
          </nav>
        </header>
        <main className='main'>{children}</main>
      </div>
    )
  }

  if (user) {
    return (
      <div className='htmlHeader'>
        <header id="header" className={isActive ? 'active' : ''}>
          <a href='/pages/products' className='logo'>めだか屋</a>
          <div id='hmb' onClick={toggleHeader}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav className='menu-group'>
            <ul>
              <li><a href='/pages/products'>商品一覧</a></li>
              <li><a href='/pages/post'>商品投稿</a></li>
              <li><a href='/pages/favorite'>気になる一覧</a></li>
              <li><a href='/pages/purchaseHistory'>購入履歴</a></li>
              <li><a href='/pages/sellHistory'>販売履歴</a></li>
              <li><a href='/pages/account'>{user.name} さん</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout;
