import { cards ,projectdata} from '@/app/lib/data';

import Card from '@/app/components/card/card'
import Chart from '@/app/components/chart/chart'
import ProjectCard from "@/app/components/card/ProjectCard";
import styles from '@/app/styles/dashboards/dashboard.module.css'
import style from '@/app/styles/sidebar/sidebar.module.css'
import Rightbar from '@/app/components/rightbar/rightbar'

import CalendarComponent from "@/app/components/calendar/CalendarComponent";
import CommonLinks from "@/app/components/commonlinks/CommonLinks";



const Dashboard = () => {
  return (
      <div className={styles.wrapper}>
          <div className={styles.menu}>
              <div className={styles.contents}>

              <div className={styles.containercard}>
                  <div className={styles.cards}>
                      {cards.map((item) => (
                          <Card item={item} key={item.id}/>
                      ))}
                  </div>
              </div>
                  <Chart/>

          </div>
              <div className={styles.calendars}>
              <CalendarComponent/>
          {/*<div className={style.container}>*/}
          {/*    /!*<Rightbar />*!/*/}
          {/*</div>*/}
             <div className={styles.commonlink}>
                  <div className={styles.containercards}>
                      <h1 className={styles.text}>Projects</h1>
                      <div className={styles.card}>
                          {projectdata.map((item) => (
                              <ProjectCard item={item} key={item.id}/>
                          ))}
                      </div>
                  </div>
                 <CommonLinks/>
             </div>
              </div>


          </div>

      </div>
  );
};

export default Dashboard;
