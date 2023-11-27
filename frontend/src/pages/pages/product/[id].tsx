import styles from '../../../styles/productDetail.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true
})

const ProductDetail = () => {
  const router = useRouter();
  const productId = router.query.id;

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);
  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/showDetail/${productId}`, () =>
    http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/showDetail/${productId}`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const handleDestroy = () => {
    const isConfirmed = window.confirm('本当に削除しますか？');

    if (isConfirmed) {
      http.delete(`/api/product/${productId}`).then((res) => {
        // console.log(res);
        location.href = '/';
      })
    }
  }

  const onSubmit = async (data) => {
    try {
      await http.get('/sanctum/csrf-cookie');
      const response = await http.post(`/api/commentPost/${productId}`, data);
      const responseData = response.data;
      // console.log(responseData);
      
      if (responseData.showDetailPageUrl) {
        location.href = '/';
        // router.push(responseData.showDetailPageUrl);
      }
      
    } catch (error) {
      // console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data.errors;
      // console.error('エラーレスポンス:', errorResponseData);
      setErrorResponseData(errorResponseData);
    }
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
      <div className={styles.productDetail}>
        <div className={styles.productContainer}>
          <h1 className={styles.productTitle}>{data.product.title}</h1>
          <div className={styles.information}>
            <p>投稿者: {data.product.user_name}</p>
            <p>種類: {data.product.type}</p>
            <p className={styles.breakWords}>詳細: {data.product.detail}</p>
          </div>
          <div className={styles.imageContainer}>
            <picture>
              <img src={data.product.photo} width="400" height="auto" alt={data.product.title} />
            </picture>
          </div>
        </div>
        
        {data.user_id === data.product.user_id && data.productPurchased === 'false' && (
          <div className={styles.postDelate} onClick={handleDestroy}>
            投稿を削除する
          </div>
        )}

        {data.user_id === data.product.user_id && data.productPurchased === 'true' && (
          <div className={styles.postPurchased}>
            この商品は購入されました
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={styles.commentsArea}>コメント＆質問欄</h2>
          <div>
            <div className={styles.doComments}>＜コメントする＞</div>
            <input className={styles.commentsInput} {...register('text', { required: true })} />
            {errors.text && <div className={styles.commentErrorMessage}>テキストを入力してください</div>}
          </div>

          {errorResponseData && (
            <div className={styles.commentErrorMessage}>
              {errorResponseData.text}
            </div>
          )}
          
          <button type='submit' className={styles.customButton}>投稿</button>
        </form>
        
        <div className={styles.productComments}>
          {data.comments.length === 0 ? (
            <div className={styles.commentNotFound}>コメントはありません</div>
          ) : (
            data.comments.slice().reverse().map(comment => (
              <div key={comment.id} className={styles.commentInformation}>
                {data.product.user_id === comment.user_id ? (
                  <div className={styles.productOwnerComment}>
                    <div className={styles.user}>投稿者: {comment.user_name}</div>
                    <div className={styles.commentOwner}>
                      <div className={styles.commentText}>
                        {comment.text}
                      </div>
                    </div>
                    <div className={styles.createdAt}>Created At: {new Date(comment.updated_at).toLocaleString()}</div>
                  </div>
                ) : (
                  <>
                    <div className={styles.user}>ユーザー: {comment.user_name}</div>
                    <div className={styles.comment}>
                      <div className={styles.commentText}>
                        {comment.text}
                      </div>
                    </div>
                    <div className={styles.createdAt}>Created At: {new Date(comment.updated_at).toLocaleString()}</div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }
}

export default ProductDetail;
