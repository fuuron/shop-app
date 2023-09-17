import { useState } from 'react';
import { useForm } from 'react-hook-form'
import styles from '../../styles/login.module.css'
import router from 'next/router'
import Layout from '../../components/layout';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const response = await fetch('http://localhost/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);

        if (responseData.LoginPageUrl) {
          router.push(responseData.LoginPageUrl);
        }

      } else {
        const errorResponseData = await response.json();
        console.error('エラーレスポンス:', errorResponseData);
        setErrorResponseData(errorResponseData);
      }
    
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  return (
    <Layout>
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
          <div className="error-message">
            {errorResponseData.email && errorResponseData.email[0]}
          </div>
        )}

        <div>
          <label>パスワード</label>
          <input type="password" {...register('password', { required: true })} />
          {errors.password && <span>パスワードを入力してください</span>}
        </div>

        <button type="submit">新規登録</button>
      </form>
    </Layout>
  );
};

export default Register;
