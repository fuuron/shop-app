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

const Edit = () => {

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  // console.log(data);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    try {
      await http.get('/sanctum/csrf-cookie');
      const response = await http.put('/api/edit', data);
      const responseData = response.data;
      // console.log(responseData);
      
      if (responseData.accountPageUrl) {
        location.href = '/';
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
        {errorResponseData && (
          <div className={styles.serverErrorTopMessage}>
            {errorResponseData}
          </div>
        )}

        <div className={styles.formContent}>
          <div className={styles.formTitle}>ユーザー名</div>
          <input 
            className={styles.input}
            type='name'
            {...register('name', { required: true })}
            defaultValue={data.name}
          />
          {errors.name && <div className={styles.emptyErrorMessage}>ユーザー名を入力してください</div>}

          <div className={styles.formOtherTitle}>email</div>
          <input 
            className={styles.input}
            type='email'
            {...register('email', { required: true })}
            defaultValue={data.email}
          />
          {errors.email && <div className={styles.emptyErrorMessage}>emailを入力してください</div>}

          <div className={styles.formOtherTitle}>パスワード</div>
          <input className={styles.input} type='password' {...register('password', { required: true })} />
          {errors.password && <div className={styles.emptyErrorMessage}>パスワードを入力してください</div>}
        </div>

        <button className={styles.submit} type='submit'>編集</button>
      </form>
    )
  }
}

export default Edit;
