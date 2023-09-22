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

  const { data: user } = useSWR('http://localhost/api/user', () =>
    http.get('http://localhost/api/user')
      .then(res => res.data)
  )

  return (
    <div>
      <header>
        <h1 className='title'><a href='/'>タイトル</a></h1>
        <nav className='nav'>
          <ul className='menu-group'>
            <li className='menu-item'><a href='#'>項目1</a></li>
            <li className='menu-item'><a href='#'>a</a></li>
            <li className='menu-item'>
              <a href={user ? '/pages/account' : '/pages/login'}>
                {user ? user.name : 'ログイン'}
              </a>
            </li>
            <li className='menu-item'><a href='/pages/register'>新規登録</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>Footer content</footer>
    </div>
  )
}

export default Layout;
