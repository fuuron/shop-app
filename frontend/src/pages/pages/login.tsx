import styles from '../../styles/login.module.css'
import Layout from '../../components/layout'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import router from 'next/router'
import axios from 'axios'
import AcccountPage from './account'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    try {
      // 1. CSRF トークンを取得
      http.get('/sanctum/csrf-cookie');
  
      // 2. データを送信
      const response = await http.post('/api/login', data);
      console.log(response);
  
      // 3. レスポンスを処理
      const responseData = response.data;
      console.log(responseData);
  
      if (responseData.accountPageUrl) {
        router.push(responseData.accountPageUrl);
      }
      
    } catch (error) {
      console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data;
      console.error('エラーレスポンス:', errorResponseData);
      setErrorResponseData(errorResponseData);
    }
  }

  return (
    <Layout>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

        {/* <div>
          <label>ユーザー名</label>
          <input {...register('name', { required: true })} />
          {errors.name && <span>ユーザー名を入力してください</span>}
        </div> */}

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
    </Layout>
  )
}

export default Login;
