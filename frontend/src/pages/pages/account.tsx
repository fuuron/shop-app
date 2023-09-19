import styles from '../../styles/account.module.css'
import Layout from '../../components/layout'
import { useEffect, useState } from 'react'
import router from 'next/router'
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true,
})

const AcccountPage = () => {

  const [responseData, setResponseData] = useState(null);

  const fetchAccontInformation = () => {
    http.get('/sanctum/csrf-cookie').then(() => {
      http.get('/api/user').then((response) => {
        console.log(response);
        setResponseData(response.data);
      })
    })
  }

  useEffect(() => {
    fetchAccontInformation();
  }, [])

  const handleLogout = () => {
    http.post("/api/logout").then((res) => {
      console.log(res);
      router.push("http://localhost:3000/pages/login");
    })
  }

  const handleDestroy = () => {
    http.post("/api/destroy").then((res) => {
      console.log(res);
      router.push("http://localhost:3000/pages/register");
    })
  }

  const editRouter = () => {
    router.push("http://localhost:3000/pages/edit");
  }

  return (
    <Layout>
      <div className={styles.accountInformation}>
        
        <h2 className={styles.header}>
          アカウント情報
        </h2>
        
        <div className={styles.accountData}>
          <h3>
            ユーザー名
          </h3>
          {responseData ? responseData.name : "Loading..."}
        </div>
        <div className={styles.accountData}>
          <h3>
            mailアドレス
          </h3>
          {responseData ? responseData.email : "Loading..."}
        </div>

      </div>

      <div className={styles.accountManipulatebuttonsContainer}>
        <div className={styles.accountManipulatebuttons} onClick={editRouter}>
          編集
        </div>
        <div className={styles.accountManipulatebuttons} onClick={handleDestroy}>
          削除
        </div>
        <div className={styles.accountManipulatebuttons} onClick={handleLogout}>
          ログアウト
        </div>
      </div>

    </Layout>
  )
}

export default AcccountPage;
