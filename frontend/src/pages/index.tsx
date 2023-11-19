import router from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
    baseURL: 'http://localhost',
    withCredentials: true
})

const Index = () => {

    const { data: data, error, isLoading } = useSWR('http://localhost/api/user', () =>
    http.get('http://localhost/api/user').then((res) => res.data),
      {
        shouldRetryOnError: false,
        revalidateOnFocus: false
      }
    )
  
    if (isLoading) {
      return (
        <>
        </>
      )
    }

    if (data) {
      location.href = 'http://localhost:3000/pages/products';
    }
  
    if (error) {
      location.href = 'http://localhost:3000/pages/login';
    }
}

export default Index;
