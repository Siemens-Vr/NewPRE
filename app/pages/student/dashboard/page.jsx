
import { cards } from '@/app/lib/data';
import Card from '@/app/components/card/card'
import Chart from '@/app/components/chart/chart';
import styles from '@/app/styles/dashboards/dashboard.module.css'
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
  <div className={styles.side}>
    <Rightbar />
  </div>
</div>


      <div className="p-6 bg-white min-h-screen">
        {/*/!* Title *!/*/}
        {/*<h2 className="text-2xl font-semibold mb-6">Student Page</h2>*/}

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
          {card.map((item) => (
              <Card item={item} key={item.id}/>
          ))}
        </div>

        {/* Calendar Section */}
        <div className="w-full flex justify-center mb-5">
          <div /*className="bg-white rounded-xl shadow p-6 w-full max-w-xl"*/>
            {/*<h3 className="text-lg font-semibold text-center mb-4">Calendar</h3>*/}
            <CalendarComponent/>

          </div>
            <Instructors/>
        </div>

        {/* Reminders and Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reminders/>
          <Course/>
        </div>
      </div>

  );
};

export default Dashboard;
