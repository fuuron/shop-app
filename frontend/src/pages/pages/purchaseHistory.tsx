import styles from '../../styles/purchaseHistory.module.css'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create ({
  baseURL: 'http://localhost',
  withCredentials: true
})

const PurchaseHistory = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/purchaseHistory', () =>
    http.get('http://localhost/api/purchaseHistory').then((res) => res.data),
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
    const errorMessage = 'セッションが切れました。再度ログインしてください。';
    alert(errorMessage);
    location.href = 'http://localhost:3000/pages/login';
  }

  if (data.userPurchasedHistories && data.userPurchasedHistories.length) {
    return (
      <div className={styles.container}>
        <h1>購入履歴</h1>
        {data.userPurchasedHistories.map((userPurchasedHistory) => (
          <div key={userPurchasedHistory.id} className={styles.purchaseHistory}>
            <div className={styles.productInformation}>
              <div onClick={() => handleShowDetail(userPurchasedHistory.product.id)}>
                商品：<span className={styles.productTitle}>{userPurchasedHistory.product.title}</span>
              </div>
              <div>購入先：{userPurchasedHistory.seller_user_name}様</div>
              <div>購入日時：{new Date(userPurchasedHistory.created_at).toLocaleString()}</div>
            </div>
            <div className={styles.address}>
              <div className={styles.receiveAddress}>受け取り住所</div>
              <div>
                <div>受取先：{userPurchasedHistory.address.block_number} {userPurchasedHistory.address.prefecture}</div>
                <div>市区町村：{userPurchasedHistory.address.municipality} 番地：{userPurchasedHistory.address.postal_code}</div>
                <div>建物名・部屋番号：{userPurchasedHistory.address.building_and_room}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div className={styles.purchasesNotFound}>
        購入履歴はありません
      </div>
    )
  }
}

export default PurchaseHistory;
