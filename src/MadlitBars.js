import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import styles from './MadlitBars.module.css'

export const TopBarNav = () => {
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
        <div className={styles.buttonContainer}>
          <div className={styles.buttonNav}>
            <div className={styles.buttons}>
              <i onClick={() => navigate('/Info')} className="fi fi-rr-info"></i>
            </div>
            <div className={showSettings ? styles.settingsClicked : styles.buttons}>
              <i onClick={settingsDropDown} className="fi fi-sr-settings"></i>
            </div>
          </div>
          {showSettings ? (
            <div className={styles.settingsContainer}>
              <p>{theme} Mode</p>
              {console.log(theme)}
              <label className={styles.switch}>
                <input type="checkbox" />
                <span onClick={toggleTheme} className={styles.slider}></span>
              </label>
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

export const BottomBanner = () => {
  return (
    <div className={styles.bottomBanner}></div>
  )
}