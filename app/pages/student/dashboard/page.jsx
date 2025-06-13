
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

    const stats = [
    { id: 1, icon: '👥', title: 'Total Students',    value: 120 },
    { id: 2, icon: '📚', title: 'Active Courses',    value:  12 },
    { id: 3, icon: '🧑‍🏫', title: 'Instructors',      value:   8 },
    { id: 4, icon: '📝', title: 'Pending Assignments', value:  25 },
  ];

  return (
     <div className={styles.wrapper}>

      {/* Row 1: Student Quick Stats */}
      <div className={styles.row1}>
        <div className={styles.containercards}>
          <h2 className={styles.text}>Quick Stats</h2>
          <div className={styles.cardGrid}>
            {stats.map(s => (
              <Card
                key={s.id}
                item={{ icon: s.icon, title: s.title, value: s.value }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Academic Calendar + Reminders */}
      <div className={styles.row2}>
        <div className={styles.containercards}>
          <h2 className={styles.text}>Academic Calendar</h2>
          <CalendarComponent />
        </div>
        <div className={styles.containercards}>
          <h2 className={styles.text}>Daily Notice</h2>
          <Reminders />
        </div>
      </div>

      {/* Row 3: Courses | Instructors | Performance */}
      <div className={styles.row2}>
        <div className={styles.flexFill}>
          <h2 className={styles.text}>Performance</h2>
          <Chart />
       
        </div>
        <div className={styles.flexFill}>
          <div>
              <h2 className={styles.text}>Instructors</h2>
              <Instructors />
          </div>
          <div>
                <h2 className={styles.text}>Ongoing Courses</h2>
                <Course />
          </div>
        </div>
        <div className={styles.flexFill}>
          
        </div>
      </div>

    </div>
  );
};

export default Dashboard;