import styles from '../../../styles/productDetail.module.css'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const ProductDetail = () => {
  const router = useRouter();
  const productId = router.query.id;

  const { data: data, error, isLoading } = useSWR(`http://localhost/api/showDetail/${productId}`, () =>
    http.get(`http://localhost/api/showDetail/${productId}`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  console.log(data);

  const handleEdit = () => {
    // 編集のロジックをここに追加
    console.log('Edit clicked');
  }

  const handleDelete = () => {
    // 削除のロジックをここに追加
    console.log('Delete clicked');
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
      <div className={styles.product}>
        <div className={styles.container}>
          <h1>{data.product.title}</h1>
          <p>投稿者: {data.product.user_name}</p>
          <p>種類: {data.product.type}</p>
          <p className={styles.breakWords}>詳細: {data.product.detail}</p>
          <div className={styles.imageContainer}>
            <img src={data.product.photo} width="400" height="auto" alt={data.product.title} />
          </div>
        </div>
        
        {data.user_id === data.product.user_id && (
          <div className={styles.postDelate} onClick={handleDelete}>
            削除
          </div>
        )}
      </div>
    )
  }
}

export default ProductDetail;
