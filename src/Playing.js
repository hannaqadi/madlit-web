import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const Playing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { story } = location.state || {};

  const [inputs, setInputs] = useState({});

  const handleChange = (index, event) => {
    const { value } = event.target
    setInputs((prevInputs) => ({
      ...prevInputs,
      [index]: value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let finalInputs = []
    for (const value in inputs){
      finalInputs.push(inputs[value])
    }
    console.log(finalInputs)
    console.log(story)
    navigate('/Reading',{
      state:{
        finalInputs: finalInputs,
        story: story
      }
    })
  }
  return (
    <div>
      <h3>Playing</h3>
      <p>{story.title}</p>
      <p>hello?</p>
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