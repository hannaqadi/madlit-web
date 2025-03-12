import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarNav } from "./MadlitBars";
import { BottomBanner } from "./MadlitBars";
import styles from './Contact.module.css';

const Contact = () => {

  return (
    <div className={styles.main}>
      <TopBarNav />
      <div className={styles.outerGrid}>
        <div></div>
        <div className={styles.mainGrid}>
          <div className={styles.title}>
            <h1>Contact Us</h1>
            <p>Have a question? Drop us a message here!</p>
          </div>
          <div className={styles.inputContainer}>
            <div>
              <p>NAME</p>
              <input placeholder="Name" />
            </div>
            <div>
              <p>EMAIL</p>
              <input placeholder="Email" />
            </div>
            <div>
              <p>MESSAGE</p>
              <input className={styles.messageInput} placeholder="Message" />
            </div>
          </div>
          <button>Submit</button>
        </div>
        <div></div>
      </div>
      <BottomBanner />
    </div>
  )
}
export default Contact;