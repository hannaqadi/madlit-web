import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useBlocker } from 'react-router-dom'

const Playing = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [inputs, setInputs] = useState({});
  const [loaded, setLoaded] = useState(false)
  const isSubmittingRef = useRef(false);
  const isDirtyRef = useRef(false)

  useEffect(()=>{
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
  },[])

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

  return (
    <div>
      {loaded ? <div>
        <h3>Playing</h3>
        <p>{story.title}</p>
        <p>hello?</p>
        <Prompt when={isDirtyRef.current} message='Are you sure you want to leave?' />
        <div>
          <form onSubmit={handleSubmit}>
            {story.parts_of_speech.map((part, index) => (
              <div key={index}>
                <p>{part}</p>
                <input
                  type="text"
                  value={inputs[index] || ""}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
            ))}
            <button>Submit</button>
          </form>
        </div>
      </div> : <p>oops!</p>}

    </div>
  )
}
export default Playing;