import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';


const Reading = () => {
  const location = useLocation();
  const { finalInputs = [], story = {} } = location.state || {};
  const [isLoaded, setIsLoaded] = useState(false)
  let finalStory = story.storySeq || [];
  console.log(story)
  console.log(finalInputs)
  const combineText = () => {
  
    let j = 0;
    if (j !== finalInputs.length) {
      for (let i = 0; finalStory.length > i; i++) {
        if (finalStory[i] === "") {
          finalStory[i] = finalInputs[j]
          j++
        }
      }
    }
    if (j === finalInputs.length) {
      setIsLoaded(true)
    }
  }
  useEffect(() => {
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
<div> {finalStory.join(' ')} </div>
         )
        }
    </div>
  )
}
export default Reading;