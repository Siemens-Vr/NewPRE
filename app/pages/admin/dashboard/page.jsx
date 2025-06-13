import { cards ,projectdata} from '@/app/lib/data';
import Card from '@/app/components/card/card';
import Chart from '@/app/components/chart/chart';
import ProjectCard from "@/app/components/card/ProjectCard";
import styles from '@/app/styles/dashboards/dashboard.module.css';
import Rightbar from '@/app/components/rightbar/rightbar';

import CalendarComponent from "@/app/components/calendar/CalendarComponent";
import CommonLinks from "@/app/components/commonlinks/CommonLinks";



const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
    {/* Main Content */}
     {/* Row 1: KPI Cards */}
      <div className={styles.row1}>
        <div className={styles.containercards}>
          <h2 className={styles.text}>User / Project KPIs</h2>
          <div className={styles.cardGrid}>
            {cards.map(item => <Card item={item} key={item.id} />)}
            {projectdata.map(item => <Card item={item} key={item.id} />)}
          </div>
        </div>
      </div>

      {/* Row 2: Calendar + Notifications */}
      <div className={styles.row2}>
        <div className={styles.containercards}>
          <h2 className={styles.text}>Calendar</h2>
          <CalendarComponent />
        </div>
        <div className={styles.containercards}>
          <h2 className={styles.text}>Notifications</h2>
          <ul className={styles.notificationList}>
            <li>✔️ New user registered</li>
            <li>⚠️ Equipment request pending</li>
            <li>🛠️ System backup completed</li>
          </ul>
        </div>
      </div>

      {/* Row 3: Chart + Quick Links + System Health */}
      <div className={styles.row2}>
        <div className={styles.containercards}>
          <h2 className={styles.text}>Weekly Recap</h2>
          <Chart />
        </div>
        {/* <div className={styles.containercards}>
          <h2 className={styles.text}>Quick Links</h2>
          <CommonLinks />
        </div> */}
        <div className={styles.containercards}>
          <div>
               <h2 className={styles.text}>System Health</h2>
          <p>🟢 All systems operational</p>
          <p>📈 CPU: 35% | RAM: 68%</p>
          <p>💾 Disk: 45% used</p>

          </div>
          <div>
     
          <h2 className={styles.text}>Quick Links</h2>
          <CommonLinks />
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default Dashboard;
