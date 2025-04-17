import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card'
import Chart from '@/app/components/chart/chart'
import styles from '@/app/styles/dashboards/dashboard.module.css'
import Rightbar from '@/app/components/rightbar/rightbar';

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.studentMain}>
        <div className={styles.card}>
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
