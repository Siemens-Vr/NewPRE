import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "@/app/styles/card/card.module.css";


const Card = ({ item }) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatar}>
                <MdSupervisedUserCircle size={30}  color="white" />
            </div>
            
            <div className={styles.texts}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.number}>{item.number}</span>
             
            </div>
        </div>
    );
};

export default Card;
