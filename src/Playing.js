import { useState } from "react";
import { useLocation } from 'react-router-dom';

const Playing = () =>{
const location = useLocation();
const {story} = location.state || {};

  return(
    <div>
      <h3>Playing</h3>
      <p>{story.title}</p>
      <p>hello?</p>
      <div>
        {story.partOfSpeech.map((part,index)=>(
          <div>
          <p key={index}>{part}</p>
          <input/>
          </div>
        ))}
        <button>Submit</button>
      </div>
    </div>
  )
}
export default Playing;