import Sidebar from '@/app/components/sidebar/sidebar'
import Footer  from '@/app/components/footer/footer'
 import ComponentNavbar from '@/app/components/navbar/componentNav'
import styles from   '@/app/styles/dashboards/dashboard.module.css'

const Layout = ({children}) => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
        <Sidebar dashboardType="equipment" />
        </div>
       <div className={styles.content}>
         <ComponentNavbar />
        {children}
        <Footer/>
       </div>
    </div>
  )
}

export default Layout