import Link from "next/link"
import styles from '../styles/Home.module.css'

export default function ProductsList () {
    return (
        <main className={styles.main}>
            <h2 className={styles.title}>example</h2>
            <ul>
                <li>
                    <Link href="/pages">
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
    );
}
