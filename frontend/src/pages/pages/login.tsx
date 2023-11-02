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
  
        <div>
          <label>email</label>
          <input {...register('email', { required: true })} />
          {errors.email && <span>emailを入力してください</span>}
        </div>
  
        {errorResponseData && (
          <div className='error-message'>
            {errorResponseData}
          </div>
        )}
  
        <div>
          <label>パスワード</label>
          <input type='password' {...register('password', { required: true })} />
          {errors.password && <span>パスワードを入力してください</span>}
        </div>
  
        <button type='submit'>ログイン</button>
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
