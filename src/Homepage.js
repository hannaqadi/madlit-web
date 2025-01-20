import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StoryArr } from "./StoryArr";
import styles from "./Hompage.module.css"
import { useTheme } from "./ThemeContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [showGenres, setShowGenres] = useState(false)
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const isInitialRender = useRef(true);

  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])
  
  const fetchGenres = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/genres`)
      const data = await response.json()
      const addSelected = data.genres.map((genre) => {
        return { ...genre, selected: false }
      })
      setGenres(addSelected)
      console.log(data.genres)
    } catch (error) {
      console.log(error.message)
    }
  }

  const fetchStories = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const genreIds = selectedGenres.map((genre) => genre.id).join(',');

      const response = await fetch(`http://localhost:5000/api/stories?page=${page}&limit=3&search=${encodeURIComponent(search)}&genres=${encodeURIComponent(genreIds)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      setStories(prev => [...prev, ...data.stories]);
      setHasMore(page < data.totalPages); // Check if there are more pages
    } catch (error) {
      console.log(error.message);
    } finally {
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
  }, [page, selectedGenres])

  //Fetches genres ONLY on page load
  useEffect(() => {
    fetchGenres();
  }, [])

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
    setStories([])
    if (page === 1) {
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
  const toggleGenreDropdown = () => {
    setShowGenres((prev) => !prev);
  };

  const handleGenreSelect = (genre) => {
    toggleGenreDropdown();
    //Set genres state to selected true
    setGenres((prev) => {
      return prev.map((g) => {
        return g.id === genre.id
          ? { ...g, selected: !g.selected } // Toggle selected
          : g
      })
    });

    setSelectedGenres((prevGenres) =>
      [...prevGenres, genre]
    );

    setStories([]);
    setPage(1);
  };

  const removeAddedGenres = (genre) => {
    //Set selected to false for genres
    setGenres((prevGenres) => {
      return prevGenres.map((g, i) => {
        return g.id === genre.id
          ? { ...g, selected: false }
          : g
      })
    })

    // Remove the object of selected genre from selectedGenre
    setSelectedGenres((prev) =>
      prev.filter((g) => g.id !== genre.id)
    );
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
      <p>current theme : {theme}</p>
      <button onClick={toggleTheme}>toggle light mode dark mode</button>
      <button onClick={() => toggleGenreDropdown()}>Genre</button>
      {selectedGenres
        .map((genre) => (
          <span key={genre.id} onClick={() => removeAddedGenres(genre)}>{genre.name}</span>
        ))}
      {showGenres ? (
        <ul>
          {genres.map((genre, index) => {
            if (genre.selected === false) {
              return (
                <li
                  key={index}
                  onClick={() => handleGenreSelect(genre)}
                  className={genre.selected ? styles.genreHighlight : ""}
                >
                  {genre.name}
                </li>
              )
            }
          })}
        </ul>
      ) : null}
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