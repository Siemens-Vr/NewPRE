import styles from '../../styles/students/facilitators.module.css';

const instructors = [
    { name: "Maxwel Magoi", img: "/maxwel.jpg" },
    { name: "Edwin Ngari", img: "/edwin.png" },
    { name: "Blair Carson", img: "/blair.jpeg" },
    { name: "Victor Kanumbi", img: "/victor.jpg" },
    { name: "Charles Murage", img: "/murage.jpg" },
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

          
        </div>
    );
};

export default InstructorsAndNotice;
