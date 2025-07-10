import Sidebar from '@/app/components/sidebar/sidebar'
import Footer  from '@/app/components/footer/footer'
import Navbar from  '@/app/components/navbar/navbar'
import styles from   '@/app/styles/dashboards/dashboard.module.css'


const Layout = ({children}) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
      <Sidebar dashboardType="student" />
      </div>
      <div className={styles.content}>
        <Navbar/>
          {/* <h1 className={styles.texts}> Student</h1> */}
        {children}
        {/*<Footer/>*/}
      </div>
    </div>
  )
}

export default Layout