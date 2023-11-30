import styles from '../../styles/login.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { axiosCreate } from '../../components/function'
import BeatLoader from 'react-spinners/BeatLoader'

const Login = () => {

  const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
    axiosCreate().get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  )

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorResponseData, setErrorResponseData] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setRequestLoading(true);
      await axiosCreate().get('/sanctum/csrf-cookie');
      const response = await axiosCreate().post('/api/login', data);
      // console.log(response);
      const responseData = response.data;
      // console.log(responseData);

      if (responseData.accountPageUrl) {
        location.href = '/';
      }
    } catch (error) {
      if (error.response.status === 419) {
        const errorMessage = 'エラーが発生しました。再度ログインしてください。';
        alert(errorMessage);
        location.href = '/';
      }
      // console.error('エラーが発生しました:', error);
      const errorResponseData = error.response.data;
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
    location.href = '/';
  }
}

export default Login;
