import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <title>Create Next App</title>
      <Head />
      <body>
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
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
