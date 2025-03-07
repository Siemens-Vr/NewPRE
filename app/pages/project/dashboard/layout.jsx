import Sidebar from '@/app/components/sidebar/sidebar'
import Footer  from '@/app/components/footer/footer'
import Navbar from  '@/app/components/navbar/navbar'
import styles from   '@/app/styles/dashboards/project/dashboard.module.css'



const Layout = ({children}) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
      <Sidebar dashboardType="project" />
      </div>
      <div className={styles.content}>
        {children}
        <Footer/>
      </div>
    </div>
  )
}

export default Layout