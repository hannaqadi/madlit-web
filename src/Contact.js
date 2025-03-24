import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarNav } from "./MadlitBars";
import { BottomBanner } from "./MadlitBars";
import styles from './Contact.module.css';

const Contact = () => {

  return (
    <div className={styles.main}>
      <TopBarNav />
      <div className={styles.mainGrid}>
        <div className={styles.title}>
          <h1>Contact</h1>
          <p>Have a question? Email me directly at hannaqadi@gmail.com! </p>
        </div>
      </div>
      <BottomBanner />
    </div>
  )
}
export default Contact;