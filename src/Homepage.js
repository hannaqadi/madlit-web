import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarNav } from "./MadlitBars";
import { BottomBanner } from "./MadlitBars";
import styles from "./Hompage.module.css"


const Homepage = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [showGenres, setShowGenres] = useState(false)
  const [cardGenre, setCardGenre] = useState('')
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const isInitialRender = useRef(true);
  const mainGridRef = useRef(null);

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

    const genre = genres.find((g) => g.id === story.genre_id);
    if (genre) {
      localStorage.setItem('story', JSON.stringify(story));
      localStorage.setItem('genre', JSON.stringify(genre.name));
      navigate('/Playing');
    }
  }
  const toggleShowGenres = () => {
    setShowGenres((prev) => !prev);
  };

  const handleGenreSelect = (genre) => {
    setShowGenres(true)
    //Set genres state to selected true
    setGenres((prev) => {
      return prev.map((g) => {
        return g.id === genre.id
          ? { ...g, selected: !g.selected } // Toggle selected
          : g
      })
    });
    console.log('genres', genres)
    setSelectedGenres((prevGenres) =>
      [...prevGenres, genre]
    );
    console.log('selectedgenres', selectedGenres)
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

  const storiesGenre = (story) => {
    const genre = genres.find((genre) => genre.id === story.genre_id);
    if (genre) {
      return (
        <h5>[ {genre.name} ]</h5>
      )
    }
  }

  return (
    <div className={styles.main}>
      {showGenres ? <div className={styles.mainGreyedOut}></div> : <></>}
      <TopBarNav />
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
              <i className="fi fi-rr-search"></i>

            </form>

            <div className={styles.genreSelectContainer}>
              <button
                onClick={() => toggleShowGenres()}
                className={styles.genreButton}>
               <p> Genres </p>
                <i className="fi fi-rr-settings-sliders"></i>
              </button>
            </div>
          </div>

          {/*Selected Genres*/}
          <div>
            Stories
            {selectedGenres
              .map((genre) => (
                <span
                  key={genre.id}
                  onClick={() => removeAddedGenres(genre)}
                  className={styles.selectedGenre}>
                  <p> {genre.name} </p>
                  <i class="fi fi-br-cross-small"></i>
                </span>
              ))}
          </div>
          {/*Genre List*/}
          {showGenres ? (
            <div className={styles.genreContainer}>
              <div className={styles.genreTitle}>
                <div></div>
                <h2>Genres</h2>
                <i onClick={() => toggleShowGenres()} class="fi fi-br-cross-small"></i>
              </div>
              <div className={styles.genreList}>
                <ul>
                  {genres.map((genre, index) => {
                    const colors = [' #FFAFE2', '#FAC87F', '#3DD8ED', '#73E3B1'];
                    return (
                      <li
                        key={index}
                        onClick={() => handleGenreSelect(genre)}
                      >
                        <div style={{ backgroundColor: colors[index % 4] }}></div>
                        <p>{genre.name}</p>
                        {genre.selected === true ?
                          <input type="checkbox" checked />
                          : <input type="checkbox" />
                        }
                      </li>
                    )
                  })}
                </ul>
                <button>Update genres</button>
              </div>
            </div>
          ) : null}

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
                    <p>{story.story}</p>
                    {storiesGenre(story)}
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
      <BottomBanner />
    </div>
  )
}
export default Homepage;