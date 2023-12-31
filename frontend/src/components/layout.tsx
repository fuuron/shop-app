import React, { useState, ReactNode } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { axiosCreate } from './function'

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const { data: user, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
    axiosCreate().get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const [isActive, setIsActive] = useState(false);

  const toggleHeader = () => {
    setIsActive(!isActive);
  }

  const moveHome = () => {
    location.href = '/';
  }

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
          <h1 className='title'><Link href='/pages/login'>めだか屋</Link></h1>
          <nav className='unauthorizednav'>
            <ul className='unauthorizedMenu-group'>
              <div className='menu-item'><Link href='/pages/login'>ログイン</Link></div>
              <div className='menu-item'><Link href='/pages/register'>新規登録</Link></div>
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
        <header id='header' className={isActive ? 'active' : ''}>
          <div className='logo' onClick={moveHome}>めだか屋</div>
          <div id='hmb' onClick={toggleHeader}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav className='menu-group'>
            <ul>
              <li onClick={toggleHeader}><Link href='/pages/products'>商品一覧</Link></li>
              <li onClick={toggleHeader}><Link href='/pages/post'>商品投稿</Link></li>
              <li onClick={toggleHeader}><Link href='/pages/favorite'>気になる一覧</Link></li>
              <li onClick={toggleHeader}><Link href='/pages/purchaseHistory'>購入履歴</Link></li>
              <li onClick={toggleHeader}><Link href='/pages/sellHistory'>販売履歴</Link></li>
              <li onClick={toggleHeader}><Link href='/pages/account'>{user.name} さん</Link></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default Layout;
