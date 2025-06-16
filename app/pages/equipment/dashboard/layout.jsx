import Sidebar from '@/app/components/sidebar/sidebar'
import Navbar from '@/app/components/navbar/navbar'
import styles from   '@/app/styles/dashboards/dashboard.module.css'

const Layout = ({children}) => {
  return (
    <div className={styles.container}>
        <div className={styles.menu}>
        <Sidebar dashboardType="equipment" />
        </div>
       <div className={styles.content}>
          <Navbar/>
        {children}
   
       </div>
    </div>
  )
}

export default Layout