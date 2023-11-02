import styles from '../../styles/purchaseHistory.module.css'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create ({
  baseURL: 'http://localhost',
  withCredentials: true
})

const SellHistory = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/sellHistory', () =>
    http.get('http://localhost/api/sellHistory').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  console.log(data);

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
    const errorMessage = 'セッションが切れています。再度ログインしてください。';
    alert(errorMessage);
    location.href = 'http://localhost:3000/pages/login';
  }

  if (data.userSelledHistories && data.userSelledHistories.length) {
    return (
      <div className={styles.container}>
        <h1>販売履歴</h1>
        {data.userSelledHistories.map((userSelledHistory) => (
          <div key={userSelledHistory.id} className={styles.purchaseHistory}>
            <div className={styles.productInformation}>
              <div onClick={() => handleShowDetail(userSelledHistory.product.id)}>
                商品：<span className={styles.productTitle}>{userSelledHistory.product.title}</span>
              </div>
              <div>販売先：{userSelledHistory.seller_user_name}様</div>
              <div>販売日時：{new Date(userSelledHistory.created_at).toLocaleString()}</div>
            </div>
            <div className={styles.address}>
              <div className={styles.receiveAddress}>お届け先住所</div>
              <div>
                <div>お届け先：{userSelledHistory.address.block_number} {userSelledHistory.address.prefecture}</div>
                <div>市区町村：{userSelledHistory.address.municipality} 番地：{userSelledHistory.address.postal_code}</div>
                <div>建物名・部屋番号：{userSelledHistory.address.building_and_room}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div className={styles.purchasesNotFound}>
        販売履歴はありません
      </div>
    )
  }
}

export default SellHistory;
