import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StoryArr } from "./StoryArr";
import styles from "./Hompage.module.css"
import { useTheme } from "./ThemeContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false)
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
  const mainGridRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])

  /*Global Scrolling*/
  useEffect(() => {
    const handleGlobalScroll = (event) => {
      if (mainGridRef.current) {
        mainGridRef.current.scrollTop += event.deltaY;
        event.preventDefault();
      }
    };
    document.addEventListener('wheel', handleGlobalScroll, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleGlobalScroll);
    };
  }, []);

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

  const settingsDropDown = () => {
    setShowSettings((prev) => !prev)
  }

  const storiesGenre = (story) => {
    const genre = genres.find((genre) => genre.id === story.genre_id);
    if (genre) {
      return (
        <h5> Genre: {genre.name}</h5>
      )
    }
  }
  return (
    <div className={styles.main}>
      <div className={styles.topBannerGrid}>
        <div></div>
        <div className={styles.logoAndNav}>
          <h4>MAD LIT</h4>
          <div className={styles.buttonNavs}>
            <div>
              <button onClick={() => navigate('/Info')}>I</button>
              <button onClick={settingsDropDown}>S</button>
            </div>
            {showSettings ? (
              <div className={styles.settingsNavContainer}>
                <p>current theme : {theme}</p>
                <button onClick={toggleTheme}>toggle light mode dark mode</button>
                <button>Share</button>
                <button>Contact</button>
              </div>
            ) : <></>}
          </div>
        </div>
        <div></div>

      </div>
      <div className={styles.outerGrid}>
        <div></div>
        <div className={styles.mainGrid} ref={mainGridRef}>
          <div className={styles.header}>
            <h1>Lets Play a Game!</h1>
            <h2>Choose a story genre or search by title :3</h2>
          </div>

          {/*Search bar and genre button*/}
          <div className={styles.searchContainer}>
            <form
              className={styles.searchBar}
              onSubmit={handleSubmitSearch}
            >
              <input
                placeholder="Search stories..."
                value={search}
                onChange={handleInputChange}
              />
              <button type="submit">S</button>
            </form>

            <div className={styles.genreSelectContainer}>
              <button
                onClick={() => toggleGenreDropdown()}
                className={styles.genreButton}>
                Genres
              </button>
            </div>
          </div>
          {/*Selected Genres*/}
          <div>
            {selectedGenres
              .map((genre) => (
                <span
                  key={genre.id}
                  onClick={() => removeAddedGenres(genre)}
                  className={styles.selectedGenre}>
                  {genre.name}
                </span>
              ))}
          </div>
          {/*Genre List*/}
          <div className={styles.genreList}>
            {showGenres ? (
              <ul>
                {genres.map((genre, index) => {
                  if (genre.selected === false) {
                    return (
                      <li
                        key={index}
                        onClick={() => handleGenreSelect(genre)}
                      >
                        {genre.name}
                      </li>
                    )
                  }
                })}
              </ul>
            ) : null}
          </div>
          {/*Story cards*/}
          <div className={styles.storyCardContainer}>
            {stories.length > 0 ? (
              stories.map((story, index) => {
                const colors = [' #3DD8ED', '#FAC87F', ' #FFAFE2'];
                return (
                  <div
                    key={index}
                    onClick={() => handleStorySelect(story)}
                    style={{ backgroundColor: colors[index % 3] }}
                    className={styles.storyCard}
                  >
                    <h3>{story.title}</h3>
                    {storiesGenre(story)}
                    <p>{story.story}</p>
                  </div>
                )
              })
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
        <div></div>
      </div>
      <div className={styles.bottomBanner}></div>
    </div>
  )
}
export default Homepage;