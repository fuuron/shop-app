import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true
})

const Post = () => {

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('detail', data.detail);
    formData.append('photo', data.photo[0]);
    // console.log(formData);
    // console.log(data);

    try {
      await http.get('/sanctum/csrf-cookie');
      const response = await http.post('/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const responseData = response.data;
      // console.log(responseData);
      
      if (responseData.productsPageUrl) {
        router.push(responseData.productsPageUrl);
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
    const errorMessage = 'セッションが切れました。再度ログインしてください。';
    alert(errorMessage);
    location.href = '/';
  }

  if (data) {
    return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formContent}>

          <div className={styles.formTitle}>タイトル</div>
          <input className={styles.input} type='title' {...register('title', { required: true })} />
          {errors.title && <div className={styles.emptyErrorMessage}>タイトル名を入力してください</div>}
          {errorResponseData && (
            <div className={styles.serverErrorMessage}>
              {errorResponseData.title}
            </div>
          )}

          <div className={styles.formOtherTitle}>種類</div>
          <select className={styles.inputType} {...register('type', { required: true })}>
            <option value="">選択してください</option>
            <option value="メダカ">メダカ</option>
            <option value="水槽">水槽</option>
            <option value="エサ">エサ</option>
          </select>
          {errors.type && <div className={styles.emptyErrorMessage}>種類を選択してください</div>}

          <div className={styles.formOtherTitle}>説明</div>
          <textarea className={styles.inputDetail} {...register('detail', { required: true })} />
          {errors.detail && <div className={styles.emptyErrorMessage}>説明を入力してください</div>}
          {errorResponseData && (
            <div className={styles.serverErrorMessage}>
              {errorResponseData.detail}
            </div>
          )}
          
          <div className={styles.formOtherTitle}>商品写真</div>
          <div>
            <label htmlFor='fileInput' className='custom-file-upload'>
              <input
                type='file' {...register('photo', { required: true })}
                id='fileInput'
                style={{ display: 'none' }}
                accept='image/*'
              />
              <div className={styles.selectFile}>ファイルを選択</div>
            </label>
          </div>
          {errors.photo && <div className={styles.emptyErrorMessage}>写真を選択してください</div>}
          {errorResponseData && (
            <div className={styles.serverErrorMessage}>
              {errorResponseData.photo}
            </div>
          )}
          
        </div>
        <button className={styles.submit} type='submit'>商品投稿</button>
      </form>
    )
  }
}

export default Post;
