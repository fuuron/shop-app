import styles from '../../styles/products.module.css'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Products = () => {

  const { data: products, error, isLoading } = useSWR('http://localhost/api/products', () =>
    http.get('http://localhost/api/products').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

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

  if (products) {
    return (
      <div className={styles.main}>
        <h1>商品一覧</h1>
        <div className={styles.products}>
          {products.map((product) => (
            <div className={styles.product} key={product.id}>
              <div className={styles.information}>
                <div className={styles.title} onClick={() => handleShowDetail(product.id)}>{product.title}</div>
                <div>投稿者: {product.user_name}</div>
                <div>種類: {product.type}</div>
                <div>投稿日時: {new Date(product.updated_at).toLocaleString()}</div>
              </div>
              <div className={styles.imageContainer}>
                <img src={product.photo} width="200" height="auto" alt={product.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Products;
