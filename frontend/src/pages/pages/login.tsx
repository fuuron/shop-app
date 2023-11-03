import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Login = () => {

  const { data: data, error, isLoading } = useSWR('http://localhost/api/user', () =>
  http.get('http://localhost/api/user').then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    try {
      http.get('/sanctum/csrf-cookie');

      const response = await http.post('/api/login', data);
      console.log(response);

      const responseData = response.data;
      console.log(responseData);

      if (responseData.accountPageUrl) {
        location.href = responseData.accountPageUrl;
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data;
      console.error('エラーレスポンス:', errorResponseData);
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
    return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {errorResponseData && (
          <div className={styles.serverErrorTopMessage}>
            {errorResponseData}
          </div>
        )}

        <div className={styles.formContent}>
          <div className={styles.formTitle}>email</div>
          <input className={styles.input} type='email' {...register('email', { required: true })} />
          {errors.email && <div className={styles.emptyErrorMessage}>emailを入力してください</div>}

          <div className={styles.formOtherTitle}>パスワード</div>
          <input className={styles.input} type='password' {...register('password', { required: true })} />
          {errors.password && <div className={styles.emptyErrorMessage}>パスワードを入力してください</div>}
        </div>

        <button className={styles.submit} type='submit'>ログイン</button>
      </form>
    )
  }

  if (data) {
    const errorMessage = '既にログインしています。';
    alert(errorMessage);
    location.href = 'http://localhost:3000/pages/account';
  }
}

export default Login;
