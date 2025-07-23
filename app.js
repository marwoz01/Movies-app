const searchTerm = document.getElementById("search-term");
const searchButton = document.getElementById("search-button");

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

async function displayMovies(movies) {
  const moviesContainer = document.querySelector("#movies .container");
  const imgSection = document.querySelector("section .img-container");
  moviesContainer.innerHTML = "";

  if (movies && movies.length > 0) {
    imgSection.parentElement.style.display = "none";

    for (const movie of movies) {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";

      const movieDetails = await fetchMovieDetails(movie.imdbID);

      movieCard.innerHTML = `
        <img src="${
          movie.Poster !== "N/A" ? movie.Poster : "./assets/placeholder.png"
        }" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
        <p>Genre: ${
          movieDetails.Genre !== "N/A" ? movieDetails.Genre : "Unknown"
        }</p>
        <p><i class="fa-solid fa-star"></i> ${
          movieDetails.imdbRating !== "N/A" ? movieDetails.imdbRating : "N/A"
        }</p>
      `;
      moviesContainer.appendChild(movieCard);
    }
  } else {
    moviesContainer.innerHTML = "<p>No movies found</p>";
  }
}

async function fetchMovieDetails(imdbID) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=42b78cff&i=${imdbID}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return { imdbRating: "N/A" };
  }
}

searchButton.addEventListener("click", () => {
  const term = searchTerm.value.trim();
  if (term) {
    fetchMovies(term);
  } else {
    console.warn("Search term is empty");
  }
});
