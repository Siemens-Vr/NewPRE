import Image from "next/image";
import styles from '@/app/styles/rightbar/equipment/rightbar.module.css';
import { MdError, MdHistory } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>🕒 Recent Activities</span>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <p>User X borrowed Component Y</p>
              <span>2 hours ago</span>
            </div>
            <div className={styles.activityItem}>
              <p>User A returned Component B</p>
              <span>5 hours ago</span>
            </div>
            <div className={styles.activityItem}>
              <p>User B requested Component C</p>
              <span>1 day ago</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>⚠️ Overdue Returns</span>
          <div className={styles.overdueList}>
            <div className={styles.overdueItem}>
              <p>User X should return Component Y</p>
              <span>1 day overdue</span>
            </div>
            <div className={styles.overdueItem}>
              <p>User A should return Component B</p>
              <span>2 days overdue</span>
            </div>
            <div className={styles.overdueItem}>
              <p>User C should return Component D</p>
              <span>3 days overdue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
