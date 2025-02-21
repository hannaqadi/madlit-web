import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBarNav } from "./MadlitBars";
import { BottomBanner } from "./MadlitBars";
import styles from './Reading.module.css';

const Reading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const story = JSON.parse(localStorage.getItem('story'))
  const finalInputs = location.state?.finalInputs
  const [isLoaded, setIsLoaded] = useState(false)
  const [finalStory, setFinalStory] = useState([])


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

  return (
    <div className={styles.main}>
      <TopBarNav/>
      <div className={styles.outerGrid}>
        <div></div>
        {!isLoaded && !!!localStorage.getItem('finalStory') ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className={styles.mainGrid}>
            <p>Reading</p>
            <p>
              {(finalStory.length > 0
                ? finalStory
                : JSON.parse(localStorage.getItem('finalStory')) || [])
                .join(' ')}
            </p>
            <div className={styles.buttonContainer}>
              <button onClick={handlePlayAgain} >Play again!</button>
              <button onClick={() => navigate('/')}>Back to Stories</button>
              <button className={styles.shareIcon}>Share   <i className="fi fi-rr-share-square"></i></button>
            </div>
          </div>
        )
        }
        <div></div>
      </div>
      <BottomBanner/>
    </div>
  )
}
export default Reading;