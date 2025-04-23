import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "@/app/styles/card/card.module.css";
import {white} from "next/dist/lib/picocolors";

const Card = ({ item }) => {
    return (
        <div className={`${styles.container} ${styles[`color${item.id}`]}`}>
            <MdSupervisedUserCircle size={24}  color="white" />
            <div className={styles.texts}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.number}>{item.number}</span>
               {/* <span
                   className={item.change > 0 ? styles.positive : styles.negative}
               >
         {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
        </span> */}
            </div>
        </div>
    );
};

export default Card;
