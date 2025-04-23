import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card';
import Chart from '@/app/components/chart/chart';
import styles from '@/app/styles/dashboards/dashboard.module.css';
import Rightbar from '@/app/components/rightbar/rightbar';
import Transactions from '@/app/components/transactions/transactions';
import CalendarComponent from "@/app/components/calendar/CalendarComponent";



const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
      <div className={styles.card}>
      {cards.map((item) => (
        <Card item={item} key={item.id} />
      ))}
    </div>
        {/* <Transactions /> */}
        <div className={styles.view}>
        <Chart /> 
        <CalendarComponent/>
          </div>
          <div>
           

          </div>
      </div>
      <div className={`${styles.side} hidden 2xl-custom:block`}>
  <Rightbar />
</div>

    </div>
  );
};

export default Dashboard;
