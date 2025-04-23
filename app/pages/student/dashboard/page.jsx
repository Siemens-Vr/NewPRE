
import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card';
import Chart from '@/app/components/chart/chart';
import styles from '@/app/styles/dashboards/dashboard.module.css';
import Rightbar from '@/app/components/rightbar/rightbar';
import CalendarComponent from "@/app/components/calendar/CalendarComponent";
import Course from "@/app/components/student/Course";
import Reminders from "@/app/components/student/Reminders";
import Instructors from "@/app/components/student/Instructors";


const Dashboard = () => {

  return (
    <div className={styles.wrapper}>
  {/* Main Content */}
  <div className={styles.studentMain}>
    <div className={styles.card}>
      {cards.map((item) => (
        <Card item={item} key={item.id} />
      ))}
    </div>

    <div className={styles.view}>
      <Chart />
      <Instructors />
    </div>
    <Course />
    <div className={styles.view}>
      {/* <CalendarComponent />
   
      <Reminders /> */}
    </div>
  </div>

  {/* Right Sidebar */}
  <div className={`${styles.side} hidden 2xl-custom:block`}>
  <Rightbar />
</div>


</div>

  );
};

export default Dashboard;