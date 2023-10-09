import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import router from 'next/router'
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost',
  withCredentials: true
})

const Post = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData(); // FormDataオブジェクトを定義する
    formData.append('title', data.title);
    formData.append('type', data.type); // 種類の値を追加
    formData.append('detail', data.detail);
    formData.append('photo', data.photo[0]);
    console.log(formData);
    console.log(data);

    try {
      await http.get('/sanctum/csrf-cookie');
      const response = await http.post('/api/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const responseData = response.data;
      console.log(responseData);
      
      if (responseData.productsPageUrl) {
        router.push(responseData.productsPageUrl);
      }
      
    } catch (error) {
      console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data;
      console.error('エラーレスポンス:', errorResponseData);
      setErrorResponseData(errorResponseData);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>タイトル</label>
        <input {...register('title', { required: true })} />
        {errors.title && <span>タイトル名を入力してください</span>}
      </div>

      {errorResponseData && (
        <div className='error-message'>
          {errorResponseData.errors.title}
        </div>
      )}

      <div>
        <label>種類</label>
        <select {...register('type', { required: true })}>
          <option value="">選択してください</option>
          <option value="メダカ">メダカ</option>
          <option value="水槽">水槽</option>
          <option value="エサ">エサ</option>
        </select>
        {errors.type && <span>種類を選択してください</span>}
      </div>

      <div>
        <label>説明</label>
        <input {...register('detail', { required: true })} />
        {errors.detail && <span>説明を入力してください</span>}
      </div>

      {errorResponseData && (
        <div className='error-message'>
          {errorResponseData.errors.detail}
        </div>
      )}

      <div>
        <label>商品写真</label>
        <input type="file" {...register('photo')} accept="image/*" />
      </div>

      {errorResponseData && (
        <div className='error-message'>
          {errorResponseData.errors.photo}
        </div>
      )}

      <button type='submit'>商品登録</button>
    </form>
  )
}

export default Post;
