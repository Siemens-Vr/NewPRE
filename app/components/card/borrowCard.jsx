import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "@/app/styles/card/borrowedCard.module.css";


const borrowedCard = ({ item }) => {
    return (

        <div className={`${styles.container} ${styles[`color${item.id}`]}`}>
            <MdSupervisedUserCircle size={24}  color="white" />

            <div className={styles.texts}>
                {/* <span className={styles.available}>{item.available}</span> */}
                <span className={styles.available}>
                   <div>Available </div>                
                   <div>{item.available}</div>
                 </span>

                <span className={styles.borrowed}>
                      <div>Borrowed </div>      
                      <div>{item.borrowed}</div> 
                </span>

                <span className={styles.dueItems}>
                      <div>Due Items</div>                
                      <div>{item.dueItems}</div>                  
                </span>
 
          </div>
        </div>
    );
};

export default borrowedCard;


// app/components/BorrowedCard.js
// import { MdSupervisedUserCircle } from "react-icons/md";
// import styles from "@/app/styles/card/borrowedCard.css";

// const BorrowedCard = ({ item }) => {
//   return (
//     <div className={`${styles.container} ${styles[`color${item.id}`]}`}>
//       <MdSupervisedUserCircle size={24} color="white" />

//       <div className={styles.texts}>
//         {Object.entries(item).map(([key, value]) => (
//           key !== "id" && <span key={key} className={styles[key]}>{value}</span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BorrowedCard;
