import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StoryArr } from "./StoryArr";

const Homepage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const isInitialRender = useRef(true);

  const fetchStories = async () => {
    if (loading) return;
    setLoading(true);
    try {
      console.log('starting fetch')
      console.log('page in fetch', page)
      const response = await fetch(`http://localhost:5000/api/stories?page=${page}&limit=3&search=${encodeURIComponent(search)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      console.log('data', data)
      setStories(prev => [...prev, ...data.stories]); 
      setHasMore(page < data.totalPages); // Check if there are more pages
    } catch (err) {
      console.log(err.message);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //Prevents initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; 
    }
    fetchStories();
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        //TODO: Allow loading to show slightly before triggering observer
        root: null, 
        rootMargin: "200px", // Trigger when the element is within 200px of the viewport
        threshold: 0, // Trigger as soon as it appears in the viewport
      }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
      observer.disconnect();
    };
  }, [hasMore, loading]);
  
  const handleInputChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmitSearch = (e) => {
    e.preventDefault()
    setPage(1)
    console.log('page',page)
    setStories([])
    if(page === 1 ){
      console.log('we in the if')
      fetchStories()
    }
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
        <button type="submit">Search</button>
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
        {hasMore && (
          <div ref={loader} style={{ height: "50px", backgroundColor: "lightgray" }}>
            Loading more stories...
          </div>
        )}
        {!hasMore && <p>Loaded!</p>}
      </div>
    </div>
  )
}
export default Homepage;