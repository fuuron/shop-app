import styles from '../../styles/account.module.css'
import styles2 from '../../styles/products.module.css'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const AcccountPage = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/userInformation', () =>
  http.get('http://localhost/api/userInformation').then((res) => res.data),
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

  const handleShowDetail = (productId) => {
    router.push(`http://localhost:3000/pages/product/${productId}`);
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
            {data.user.name}
          </div>
          <div className={styles.accountData}>
            <h3>
              mailアドレス
            </h3>
            {data.user.email}
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

        <h2 className={styles.productsHeader}>
          <span className={styles.userGreeting}>
            {data.user.name}様
          </span>
          の投稿した商品一覧
        </h2>

        <div className={styles.userProducts}>
          {data.userProducts && data.userProducts.length > 0 ? (
            data.userProducts.map((product) => (
              <div className={styles.product} key={product.id}>
                <div className={styles2.product}>
                  <div className={styles2.information}>
                    <div className={styles2.title} onClick={() => handleShowDetail(product.id)}>{product.title}</div>
                    <div>投稿者: {product.user_name}</div>
                    <div>種類: {product.type}</div>
                    <div>投稿日時: {new Date(product.updated_at).toLocaleString()}</div>
                  </div>
                  <div className={styles2.imageContainer}>
                    <img src={product.photo} width="200" height="auto" alt={product.title} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles2.productsNotFound}>投稿した商品はありません</div>
          )}
        </div>
      </div>
    )
  }
}

export default AcccountPage;
