import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBarNav } from "./MadlitBars";
import { BottomBanner } from "./MadlitBars";
import styles from './Reading.module.css';

const Reading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const finalInputs = location.state?.finalInputs
  const story = JSON.parse(localStorage.getItem('story'))
  const [isLoaded, setIsLoaded] = useState(false)
  const [finalStory, setFinalStory] = useState([])
  const [storyTitle, setStoryTitle] = useState("")
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event) => {
      window.history.pushState(null, '', window.location.href);
      navigate('/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    if (!finalInputs) {
      // If finalInputs is missing, redirect back to Playing or Home
      console.log("finalInputs missing, redirecting to Playing...");
      navigate("/", { replace: true });
      return;
    }
    const combineText = () => {
      if (story && Array.isArray(story.story_seq)) {
        setStoryTitle(story.title)
        let tempStory = [...story.story_seq];
        let j = 0;
        for (let i = 0; i < tempStory.length; i++) {
          if (tempStory[i] === "" && j < finalInputs.length) {
            tempStory[i] = finalInputs[j];
            j++;
          }
        }

        if (j === finalInputs.length) {
          setFinalStory(tempStory);
          localStorage.setItem('finalStory', JSON.stringify(tempStory));
          setIsLoaded(true);
        }
      }
    };

    if (!isLoaded && finalStory.length === 0 && !!!localStorage.getItem('finalStory')) {
      setIsLoaded(false);
      setFinalStory([]);
      combineText();
    }
  }, [])

  const handlePlayAgain = () => {
    localStorage.removeItem('finalStory')
    navigate('/Playing', { state: { story: story } })
  }

  const textDecoration = () => {
    let parts = [];
    let currentText = [];

    story.story_seq.forEach((element, index) => {
      if (element === "") {
        if (currentText.length > 0) {
          parts.push(<span key={`text-${index}`}>{currentText.join(" ") + " "}</span>);
          currentText = [];
        }
        parts.push(<b key={`bold-${index}`}><u>{finalStory[index]} </u></b>);
      } else {
        currentText.push(element);
      }
    });
    if (currentText.length > 0) {
      parts.push(<span key="last-text">{currentText.join(" ")}</span>);
    }
    return <p>{parts}</p>;
  }

  const copyToClipboard = () => {

    const text = "Hello, this text has been copied!";
    navigator.clipboard.writeText(finalStory.join(" "))
      .then(() => setCopied(true))
      .catch((err) => console.error("Failed to copy: ", err));
  };
  return (
    <div className={styles.main}>
      <TopBarNav />
      <div className={styles.outerGrid}>
        <div></div>
        {!isLoaded && !!!localStorage.getItem('finalStory') ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className={styles.mainGrid}>
            <p className={styles.title}>{storyTitle}</p>
            <div className={styles.readingContainer}> {textDecoration()}</div>
            <div className={styles.buttonContainer}>
              <div className={styles.topButtons}>
                <button onClick={handlePlayAgain} >Play again!</button>
                <button onClick={() => navigate('/')}>Back to Stories</button>
              </div>
              <button onClick={copyToClipboard}>
                {copied ?
                  "Copied Story!"
                  :
                  <div className={styles.shareContainer} >
                    Share
                    <div className={styles.shareIcon}>
                      <i className="fi fi-rr-share-square"></i>
                    </div>
                  </div>
                }

              </button>
            </div>
          </div>
        )
        }
        <div></div>
      </div>
      <BottomBanner />
    </div>
  )
}
export default Reading;