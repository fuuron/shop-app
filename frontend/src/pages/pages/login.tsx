import { useForm } from 'react-hook-form'
import styles from '../../styles/login.module.css'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>ユーザー名</label>
        <input {...register('username', { required: true })} />
        {errors.username && <span>ユーザー名を入力してください</span>}
      </div>

      <div>
        <label>email</label>
        <input {...register('email', { required: true })} />
        {errors.username && <span>emailを入力してください</span>}
      </div>

      <div>
        <label>パスワード</label>
        <input type="password" {...register('password', { required: true })} />
        {errors.password && <span>パスワードを入力してください</span>}
      </div>

      <button type="submit">ログイン</button>
    </form>
  );
};

export default Login;