import axios from 'axios'
import useSWR from 'swr'

const http = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    withCredentials: true
})

const Index = () => {

    const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
    http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
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
      // location.href = '/pages/products';
    }
  
    if (error) {
      // location.href = '/pages/login';
    }
}

export default Index;
