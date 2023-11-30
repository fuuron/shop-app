import styles from '../../../styles/productDetail.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { axiosCreate, unauthorized } from '../../../components/function'
import BeatLoader from 'react-spinners/BeatLoader'

const ProductDetail = () => {
  const router = useRouter();
  const productId = router.query.id;

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/showDetail/${productId}`, () =>
    axiosCreate().get(`${process.env.NEXT_PUBLIC_API_URL}/api/showDetail/${productId}`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const handleDestroy = () => {
    const isConfirmed = window.confirm('本当に削除しますか？');

    if (isConfirmed) {
      axiosCreate().delete(`/api/product/${productId}`).then((res) => {
        // console.log(res);
        router.push('/pages/products');
      })
    }
  }

  const onSubmit = async (data) => {
    try {
      setRequestLoading(true);
      await axiosCreate().get('/sanctum/csrf-cookie');
      const response = await axiosCreate().post(`/api/commentPost/${productId}`, data);
      const responseData = response.data;
      // console.log(responseData);
      
      if (responseData.showDetailPageUrl) {
        location.href= '/';
      }
      
    } catch (error) {
      if (error.response.status === 401) {
        unauthorized();
      }
      // console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data.errors;
      // console.error('エラーレスポンス:', errorResponseData);
      setErrorResponseData(errorResponseData);
    } finally {
      setRequestLoading(false);
    }
  }

  if (isLoading) {
    return (
      <>
      </>
    )
  }

  if (error) {
    const errorMessage = 'エラーが発生しました。';
    alert(errorMessage);
    location.href = '/';
  }

  if (data) {
    return (
      <div className={styles.productDetail}>
        {requestLoading &&
          <div className='beatLoader'>
            <BeatLoader />
          </div>
        }
        
        <div className={styles.productContainer}>
          <h1 className={styles.productTitle}>{data.product.title}</h1>
          <div className={styles.information}>
            <p>投稿者: {data.product.user_name}</p>
            <p>種類: {data.product.type}</p>
            <p className={styles.breakWords}>詳細: {data.product.detail}</p>
          </div>
          <div className={styles.imageContainer}>
            <picture>
              <img src={data.product.photo} style={{ maxHeight: "220px", maxWidth: "500px" }} alt={data.product.title} />
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
