import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card'
import Chart from '@/app/components/chart/chart'
import styles from '@/app/styles/dashboards/dashboard.module.css'
import Rightbar from '@/app/components/rightbar/equipment/rightbar'
import Transactions from '@/app/components/transactions/transactions';
import CalendarComponent from "@/app/components/calendar/CalendarComponent";



const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}

        </div>
        {/* <Transactions /> */}
        <div className="w-full flex justify-start gap-20">
        <Chart />
     
          <div>
            <h3 className="text-lg font-semibold text-center mb-4">Calendar</h3>
            <CalendarComponent/>

          </div>
          </div>
      </div>
      <div className={`${styles.side} hidden lg:block`}>
  <Rightbar />
</div>

    </div>
  );
};

export default Dashboard;
