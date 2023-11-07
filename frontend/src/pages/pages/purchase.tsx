import styles from '../../styles/purchase.module.css'
import styles2 from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create ({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Purchase = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/checkoutPage', () =>
    http.get('http://localhost/api/checkoutPage').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  console.log(data);

  const handleShowDetail = (productId) => {
    router.push(`http://localhost:3000/pages/product/${productId}`);
  }

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    const isConfirmed = window.confirm('商品を購入します。よろしいですか？');

    if (isConfirmed) {
      try {
        await http.get('/sanctum/csrf-cookie');
        const response = await http.post('/api/purchase', data);
        const responseData = response.data;
        console.log(responseData);
        router.push('http://localhost:3000/pages/purchaseHistory');
      } catch (error) {
        console.error('エラーが発生しました:', error);
        const errorResponseData = error.response.data.errors;
        if (errorResponseData) {
          setErrorResponseData(errorResponseData);
        } else {
          alert('購入できませんでした。再度読み込んでください。');
          router.push('http://localhost:3000/pages/products');
        }
      }
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
    location.href = 'http://localhost:3000/pages/login';
  }

  if (data.products && data.products.length > 0) {
    return (
      <div className={styles.container}>
        <h2>以下の商品を購入します</h2>
        <div className={styles.products}>
          {data.products.map((product) => (
            <div key={product.id}>
              <div className={styles.productTitle} onClick={() => handleShowDetail(product.id)}>
                {product.title}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.productsLength}>以上  {data.products.length}点</div>

        <form className={styles2.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.addressFormTitle}>お届け先を入力してください</div>
          <div className={styles2.formContent}>
            <div className={styles2.formTitle}>郵便番号 (数字のみ)</div>
            <input className={styles2.input} type='text' {...register('postal_code', { required: true })} />
            {errors.postal_code && <div className={styles2.emptyErrorMessage}>郵便番号を入力してください</div>}
            {errorResponseData && (
              <div className={styles2.serverErrorMessage}>
                {errorResponseData.postal_code}
              </div>
            )}
            
            <div className={styles2.formOtherTitle}>都道府県</div>
            <select className={styles2.inputType} {...register('prefecture', { required: true })}>
            <option value="">選択してください</option>
              <optgroup label="北海道地方">
                <option value="北海道">北海道</option>
              </optgroup>
              <optgroup label="東北地方">
                <option value="青森県">青森県</option>
                <option value="岩手県">岩手県</option>
                <option value="宮城県">宮城県</option>
                <option value="秋田県">秋田県</option>
                <option value="山形県">山形県</option>
                <option value="福島県">福島県</option>
              </optgroup>
              <optgroup label="関東地方">
                <option value="茨城県">茨城県</option>
                <option value="栃木県">栃木県</option>
                <option value="群馬県">群馬県</option>
                <option value="埼玉県">埼玉県</option>
                <option value="千葉県">千葉県</option>
                <option value="東京都">東京都</option>
                <option value="神奈川県">神奈川県</option>
              </optgroup>
              <optgroup label="中部地方">
                <option value="新潟県">新潟県</option>
                <option value="富山県">富山県</option>
                <option value="石川県">石川県</option>
                <option value="福井県">福井県</option>
                <option value="山梨県">山梨県</option>
                <option value="長野県">長野県</option>
                <option value="岐阜県">岐阜県</option>
                <option value="静岡県">静岡県</option>
                <option value="愛知県">愛知県</option>
              </optgroup>
              <optgroup label="関西地方">
                <option value="三重県">三重県</option>
                <option value="滋賀県">滋賀県</option>
                <option value="京都府">京都府</option>
                <option value="大阪府">大阪府</option>
                <option value="兵庫県">兵庫県</option>
                <option value="奈良県">奈良県</option>
                <option value="和歌山県">和歌山県</option>
              </optgroup>
              <optgroup label="中国地方">
                <option value="鳥取県">鳥取県</option>
                <option value="島根県">島根県</option>
                <option value="岡山県">岡山県</option>
                <option value="広島県">広島県</option>
                <option value="山口県">山口県</option>
              </optgroup>
              <optgroup label="四国地方">
                <option value="徳島県">徳島県</option>
                <option value="香川県">香川県</option>
                <option value="愛媛県">愛媛県</option>
                <option value="高知県">高知県</option>
              </optgroup>
              <optgroup label="九州地方">
                <option value="福岡県">福岡県</option>
                <option value="佐賀県">佐賀県</option>
                <option value="長崎県">長崎県</option>
                <option value="熊本県">熊本県</option>
                <option value="大分県">大分県</option>
                <option value="宮崎県">宮崎県</option>
                <option value="鹿児島県">鹿児島県</option>
              </optgroup>
              <optgroup label="沖縄地方">
                <option value="沖縄県">沖縄県</option>
              </optgroup>
            </select>
            {errors.prefecture && <div className={styles2.emptyErrorMessage}>種類を選択してください</div>}
            
            <div className={styles2.formOtherTitle}>市区町村</div>
            <input className={styles2.input} type='text'  {...register('municipality', { required: true })} />
            {errors.municipality && <div className={styles2.emptyErrorMessage}>市区町村を入力してください</div>}
            {errorResponseData && (
              <div className={styles2.serverErrorMessage}>
                {errorResponseData.municipality}
              </div>
            )}

            <div className={styles2.formOtherTitle}>番地</div>
            <input className={styles2.input} type='text'  {...register('block_number', { required: true })} />
            {errors.block_number && <div className={styles2.emptyErrorMessage}>番地を入力してください</div>}
            {errorResponseData && (
              <div className={styles2.serverErrorMessage}>
                {errorResponseData.block_number}
              </div>
            )}

            <div className={styles2.formOtherTitle}>建物名・部屋番号</div>
            <input className={styles2.input} type='text'  {...register('building_and_room', { required: true })} />
            {errors.building_and_room && <div className={styles2.emptyErrorMessage}>建物名・部屋番号を入力してください</div>}
            {errorResponseData && (
              <div className={styles2.serverErrorMessage}>
                {errorResponseData.building_and_room}
              </div>
            )}
          </div>
          
          <button className={styles2.submit} type='submit'>商品購入</button>
        </form>
      </div>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

export default Purchase;
