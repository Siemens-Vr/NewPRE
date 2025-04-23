import Image from "next/image";
import styles from '@/app/styles/rightbar/rightbar.module.css';
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.bgContainer}>
          <Image className={styles.bg} src="/astronaut.png" alt="" fill />
        </div>
        <div className={styles.text}>
          <span className={styles.notification}>Ongoing Training🔥</span>
          <h3 className={styles.title}>
          Siemens Mechatronic Systems Certification Program (SMSCP) Level 1 & 2 ongoing training
          </h3>
          {/* <span className={styles.subtitle}>Takes 4 minutes to learn</span> */}
          <p className={styles.desc}>
          From mastering PLCs and robotics to real-world troubleshooting and system-smart thinking, our trainees are diving deep into globally 
          recognized mechatronic skills that bridge theory with industry.
          </p>
          <button className={styles.button}>
            <MdPlayCircleFilled />
            Apply
          </button>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>🚀 Coming Soon</span>
          <h3 className={styles.title}>
            New staff portal is available, partial personalization is coming
            up!
          </h3>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit eius libero perspiciatis recusandae possimus.
          </p>
          <button className={styles.button}>
            <MdReadMore />
            Learn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
