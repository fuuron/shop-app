import styles from '../../styles/account.module.css'
import styles2 from '../../styles/products.module.css'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true
})

const AcccountPage = () => {

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/userInformation`, () =>
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/userInformation`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  // console.log(data);

  const handleLogout = () => {
    http.post('/api/logout').then((res) => {
      // console.log(res);
      location.href = '/pages/login';
    })
  }

  const handleDestroy = () => {
    const isConfirmed = window.confirm('これまでの取引内容、および投稿した商品は失われます。本当に削除しますか？');
    
    if (isConfirmed) {
      http.delete('/api/destroy').then((res) => {
        // console.log(res);
        location.href = '/pages/register';
      })
      .catch((error) => {
        // console.log(error);
        alert('エラーが発生しました');
        location.href = '/pages/account';
      })
    }
  }

  const editRouter = () => {
    router.push('/pages/edit');
  }

  const handleShowDetail = (productId) => {
    router.push(`/pages/product/${productId}`);
  }

  if (isLoading) {
    return (
      <>
      </>
    )
  }

  if (error) {
    const errorMessage = 'セッションが切れています。再度ログインしてください。';
    alert(errorMessage);
    location.href = '/';
  }

  if (data) {
    return (
      <div>
        <div className={styles.accountInformation}>
          <h2 className={styles.accountHeader}>
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
              <div key={product.id} className={styles.product}>
                <div className={styles2.product}>
                  <div className={styles2.information}>
                    <div className={styles2.title} onClick={() => handleShowDetail(product.id)}>{product.title}</div>
                    <div>種類: {product.type}</div>
                    <div>投稿日時: {new Date(product.updated_at).toLocaleString()}</div>
                  </div>
                  <div className={styles.imageContainer}>
                    <picture>
                      <img src={product.photo} width="200" height="auto" alt={product.title} />
                    </picture>
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
