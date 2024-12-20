import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlocker } from 'react-router-dom'

const Playing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { story } = location.state || {};

  const [inputs, setInputs] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (index, event) => {
    const { value } = event.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value
    }))
    setIsDirty(true);
  }

  function Prompt({ when, message }) {
    useBlocker(() => {
      if (when && !isSubmitting) {
        console.log(isDirty, 'changed, in blocker')
        return !window.confirm(message)
      }
      return false
    }, [when, isSubmitting])

    return <div key={when} />
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    setIsSubmitting(true);
    setIsDirty(false);
    let finalInputs = []
    for (const value in inputs) {
      finalInputs.push(inputs[value])
    }
    console.log(isDirty, 'submit')

    navigate('/Reading', {
      state: {
        finalInputs: finalInputs,
        story: story
      }
    })
  }

  console.log(isDirty)
  return (
    <div>
      <h3>Playing</h3>
      <p>{story.title}</p>
      <p>hello?</p>
      <Prompt when={isDirty} message='Are you sure you want to leave?' />
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