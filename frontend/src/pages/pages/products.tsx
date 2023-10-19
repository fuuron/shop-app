import styles from '../../styles/products.module.css'
import React, { useEffect, useState } from 'react';
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Products = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/products', () =>
    http.get('http://localhost/api/products').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  console.log(data);

  const handleShowDetail = (productId) => {
    router.push(`http://localhost:3000/pages/product/${productId}`);
  }

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const toggleFavorite = (productId) => {
    if (favoriteProducts.includes(productId)) {
      RemoveFavorite(productId);
    } else {
      AddFavorite(productId);
    }
  }

  async function AddFavorite(productId) {
    try {
      await http.get('/sanctum/csrf-cookie');
      const response = await http.post('/api/favorite/add', { product_id: productId });
  
      if (response.data) {
        setFavoriteProducts([...favoriteProducts, productId]);
        console.log(response.data.success);
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  }

  async function RemoveFavorite(productId) {
    try {
      await http.get('/sanctum/csrf-cookie');
      const response = await http.post(`api/favorite/remove/${productId}`, { product_id: productId });
  
      if (response.data) {
        setFavoriteProducts(favoriteProducts.filter((id) => id !== productId));
        console.log(response.data.success);
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }

  useEffect(() => {
    if (data) {
      const favoriteIds = data.favorites.map((favorite) => favorite.product_id);
      setFavoriteProducts(favoriteIds);
    }
  }, [data]);
  
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

  if (data.products) {
    return (
      <div className={styles.main}>
        <h1>商品一覧</h1>
        <div className={styles.products}>
          {data.products.map((product) => (
            <div key={product.id}>
              <div className={styles.product}>
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

              <div className={styles.favoriteButton}>
                <button className={favoriteProducts.includes(product.id) ? `${styles.favorited}` : ''} onClick={() => toggleFavorite(product.id)}>
                  {favoriteProducts.includes(product.id) ? '気になる済み' : '気になる'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Products;
