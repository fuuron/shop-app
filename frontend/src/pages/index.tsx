import router from 'next/router'
import useSWR from 'swr'
import { axiosCreate } from '../components/function'

const Index = () => {

    const { data: data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, () =>
      axiosCreate().get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`).then((res) => res.data),
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
      router.push('pages/products');
    }
  
    if (error) {
      router.push('pages/login');
    }
}

export default Index;
