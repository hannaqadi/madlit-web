import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import styles from './MadlitBars.module.css'

export const TopBarNav = () =>{
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])

  const settingsDropDown = () => {
    setShowSettings((prev) => !prev)
  }

  return (
    <div className={styles.topBannerGrid}>
    <div></div>
    <div className={styles.logoAndNav}>
      <h4>MAD LIT</h4>
      <div className={styles.buttonNavs}>
        <div>
          <button onClick={() => navigate('/Info')}>I</button>
          <i onClick={settingsDropDown} className="fi fi-sr-settings"></i>
        </div>
        {showSettings ? (
          <div className={styles.settingsNavContainer}>
            <p>current theme : {theme}</p>
            <button onClick={toggleTheme}>toggle light mode dark mode</button>
            <button>Share</button>
            <button>Contact</button>
          </div>
        ) : <></>}
      </div>
    </div>
    <div></div>

  </div>
  )
}


export const BottomBanner = () =>{

  return(
    <div className={styles.bottomBanner}></div>
  )
}