const searchTerm = document.getElementById("search-term");
const searchButton = document.getElementById("search-button");

// Obsługa kliknięcia przycisku wyszukiwania
searchButton.addEventListener("click", () => {
  const term = searchTerm.value.trim();
  if (term) {
    fetchMovies(term);
  } else {
    console.log("Search term is empty");
  }
});

// Funkcja pobierająca listę filmów na podstawie wyszukiwanego hasła
async function fetchMovies(term) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=42b78cff&s=${term}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    displayMovies(data.Search);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Funkcja pobierająca szczegóły filmu
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=42b78cff&i=${movieId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Funkcja wyświetlająca filmy w kontenerze
async function displayMovies(movies) {
  const moviesContainer = document.querySelector("#movies .container");
  const imgSection = document.querySelector("section .img-container");
  moviesContainer.innerHTML = "";

  if (movies && movies.length > 0) {
    imgSection.parentElement.style.display = "none";

    for (const movie of movies) {
      const movieDetails = await fetchMovieDetails(movie.imdbID);
      if (!movieDetails || movieDetails.Response === "False") continue;

      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";

      // Tworzenie karty filmu
      movieCard.innerHTML = `
        <img src="${
          movie.Poster !== "N/A" ? movie.Poster : "./assets/placeholder.png"
        }" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
        <p>Type: ${movieDetails.Genre}</p>
        <button class="like-movie-btn">
          <i class="fa-solid fa-heart"></i>
        </button>

      `;

      // Dodanie filmu do ulubionych
      const likeBtn = movieCard.querySelector(".like-movie-btn");
      likeBtn.addEventListener("click", () => {
        const icon = likeBtn.querySelector("i");
        icon.classList.toggle("liked");
      });

      moviesContainer.appendChild(movieCard);
    }
  } else {
    moviesContainer.innerHTML = "<p>No movies found</p>";
  }
}
