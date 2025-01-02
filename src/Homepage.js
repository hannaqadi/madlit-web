import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StoryArr } from "./StoryArr";

const Homepage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchStories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stories');
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      console.log(data)
      const newStories = data.filter(
        (story) => !data.some((existingStory) => existingStory.id === story.id)
      );
      setStories(prev => [...prev, ...newStories])
      // setHasMore(StoryArr.currentPage < StoryArr.totalPages);
      console.log('fetching stories!')
    } catch (err) {
      console.log(err.message);
    }

  }

  useEffect(() => {
    fetchStories();
  }, [page])


  const handleInputChange = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, hasMore]);

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    setSearch('')
    fetchStories()
  }

  const handleStorySelect = (story) => {
    if (!!localStorage.getItem('story')) {
      localStorage.removeItem('story')
    }
    if (!!localStorage.getItem('finalStory')) {
      localStorage.removeItem('finalStory')
    }
    localStorage.setItem('story', JSON.stringify(story))
    navigate('/Playing')
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
        {hasMore && <div ref={loader}>Loading more stories...</div>}
      </div>
    </div>
  )
}
export default Homepage;