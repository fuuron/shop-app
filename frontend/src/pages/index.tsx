import styles from '../styles/Home.module.css'
import Layout from '../components/layout'
import Link from 'next/link'

export default function ProductsList () {
    return (
        <Layout>
            <main className={styles.main}>
                <h2 className={styles.title}>example</h2>
                <ul>
                    <li>
                        <Link href="/">
                            example1
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            example2
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            example3
                        </Link>
                    </li>
                </ul>
            </main>
        </Layout>
    )
}
