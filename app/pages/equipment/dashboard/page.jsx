import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card'
import Chart from '@/app/components/chart/chart'
import styles from '@/app/styles/dashboards/dashboard.module.css'
import Rightbar from '@/app/components/rightbar/equipment/rightbar'
import Transactions from '@/app/components/transactions/transactions';


const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
        {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}

        </div>
        {/* <Transactions /> */}
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
