import styles from '../../styles/products.module.css'
import React, { useEffect, useState } from 'react'
import router from 'next/router'
import useSWR from 'swr'
import { axiosCreate, unauthorized } from '../../components/function'
import BeatLoader from 'react-spinners/BeatLoader'

const Products = () => {

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, () =>
    axiosCreate().get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  // console.log(data);

  const handleShowDetail = (productId) => {
    router.push(`/pages/product/${productId}`);
  }

  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favoriteCounts, setFavoriteCounts] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);

  const toggleFavorite = (productId) => {
    if (favoriteProducts.includes(productId)) {
      RemoveFavorite(productId);
    } else {
      AddFavorite(productId);
    }
  }

  async function AddFavorite(productId) {
    try {
      setRequestLoading(true);
      await axiosCreate().get('/sanctum/csrf-cookie');
      const response = await axiosCreate().post('/api/favorite/add', { product_id: productId });
  
      if (response.data) {
        setFavoriteProducts([...favoriteProducts, productId]);
        // console.log(response.data);
        setFavoriteCounts((prevCounts) => ({
          ...prevCounts,
          [productId]: (prevCounts[productId] || 0) + 1,
        }));
      }
    } catch (error) {
      if (error.response.status === 401) {
        unauthorized();
      }
      // console.error('Failed to add favorite:', error);
    } finally {
      setRequestLoading(false);
    }
  }

  async function RemoveFavorite(productId) {
    try {
      setRequestLoading(true);
      await axiosCreate().get('/sanctum/csrf-cookie');
      const response = await axiosCreate().post(`api/favorite/remove/${productId}`, { product_id: productId });
  
      if (response.data) {
        setFavoriteProducts(favoriteProducts.filter((id) => id !== productId));
        // console.log(response.data);
        setFavoriteCounts((prevCounts) => ({
          ...prevCounts,
          [productId]: (prevCounts[productId] || 0) - 1,
        }));
      }
    } catch (error) {
      if (error.response.status === 401) {
        unauthorized();
      }
      // console.error('Failed to remove favorite:', error);
    } finally {
      setRequestLoading(false);
    }
  }

  useEffect(() => {
    if (data) {
      const favoriteIds = data.favorites.map((favorite) => favorite.product_id);
      setFavoriteProducts(favoriteIds);
      setFilteredProducts(data.products);
      setFavoriteCounts(data.favoriteCounts);
    }
  }, [data]);

  const handleFilterCategory = (category) => {
    const filteredProducts = data.products.filter((product) => product.type === category);
    setFilteredProducts(filteredProducts);
  }
  
  if (isLoading) {
    return (
      <>
      </>
    )
  }

  if (error) {
    unauthorized();
  }

  if (data.products && data.products.length > 0) {
    return (
      <div className={styles.main}>
        {requestLoading &&
          <div className='beatLoader'>
            <BeatLoader />
          </div>
        }
        
        <h1 className={styles.h1Header}>商品一覧</h1>

        <div className={styles.productsFilterButtons}>
          <button onClick={() => handleFilterCategory('メダカ')}>メダカ</button>
          <button onClick={() => handleFilterCategory('水槽')}>水槽</button>
          <button onClick={() => handleFilterCategory('エサ')}>エサ</button>
        </div>

        <div className={styles.products}>
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <div className={styles.product}>
                <div className={styles.information}>
                  <div className={styles.title} onClick={() => handleShowDetail(product.id)}>{product.title}</div>
                  <div>投稿者: {product.user_name}</div>
                  <div>種類: {product.type}</div>
                  <div>投稿日時: {new Date(product.updated_at).toLocaleString()}</div>
                </div>
                <div className={styles.imageContainer}>
                  <picture className={styles.picture}>
                    <img src={product.photo} style={{ maxHeight: "120px", maxWidth: "210px" }} alt={product.title} />
                  </picture>
                </div>
              </div>

              {data.authUserId === product.user_id ? (
                <div className={styles.ownProductMessage}>
                  自分の投稿です
                </div>
              ) : (
                <div className={styles.favoriteButton}>
                  <button className={favoriteProducts.includes(product.id) ? `${styles.favorited}` : ''} onClick={() => toggleFavorite(product.id)}>
                    {favoriteProducts.includes(product.id) ? '気になる済み：' : '気になる：'}
                    {favoriteCounts[product.id]}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.productsNotFound}>
        投稿された商品がありません
      </div>
    )
  }
}

export default Products;
