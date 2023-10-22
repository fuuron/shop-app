import styles from '../../styles/account.module.css'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const AcccountPage = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/user', () =>
  http.get('http://localhost/api/user').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  console.log(data);

  const handleLogout = () => {
    http.post('/api/logout').then((res) => {
      console.log(res);
      location.href = 'http://localhost:3000/pages/login';
    })
  }

  const handleDestroy = () => {
    http.post('/api/destroy').then((res) => {
      console.log(res);
      location.href = 'http://localhost:3000/pages/register';
    })
  }

  const editRouter = () => {
    router.push('http://localhost:3000/pages/edit');
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
        <p>Error: {error.message}</p>
      </div>
    )
  }

  if (data) {
    return (
      <div>
        <div className={styles.accountInformation}>
          
          <h2 className={styles.header}>
            アカウント情報
          </h2>
          
          <div className={styles.accountData}>
            <h3>
              ユーザー名
            </h3>
            {data.name}
          </div>
          <div className={styles.accountData}>
            <h3>
              mailアドレス
            </h3>
            {data.email}
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
      </div>
    )
  }
}

export default AcccountPage;
