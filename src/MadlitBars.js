import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import styles from './MadlitBars.module.css'

export const TopBarNav = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])

  const settingsDropDown = () => {
    setShowSettings((prev) => !prev)
  }
  const copyToClipboard = () => {
    //TODO: Enter actual URL below for sharing
    const text = "Hello, this text has been copied!";
    navigator.clipboard.writeText(text)
      .then(() => setCopied(true))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  useEffect(() => {
    setCopied(false)
  }, [])

  return (
    <div className={styles.topBannerGrid}>
      <div></div>
      <div className={styles.logoAndNav}>
        <h4 onClick={() => navigate('/')}>MAD LIT</h4>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonNav}>
            <div onClick={() => navigate('/Info')} className={styles.infoButton}>
              <i className="fi fi-rr-info"></i>
            </div>
            <div onClick={settingsDropDown} className={showSettings ? styles.settingsClicked : styles.settingsButton}>
              <i className="fi fi-sr-settings"></i>
            </div>
          </div>
          {showSettings ? (
            <div className={styles.settingsContainer}>
              <div className={styles.themeContainer}>
                <p>{theme} Mode</p>
                <label className={styles.switch}>
                  <input type="checkbox" />
                  <span onClick={toggleTheme} className={styles.slider}></span>
                </label>
              </div>
              <button className={styles.shareContainer} onClick={copyToClipboard}>
                {copied ?
                  "Copied Link!"
                  :
                  <div>
                    Share
                    <div className={styles.shareIcon}>
                      <i className="fi fi-rr-share-square"></i>
                    </div>
                  </div>}

              </button>
              <button onClick={() => navigate('/Contact')}>Contact</button>
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