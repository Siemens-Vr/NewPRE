import { cards ,projectdata} from '@/app/lib/data';

import Card from '@/app/components/card/card';
import Chart from '@/app/components/chart/chart';
import ProjectCard from "@/app/components/card/ProjectCard";
import styles from '@/app/styles/dashboards/dashboard.module.css';
import style from '@/app/styles/sidebar/sidebar.module.css'
import Rightbar from '@/app/components/rightbar/rightbar';

import CalendarComponent from "@/app/components/calendar/CalendarComponent";
import CommonLinks from "@/app/components/commonlinks/CommonLinks";



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
                  <Chart/>
                   <div className={styles.containercards}>
                      <h1 className={styles.text}>Projects</h1>
                     <div className={styles.card}>
                        {projectdata.map((item) => (
                            <ProjectCard item={item} key={item.id}/>
                        ))}
                      </div>
                  </div> 
                  </div>

          {/* </div> */}
             <div className={styles.commonlink}>
                 <CommonLinks/>
             </div>
            

              </div>
              <div className={`${styles.side} hidden 2xl-custom:block`}>
  <Rightbar />
</div>
          </div>
  );
};

export default Dashboard;
