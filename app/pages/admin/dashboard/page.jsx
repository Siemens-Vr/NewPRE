import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card'
import Chart from '@/app/components/chart/chart'
import styles from '@/app/styles/dashboards/dashboard.module.css'
import style from '@/app/styles/sidebar/sidebar.module.css'
import Rightbar from '@/app/components/rightbar/rightbar'




const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <div className={styles.cards}>
        {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}

        </div>
    
        <Chart />
      </div>
      <div className={style.container}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
