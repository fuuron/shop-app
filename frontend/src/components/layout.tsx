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
    http.get('http://localhost/api/user').then((res) => res.data)
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
          <h1 className='title'><a href='/'>タイトル</a></h1>
          <nav className='nav'>
            <ul className='menu-group'>
              <li className='menu-item'><a href='#'>商品一覧</a></li>
              <li className='menu-item'><a href='#'>商品投稿</a></li>
              <li className='menu-item'><a href='/pages/login'>ログイン</a></li>
              <li className='menu-item'><a href='/pages/register'>新規登録</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>Footer content</footer>
      </div>
    )
  }

  if (user) {
    return (
      <div>
        <header>
          <h1 className='title'><a href='/'>タイトル</a></h1>
          <nav className='nav'>
            <ul className='menu-group'>
              <li className='menu-item'><a href='#'>商品一覧</a></li>
              <li className='menu-item'><a href='#'>商品投稿</a></li>
              <li className='menu-item'><a href='/pages/account'>{user.name}</a></li>
              <li className='menu-item'><a href='/pages/register'>新規登録</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>Footer content</footer>
      </div>
    )
  }
}

export default Layout;
