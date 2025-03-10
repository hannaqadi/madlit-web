import { useEffect, useRef } from "react";
import styles from './Info.module.css'
import { TopBarNav } from './MadlitBars'
import { BottomBanner } from './MadlitBars'

export const PartsOfSpeech = {
  noun: 'a word that refers to a person, place, thing, event, substance, or quality',
  verb: 'a word or phrase that describes an action, condition, or experience',
  adjective: 'a word that describes a noun or pronoun',
  adverb: 'a word that describes or gives more information about a verb, adjective, adverb, or phrase',
  pronoun: 'a word that is used instead of a noun or a noun phrase'
}

export const Info = () => {
const mainGridRef = useRef(null);
   /*Global Scrolling*/
    useEffect(() => {
      const handleGlobalScroll = (event) => {
        if (mainGridRef.current) {
          mainGridRef.current.scrollTop += event.deltaY;
          event.preventDefault();
        }
      };
      document.addEventListener('wheel', handleGlobalScroll, { passive: false });
      return () => {
        document.removeEventListener('wheel', handleGlobalScroll);
      };
    }, []);

  return (
    <div className={styles.main}>
      <TopBarNav />
      <div className={styles.outerGrid}>
        <div></div>
        <div className={styles.mainGrid}ref={mainGridRef}>
          <div className={styles.numbers}>
            <p>1</p>
          </div>
          <div className={styles.columnFlex}>
            <h2><u>Choose a Story:</u></h2>
            <p>
              Select a Mad Libs Sheet or Story
            </p>
          </div>
          <div className={styles.numbers}>
            <p>2</p>
          </div>
          <div className={styles.columnFlex}>
            <h2><u>Fill in the Blanks:</u></h2>
            <p>
              One person, (the "reader") asks the group for specific types of words, like:
            </p>
            <ul>
              {Object.entries(PartsOfSpeech).map(([key, description]) => (
                <li key={key}>
                  <p> {key}: {description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.numbers}>
            <p>3</p>
          </div>
          <div className={styles.columnFlex}>
            <h2><u>Write the Words:</u></h2>
            <p>
              The reader fills in the blanks with the words provided by the group. Don't read the story yet!
            </p>
          </div>
          <div className={styles.numbers}>
            <p>4</p>
          </div>
          <div className={styles.columnFlex}>
            <h2><u>Read the Story Aloud:</u></h2>
            <p>
              Once all blanks are filled, the reader reads the completed story aloud.
              Everyone can laugh at the funny and unexpected results!
            </p>
          </div>
        </div>
        <div className={styles.sideBannerContainer}>
          <div className={styles.sideBanner}>How to Play!</div>
          <div className={styles.sideBannerUnder}></div>
        </div>
      </div>
      <BottomBanner />
    </div>
  )
}
