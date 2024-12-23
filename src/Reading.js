import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const Reading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { finalInputs = [], story = {} } = location.state || {};
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
    const combineText = () => {
      if (story && Array.isArray(story.storySeq)) {
        let tempStory = [...story.storySeq];
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
          console.log(localStorage.getItem('finalStory'))
          setIsLoaded(true);
        }
      } else {
        console.error("There was an error");
      }
    };

    if (story && story.storySeq) {
      setIsLoaded(false);
      setFinalStory([]);
      combineText();
    } else {
      console.error("story data is missing, can't combine text.");
    }
  }, [finalInputs, story])

  const handlePlayAgain = () => {
    localStorage.removeItem('finalStory')
    navigate('/Playing', { state: { story: story } })
  }

  return (
    <div>
      <p>Reading</p>
      {console.log(!!!localStorage.getItem('finalStory'), 'local')}
      {console.log(!isLoaded, 'loadies')}
      {!isLoaded && !!!localStorage.getItem('finalStory') ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <p>
          {(finalStory.length > 0 
        ? finalStory 
        : JSON.parse(localStorage.getItem('finalStory')) || [])
        .join(' ')}
          </p>
          <button onClick={() => handlePlayAgain} >Play again</button>
          <button onClick={() => navigate('/')}>Back to Stories</button>
        </div>
      )
      }

    </div>
  )
}
export default Reading;