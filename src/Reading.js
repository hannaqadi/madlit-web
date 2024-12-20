import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const Reading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { finalInputs = [], story = {} } = location.state || {};
  const [isLoaded, setIsLoaded] = useState(false)
  const [finalStory, setFinalStory] = useState([])

  const combineText = () => {
    let tempStory = [...(story.storySeq || [])];
    let j = 0;

    if (j !== finalInputs.length) {
      for (let i = 0; tempStory.length > i; i++) {
        if (tempStory[i] === "") {
          tempStory[i] = finalInputs[j]
          j++
        }
      }
    }

    if (j === finalInputs.length) {
      setFinalStory(tempStory)
      setIsLoaded(true)
    }
  }
  useEffect(() => {
    setIsLoaded(false)
    setFinalStory([])
    combineText()
  }, [])

  return (
    <div>
      <p>Reading</p>
      {!isLoaded ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <p>
            {finalStory.join(' ')}
          </p>
          <button onClick={() => navigate('/Playing', { state: { story: story } })} >Play again</button>
          <button onClick={() => navigate('/')}>Back to Stories</button>
        </div>
      )
      }

    </div>
  )
}
export default Reading;