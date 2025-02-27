import { useState } from 'react'
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

  return (
    <div className={styles.main}>
      <TopBarNav />
      <div className={styles.outerGrid}>
        <div></div>
        <div className={styles.mainGrid}>
          <div>1</div>
          <div className={styles.columnFlex}>
            <h2>Choose a Story</h2>
            <p>
              Select a Mad Libs Sheet or Story
            </p>
          </div>
          <div>2</div>
          <div className={styles.columnFlex}>
            <h2>Fill in the Blanks</h2>
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
          <div>3</div>
          <div className={styles.columnFlex}>
            <h2>Write the Words:</h2>
            <p>
             The reader fills in the blanks with the words provided by the group. Don't read the story yet!
            </p>
          </div>
          <div>4</div>
          <div className={styles.columnFlex}>
            <h2>Read the Story Aloud:</h2>
            <p>
            Once all blanks are filled, the reader reads the completed story aloud. 
            Everyone can laugh at the funny and unexpected results!
            </p>
          </div>
        </div>
        <div className={styles.sideBannerContainer}>
          <div className={styles.sideBanner}>How to Play</div>
        </div>
      </div>
      <BottomBanner />
    </div>
  )
}
