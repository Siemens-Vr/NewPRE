import styles from '../../styles/students/facilitators.module.css';

const instructors = [
    { name: "Instructor One", img: "/noavatar.png" },
    { name: "Instructor Two", img: "/noavatar.png" },
    { name: "Instructor Three", img: "/noavatar.png" },
    { name: "Instructor Four", img: "/noavatar.png" },
    { name: "Instructor Five", img: "/noavatar.png" },
];

const InstructorsAndNotice = () => {
    return (
        <div className={styles.container}>
            {/* Instructors */}
            <div className={styles.card}>
                <h3 className={styles.noticeTitle}>Course Instructors</h3>
                <div className={styles.instructors}>
                    {instructors.map((inst, index) => (
                        <div key={index} className={styles.instructorItem}>
                            <img
                                src={inst.img}
                                alt={inst.name}
                                className={styles.instructorImg}
                            />
                            <p className={styles.instructorName}>
                                {inst.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Notice */}
            <div>
                <h3 className={styles.noticeTitle}>Daily Notice</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className={styles.noticeItemTitle}>Payment Due</p>
                        <p className={styles.noticeItem}>Cohort 3 exams payment date.</p>
                    </div>
                    <div>
                        <p className={styles.noticeItemTitle}>Exam Schedule</p>
                        <p className={styles.noticeItem}>Cohort 3 exams scheduled to begin next week.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorsAndNotice;
