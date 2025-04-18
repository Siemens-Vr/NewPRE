import Sidebar from '@/app/components/sidebar/sidebar'
import Footer  from '@/app/components/footer/footer'
// import Navbar from  '@/app/components/navbar/navbar'
import Navbar from "@/app/components/project/navbar/navbar";
import DropDown from '@/app/components/project/searchable/dropdown';
import styles from   '@/app/styles/dashboards/project/dashboard.module.css'



const Layout = ({children}) => {
  return (

    <div className={styles.container}>

      <div className={styles.content}>
        <DropDown/>

        {children}
      
     
      </div>
    </div>
  )
}

export default Layout