import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Register = () => {

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
      await http.get('/sanctum/csrf-cookie');
      const response = await http.post('/api/register', data);
      const responseData = response.data;
      console.log(responseData);
      
      if (responseData.LoginPageUrl) {
        router.push(responseData.LoginPageUrl);
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
          <label>ユーザー名</label>
          <input {...register('name', { required: true })} />
          {errors.name && <span>ユーザー名を入力してください</span>}
        </div>
  
        <div>
          <label>email</label>
          <input {...register('email', { required: true })} />
          {errors.email && <span>emailを入力してください</span>}
        </div>
        
        {errorResponseData && (
          <div className='error-message'>
            {errorResponseData.errors}
          </div>
        )}
  
        <div>
          <label>パスワード</label>
          <input type='password' {...register('password', { required: true })} />
          {errors.password && <span>パスワードを入力してください</span>}
        </div>
  
        <button type='submit'>新規登録</button>
      </form>
    )
  }

  if (data) {
    const errorMessage = '既にログインしています。';
    alert(errorMessage);
    location.href = 'http://localhost:3000/pages/account';
  }
}

export default Register;
