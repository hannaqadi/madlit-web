import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useBlocker } from 'react-router-dom'
import { PartsOfSpeech } from "./Info";
import { TopBarNav } from "./MadlitBars";
import { BottomBanner } from "./MadlitBars";
import styles from "./Playing.module.css"

const Playing = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [inputs, setInputs] = useState({});
  const [filled, setFilled] = useState(false)
  const [errorStyle] = useState(styles.inputsError)
  const [errorButton, setErrorButton] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [helpContent, setHelpContent] = useState('')
  const [rightIndex, setRightIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000)
  const isSubmittingRef = useRef(false);
  const isDirtyRef = useRef(false)
  const mainGridRef = useRef(null);
  const pendingNavigation = useRef(null);

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

  /*Media Query*/
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1000px)');
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    setIsMobile(mediaQuery.matches);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);


  useEffect(() => {
    try {
      const storyData = localStorage.getItem("story");
      if (storyData) {
        const parsedStory = JSON.parse(storyData);
        setStory(parsedStory);
        {/*Set up for inputs*/ }
        for (let i = 0; i < parsedStory.parts_of_speech.length; i++) {
          inputs[i] = ""
        }
        setLoaded(true);
      } else {
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error parsing story from localStorage:", error);
      setLoaded(false);
    }

  }, [])

  /* Checks if inputs are filled */
  useEffect(() => {
    setFilled(true)
    for (let key in inputs) {
      if (inputs[key].trim() === "") {
        setFilled(false)
        break; // Stop checking if we find an empty value
      }
    }
  }, [inputs])

  const handleChange = (index, event) => {
    const { value } = event.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value
    }))

    isDirtyRef.current = true;
  }

  // Blocking navigation
  useBlocker((tx) => {
    if (pendingNavigation.current || filled === true) return false;
    setShowModal(true);
    pendingNavigation.current = tx;
    return true;
  });

  const handleConfirm = () => {
    setShowModal(false);
    if (pendingNavigation.current) {
      navigate("/");
      pendingNavigation.current = null;
    };
  }
  const handleCancel = () => {
    setShowModal(false);
    pendingNavigation.current = null;
  };


  const handleSubmit = (event) => {
    if (filled === true) {
      event.preventDefault();
      isSubmittingRef.current = true;
      isDirtyRef.current = false;

      let finalInputs = []
      for (const keys in inputs) {
        finalInputs.push(inputs[keys])
      }

      navigate('/Reading', {
        state: {
          finalInputs: finalInputs
        }
      })
    } else {
      event.preventDefault();
      setErrorButton(true)
    }
  }

  useEffect(() => {
    isSubmittingRef.current = false;
    isDirtyRef.current = false;
  }, [])

  const helpButton = (part, index) => {
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

  const genreBanner = () => {
    /*Places spaces between letters*/
    const genre = JSON.parse(localStorage.getItem('genre'))
    const genreArr = genre.split("")
    let genreFinal = []
    genreArr.forEach((element) => {
      genreFinal.push(element)
      genreFinal.push(" ")
    });
    return (
      <p>{genreFinal}</p>
    )
  }

  {/*TODO: Make middle column scrollable globally */ }
  return (
    <div className={styles.main}>
      {rightIndex !== null || showModal ? <div className={styles.mainGreyedOut}></div> : <></>}
      <TopBarNav />
      <div className={styles.outerGrid}>
        <div></div>
        {loaded ? <div className={styles.mainGrid} ref={mainGridRef}>

          <div className={styles.storyInfo}>
            <h3>{story.title}</h3>
          </div>
          {showModal ? 
            <div className={styles.leavingContainer}>
              <i onClick={handleCancel} className="fi fi-br-cross-small"></i>
              <div>
                <p>Are you sure you want to leave?</p>
                <p>Your progress will not be saved</p>
              </div>
              <div className={styles.leavingButtons}>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleConfirm}>Yes, leave</button>
              </div>
            </div>
            :
            <></>
          }
          <form className={styles.inputsForm}>
            <div className={styles.inputsContainer}>
              {story.parts_of_speech.map((part, index) => (
                <div key={index} className={styles.inputWrapper}>
                  <div className={styles.posInfo}>
                    <p>{part.toUpperCase()}</p>
                    {PartsOfSpeech[part] ? <i onClick={() => helpButton(part, index)} className="fi fi-sr-interrogation"></i>
                      : <></>
                    }
                  </div>
                  <div className={styles.inputItemsContainer}>
                    <input
                      type="text"
                      value={inputs[index] || ""}
                      onChange={(e) => handleChange(index, e)}
                      className={(!inputs[index] && errorButton) ? errorStyle : styles.inputsComplete}
                    />

                  </div>
                  {rightIndex === index ?
                    <div className={styles.helpContentContainer}>
                      <i onClick={() => setRightIndex(null)} className="fi fi-br-cross-small"></i>
                      <h1><u>{part}</u> -</h1>
                      <p>{helpContent}</p>
                    </div>
                    : <></>
                  }
                </div>
              ))}
              <div className={styles.finishedButtonContainer}>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={filled ? styles.finishedButtonEnabled : styles.finishedButtonDisabled}>
                  Finished!
                </button>
              </div>
            </div>

          </form>

        </div>
          : <p>oops!</p>}
        {!isMobile ?
         <div className={styles.genreBannerContainer}>
          <div className={styles.genreBanner}>{genreBanner()}</div>
        </div>
          : <></>
          }

      </div>
      <BottomBanner />
    </div>
  )
}
export default Playing;