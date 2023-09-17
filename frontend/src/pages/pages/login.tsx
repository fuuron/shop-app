import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../../styles/login.module.css'
import router from 'next/router'
import Layout from '../../components/layout'
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true,
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    try {
      // 1. CSRF トークンを取得
      await axios.get('http://localhost/sanctum/csrf-cookie', { withCredentials: true });
  
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
  };

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
          <div className="error-message">
            {errorResponseData}
          </div>
        )}

        <div>
          <label>パスワード</label>
          <input type="password" {...register('password', { required: true })} />
          {errors.password && <span>パスワードを入力してください</span>}
        </div>

        <button type="submit">ログイン</button>
      </form>
    </Layout>
  );
};

export default Register;
