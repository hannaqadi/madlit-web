import { useState } from 'react'

export const PartsOfSpeech = {
  noun: 'a word that refers to a person, place, thing, event, substance, or quality',
  verb: 'a word or phrase that describes an action, condition, or experience',
  adjective: 'a word that describes a noun or pronoun',
  adverb: 'a word that describes or gives more information about a verb, adjective, adverb, or phrase',
  pronoun: 'a word that is used instead of a noun or a noun phrase'
}

export const Info = () => {

  return (
    <div>
      <p>INFO</p>
      <p>All definitions are from the cambridge dictionary</p>
      <ul>
        {Object.entries(PartsOfSpeech).map(([key, description]) => (
          <li key={key}>
            <h4>{key}</h4>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
