"use strict";
// ========== Globale variables ========== //

// const endpoint = "https://dummy-movieobjects-default-rtdb.firebaseio.com/";

const endpoint = "https://movies-forms-rest-crud-afl-default-rtdb.europe-west1.firebasedatabase.app/";
// const endpoint = "https://test-form-database-f322e-default-rtdb.firebaseio.com/";
let movies;

// ========== Load & startup ========== //
window.addEventListener("load", startApp);

function startApp() {
  // update the grid of movies: get and show all movies
  updateMovieGrid();

  //eventlisteners for create
  document.querySelector("#create-new-post-btn").addEventListener("click", showCreateMovie);
  document.querySelector("#create-post-form").addEventListener("submit", createMovieClicked);

  //eventlisteners for delete
  document.querySelector("#form-delete-movie").addEventListener("submit", deleteMovieClicked);
  document.querySelector("#form-delete-movie .btn-cancel").addEventListener("click", cancelDelete);

  // eventlisteners for update
  document.querySelector("#update-movie-form").addEventListener("submit", updateMovieClicked);
  document.querySelector("#update-movie-form .btn-cancel").addEventListener("click", cancelUpdate);

  // adding eventlisteners for search functions
  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);

  // adding eventlisteners for sort functions
  document.querySelector("#sort-by").addEventListener("change", sortByChanged);
}

// ========== READ ========== //
async function getMovies() {
  const response = await fetch(`${endpoint}/movies.json`);
  const data = await response.json();

  const movies = prepareMovieData(data);
  return movies;
}

// ========== Create Function ========== //

function showCreateMovie(event) {
  event.preventDefault;
  document.querySelector("#create-post-dialog").showModal();
}

function createMovieClicked(event) {
  console.log("createMoviesClicked called..");
  const form = event.target;

  const image = form.image.value;
  const title = form.title.value;
  const description = form.description.value;
  const director = form.director.value;
  const length = form.lengthminutes.value;
  const year = form.yearpublished.value;
  const color = form.color.value;

  createMovie(image, title, description, director, length, year, color);
}

async function createMovie(image, title, description, director, lengthminutes, yearpublished, color) {
  const newMovie = {
    image: image,
    title: title,
    description: description,
    director: director,
    lengthminutes: Number(lengthminutes),
    yearpublished: Number(yearpublished),
    color: Boolean(color),
  };

  const json = JSON.stringify(newMovie);

  const response = await fetch(`${endpoint}/movies.json`, {
    method: "POST",
    body: json,
  });

  if (response.ok) {
    console.log("Congratulations, new movie was created succesfully!");
    updateMovieGrid();
  } else {
    console.log("Something went wrong. Please try again");
    document.querySelector("#error-message-create").textContent = "Something went wrong. Please try again.";
    document.querySelector("#create-post-dialog").showModal();
  }
}

// ========== Delete Function ========== //
function deleteMovieClicked(event) {
  const id = event.target.getAttribute("data-id");
  deleteMovie(id);
}

function cancelDelete() {
  console.log("cancel btn clicked");
  document.querySelector("#dialog-delete-movie").close();
}

async function deleteMovie(id) {
  const response = await fetch(`${endpoint}/movies/${id}.json`, {
    method: "DELETE",
  });

  if (response.ok) {
    console.log("Delete movie works");
    updateMovieGrid();
  }
}

// ========== Update Function ========== //
async function updateMovieGrid() {
  movies = await getMovies();
  showMovies(movies);
  updateDatalist(movies);
}

function cancelUpdate() {
  console.log("cancel btn clicked");
  document.querySelector("#update-movie-dialog").close();
}

function updateMovieClicked(event) {
  const form = event.target;

  const title = form.title.value;
  const description = form.description.value;
  const image = form.image.value;
  const director = form.director.value;
  const movieLength = Number(form.lengthminutes.value);
  const yearpublished = Number(form.yearpublished.value);
  const color = Boolean(form.color.value);

  const id = form.getAttribute("data-id");
  updateMovie(id, title, description, image, director, movieLength, yearpublished, color);
}

async function updateMovie(id, title, description, image, director, lengthminutes, yearpublished, color) {
  const movieToUpdate = {
    title,
    description,
    image,
    director,
    lengthminutes,
    yearpublished,
    color,
  }; // movie update to update
  const json = JSON.stringify(movieToUpdate); // convert the JS objekt to JSON string
  const response = await fetch(`${endpoint}/movies/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("Movie succesfully updatet in firebase");
    updateMovieGrid();
  } else {
    console.log("Something went wrong. Please try again");
    document.querySelector("#error-message-update").textContent = "Something went wrong. Please try again.";
    document.querySelector("#update-movie-dialog").showModal();
  }
}

// ========== HTML opsætning ========== //

function showMovies(movieList) {
  document.querySelector("#movies").innerHTML = ""; // tømmer hele div'en for movie elementer
  for (const movie of movieList) {
    showMovie(movie);
  }
}

function showMovie(movieObject) {
  document.querySelector("#movies").insertAdjacentHTML(
    "beforeend",
    /*html*/ `
    <article>
      <img src=${movieObject.image}>
      <h2>${movieObject.title}</h2>
      <p>${movieObject.description}</p>
      <button class="btn-delete">Delete</button>
      <button class="btn-update">Update</button>
    </article>
  `
  );

  // add event listeners to detail view
  document.querySelector("#movies article:last-child").addEventListener("click", movieClicked);

  // add event listeners to .btn-delete and .btn-update
  document.querySelector("#movies article:last-child .btn-delete").addEventListener("click", deleteClicked);
  document.querySelector("#movies article:last-child .btn-update").addEventListener("click", updateClicked);

  function deleteClicked() {
    console.log("Delete button clicked");
    document.querySelector("#dialog-delete-title").textContent = movieObject.title;
    document.querySelector("#form-delete-movie").setAttribute("data-id", movieObject.id);
    document.querySelector("#dialog-delete-movie").showModal();
  }

  function updateClicked() {
    const updateForm = document.querySelector("#update-movie-form");
    updateForm.title.value = movieObject.title;
    updateForm.description.value = movieObject.description;
    updateForm.image.value = movieObject.image;
    updateForm.director.value = movieObject.director;
    updateForm.lengthminutes.value = movieObject.lengthminutes;
    updateForm.yearpublished.value = movieObject.yearpublished;
    updateForm.color.value = movieObject.color;
    updateForm.setAttribute("data-id", movieObject.id);
    document.querySelector("#update-movie-dialog").showModal();
  }
  function movieClicked() {
    showMovieClicked(movieObject);
  }
}

// funktion til at vise detail view
function showMovieClicked(movieObject) {
  console.log(movieObject);
  document.getElementById("dialog-detail-image").src = movieObject.image;
  document.getElementById("dialog-detail-title").textContent = movieObject.title;
  document.getElementById("dialog-detail-description").textContent = `${movieObject.description}`;
  document.getElementById("dialog-detail-director").textContent = `Director: ${movieObject.director}`;
  document.getElementById("dialog-detail-lengthminutes").textContent = `Runtime: ${movieObject.lengthminutes}`;
  document.getElementById("dialog-detail-yearpublished").textContent = `Published in: ${movieObject.yearpublished}`;
  if (movieObject.color === true) {
    document.getElementById("dialog-detail-color").textContent = `The movie is in color`;
  } else {
    document.getElementById("dialog-detail-color").textContent = `The movie is in black and white`;
  }

  document.querySelector("#dialog-detail").showModal();
}

// ========== Objekt til array ========== //
function prepareMovieData(dataObjekt) {
  const movieArray = [];
  for (const key in dataObjekt) {
    const movie = dataObjekt[key];
    movie.id = key;
    movieArray.push(movie);
  }
  return movieArray;
}

function updateDatalist(movieObject) {
  const datalist = document.querySelector("#directors");
  const uniqueDirectors = new Set();
  for (const i in movieObject) {
    const movieDirector = movieObject[i].director;
    if (!uniqueDirectors.has(movieDirector)) {
      uniqueDirectors.add(movieDirector);
      const option = document.createElement("option");
      option.value = movieDirector;
      datalist.appendChild(option);
    }
  }
}

// ========== search functions ========== //
function inputSearchChanged() {
  const value = this.value;
  const moviesToShow = searchMovies(value);
  showMovies(moviesToShow);
}

function searchMovies(searchValue) {
  searchValue = searchValue.toLowerCase();

  const results = movies.filter(checkTitle);

  function checkTitle(movie) {
    const title = movie.title.toLowerCase();
    return title.includes(searchValue);
  }

  return results;
}

// ========== sort functions ========== //
function sortByChanged(event) {
  const value = event.target.value;

  if (value === "none") {
    updateMovieGrid();
    //console.log(movies);
  } else if (value === "title") {
    movies.sort(compareTitle);
    //console.log(movies);
    showMovies(movies);
  } else if (value === "description") {
    movies.sort(compareDescription);
    //console.log(movies);
    showMovies(movies);
  } else if (value === "year") {
    movies.sort(compareYear);
    showMovies(movies);
  }

  function compareTitle(movie1, movie2) {
    return movie1.title.localeCompare(movie2.title);
  }

  function compareDescription(movie1, movie2) {
    return movie1.description.localeCompare(movie2.description);
  }

  function compareYear(movie1, movie2) {
    return movie1.yearpublished - movie2.yearpublished;
  }
}

// ========== filter functions ==========

//Monochrome
function filterByColor() {
  const monochrome = document.querySelector("#monochrome");

  if (monochrome.checked) {
    const blackAndWhiteMovies = movies.filter(isColor);
    showMovies(blackAndWhiteMovies);
  } else if (!monochrome.checked) {
    showMovies(movies);
  }
}

function isColor(movie) {
  const monochrome = document.querySelector("#monochrome").value;
  if (!movie.color) {
    return movie;
  }
}

//Decades
function filterByDecades() {
  const eighties = document.querySelector("#eighties");
  const nineties = document.querySelector("#nineties");
  const zeroes = document.querySelector("#zeroes");
  const tens = document.querySelector("#tens");
  const twenties = document.querySelector("#twenties");

  if (eighties.checked || nineties.checked || zeroes.checked || tens.checked || twenties.checked) {
    const result = movies.filter(checkDecade);
    showMovies(result);
  } else {
    showMovies(movies);
  }

  function checkDecade(movie) {
    if (eighties.checked && movie.yearpublished >= 1980 && movie.yearpublished < 1990) {
      return movie;
    } else if (nineties.checked && movie.yearpublished >= 1990 && movie.yearpublished < 2000) {
      return movie;
    } else if (zeroes.checked && movie.yearpublished >= 2000 && movie.yearpublished < 2010) {
      return movie;
    } else if (tens.checked && movie.yearpublished >= 2010 && movie.yearpublished < 2020) {
      return movie;
    } else if (twenties.checked && movie.yearpublished >= 2020 && movie.yearpublished < 2030) {
      return movie;
    }
  }

  //showMovies(result)
}
