import Sidebar from '@/app/components/sidebar/staffSidebar'
import Navbar from  '@/app/components/navbar/staffNavbar'
import styles from   '@/app/styles/dashboards/dashboard.module.css'




const Layout = ({children}) => {
  return (

      <div className={styles.container}>
          <div className={styles.menu}>
          <Sidebar dashboardType="staff" />

          </div>
        <div className={styles.content}>
          <Navbar/>
          {children}
    
        </div>
      </div>

  )
}

export default Layout