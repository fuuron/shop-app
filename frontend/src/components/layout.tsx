import React, { ReactNode } from 'react'
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

  if (isLoading) {
    return (
      <>
      </>
    )
  }

  if (error) {
    return (
      <div>
        <header>
          <h1 className='title'><a href='/'>めだか屋</a></h1>
          <nav className='nav'>
            <ul className='unauthorizedMenu-group'>
              <div className='menu-item'><a href='/pages/login'>ログイン</a></div>
              <div className='menu-item'><a href='/pages/register'>新規登録</a></div>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    )
  }

  if (user) {
    return (
      <div>
        <header>
          <h1 className='title'><a href='/'>めだか屋</a></h1>
          <nav className='nav'>
            <ul className='menu-group'>
              <div className='menu-item'><a href='/pages/products'>商品一覧</a></div>
              <div className='menu-item'><a href='/pages/post'>商品投稿</a></div>
              <div className='menu-item'><a href='/pages/favorite'>気になる一覧</a></div>
              <div className='menu-item'><a href='/pages/purchaseHistory'>購入履歴</a></div>
              <div className='menu-item'><a href='/pages/sellHistory'>販売履歴</a></div>
              <div className='menu-item'><a href='/pages/account'>{user.name}</a></div>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout;
