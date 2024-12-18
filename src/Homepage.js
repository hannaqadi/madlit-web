import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryArr } from "./StoryArr";

const Homepage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  // console.log(search)
  // console.log(StoryArr.stories)

  const fetchStories = async () => {
    setStories(StoryArr.stories)
    console.log('fetching stories!')
  }

  useEffect(() => {
    fetchStories()

  }, [])


  const handleInputChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    setSearch('')
    fetchStories()
  }

  const handleStorySelect = (story) => {
    navigate('/Playing',{
      state:{
        story: story
      }
    })
  }
  return (
    <div>
      <p>Homepage</p>
      <form onSubmit={handleSubmitSearch}>
        <input
          placeholder="Search"
          value={search}
          onChange={handleInputChange}
        />
      </form>
      <ul>
        <li>ALL</li>
        <li>Adventure</li>
        <li>Horror</li>
        <li>Scifi</li>
        <li>Silly</li>
        <li>Comedy</li>
        <li>Animals</li>
      </ul>
      <div>
        {stories.length > 0 ? (
          stories.map((story, index) => (
            <div key={index} onClick={() => handleStorySelect(story)}>
              <h3>{story.title}</h3>
              <p>genre: {story.genre}</p>
              <p>{story.story}</p>
            </div>
          ))
        ) : (
          <p>Whoops! There's nothing here </p>
        )

        }
      </div>
    </div>
  )
}
export default Homepage;