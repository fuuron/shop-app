import axios from 'axios'

export function axiosCreate() {
  return axios.create ({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    withCredentials: true
  })
}

export function unauthorized() {
  const errorMessage = 'セッションが切れています。再度ログインしてください。';
  alert(errorMessage);
  location.href = '/';
}
