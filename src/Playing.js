import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlocker } from 'react-router-dom'

const Playing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { story } = location.state || {};
  const [inputs, setInputs] = useState({});
  const isSubmittingRef = useRef(false); 
  const isDirtyRef = useRef(false)

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
        finalInputs: finalInputs,
        story: story
      }
    })
  }

  useEffect(() =>{
    isSubmittingRef.current = false;
    isDirtyRef.current = false;
  }, [])
 
  return (
    <div>
      <h3>Playing</h3>
      <p>{story.title}</p>
      <p>hello?</p>
      <Prompt when={isDirtyRef.current} message='Are you sure you want to leave?' />
      <div>
        <form onSubmit={handleSubmit}>
          {story.partOfSpeech.map((part, index) => (
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
    </div>
  )
}
export default Playing;