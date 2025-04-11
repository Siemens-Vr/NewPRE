import DropDown from '@/app/components/project/phases/dropdown';
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