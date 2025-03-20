
import styles from "@/app/styles/card/projectcard.module.css";

const ProjectCard = ({ item}) => {
    return (
        <div className={`${styles.container} ${styles[`color${item.id}`]}`}>

            <div className={styles.texts}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.number}>{item.number}</span>

            </div>
        </div>
    );
};

export default ProjectCard;
