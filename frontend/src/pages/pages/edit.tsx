import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { axiosCreate, unauthorized } from '../../components/function'
import BeatLoader from 'react-spinners/BeatLoader'

const Edit = () => {

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
    axiosCreate().get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  // console.log(data);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setRequestLoading(true);
      await axiosCreate().get('/sanctum/csrf-cookie');
      const response = await axiosCreate().put('/api/edit', data);
      const responseData = response.data;
      // console.log(responseData);
      
      if (responseData.accountPageUrl) {
        location.href = '/';
      }
      
    } catch (error) {
      if (error.response.status === 401) {
        unauthorized();
      }
      // console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data.errors;
      // console.error('エラーレスポンス:', errorResponseData);
      setErrorResponseData(errorResponseData);
    } finally {
      setRequestLoading(false);
    }
  }

  if (isLoading) {
    return (
      <>
      </>
    )
  }

  if (error) {
    unauthorized();
  }

  if (data) {
    return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {requestLoading &&
          <div className='beatLoader'>
            <BeatLoader />
          </div>
        }
        
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
