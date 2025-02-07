import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useBlocker } from 'react-router-dom'
import { PartsOfSpeech } from "./Info";
import styles from "./Playing.module.css"

const Playing = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [inputs, setInputs] = useState({});
  const [loaded, setLoaded] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [helpContent, setHelpContent] = useState('')
  const [rightIndex, setRightIndex] = useState(null)
  const isSubmittingRef = useRef(false);
  const isDirtyRef = useRef(false)

  useEffect(() => {
    try {
      const storyData = localStorage.getItem("story");
      console.log(storyData)
      if (storyData) {
        const parsedStory = JSON.parse(storyData);
        setStory(parsedStory);
        setLoaded(true);
      } else {
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error parsing story from localStorage:", error);
      setLoaded(false);
    }
  }, [])

  const handleChange = (index, event) => {
    const { value } = event.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value
    }))

    isDirtyRef.current = true;
  }

  const Prompt = ({ when, message }) => {
    useBlocker(() => {
      if (when && !isSubmittingRef.current) {
        return !window.confirm(message)
      }
      return false
    }, [when, isSubmittingRef.current])

    return <div key={when} />
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    isSubmittingRef.current = true;
    isDirtyRef.current = false;

    let finalInputs = []
    for (const value in inputs) {
      finalInputs.push(inputs[value])
    }

    navigate('/Reading', {
      state: {
        finalInputs: finalInputs
      }
    })
  }

  useEffect(() => {
    isSubmittingRef.current = false;
    isDirtyRef.current = false;
  }, [])

  const helpButton = (part, index) => {
    //TODO FOR BETA: Convert 'part' to all lowercase to match PartsOfSpeech 
    if (rightIndex === index) {
      setRightIndex(null)
    } else {
      for (const property in PartsOfSpeech) {
        if (property === part) {
          setHelpContent(PartsOfSpeech[property])
          setRightIndex(index)
        }
      }
    }

  }
  return (
    <div className={styles.main}>
      <div className={styles.outerGrid}>
        <div></div>

        {loaded ? <div className={styles.mainGrid}>

          <div className={styles.storyInfo}>
            <h3>{story.title}</h3>
            <p>{story.story}</p>
            <p>Enter in the parts of speech</p>
          </div>

          <Prompt when={isDirtyRef.current} message='Are you sure you want to leave?' />

          <form
            onSubmit={handleSubmit}
            className={styles.inputsForm}
          >
            {story.parts_of_speech.map((part, index) => (
              <div key={index} className={styles.inputsContainer}>
                <div className={styles.inputWrapper}>                
                  <p>{part}</p>
                  <div className={styles.inputItemsContainer}>
                    <input
                      type="text"
                      value={inputs[index] || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                    <button onClick={() => helpButton(part, index)} type="button">info</button>
                  </div>
                  {rightIndex === index ?
                    <div>
                      <p>{helpContent}</p>
                    </div>
                    : <></>
                  }
                </div>

              </div>
            ))}
            <button type="submit">Submit</button>
          </form>

        </div>
          : <p>oops!</p>}
        <div></div>

      </div>
    </div>
  )
}
export default Playing;