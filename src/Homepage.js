import { useEffect, useState } from "react";
import { StoryArr } from "./StoryArr";

const Homepage = () => {
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  console.log(search)
  console.log(StoryArr.stories)
  useEffect(() => {

  }, [])

  const fetchStories = async () => {
    console.log('fetching stories!')
  }

  const handleInputChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    setSearch('')
    fetchStories()
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
    </div>
  )
}
export default Homepage;