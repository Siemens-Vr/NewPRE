
import styles from '../../styles/students/facilitators.module.css';

const enrolledCourses = [
    'siemens 1',
    'siemens 1',
];


const EnrolledCourses = () => {
    // const [courses, setCourses] = useState([]);


    return (
        <div className={styles.containers}>
             <h3 className={styles.noticeTitle}>Enrolled courses</h3>
            <div className={styles.instructors}>
            <ul>
                {enrolledCourses.map((course, index) => (
                    <li key={index}>
                        {index + 1}. {course}
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

export default EnrolledCourses;
