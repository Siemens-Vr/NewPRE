"use client"

import Link from 'next/link'
import styles from '@/app/styles/sidebar/menuLink/menuLink.module.css'
import { usePathname } from 'next/navigation'

const MenuLink = ({ item }) => {

    const pathname=usePathname()

    console.log(pathname)
  return (
    <Link href={item.path} className={styles.container}>
      {item.icon}
      {item.title}
    </Link>
  )
}

export default MenuLink