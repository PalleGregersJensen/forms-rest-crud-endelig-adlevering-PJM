"use strict";
// ========== Globale variables ========== //

const endpoint = "https://movies-forms-rest-crud-afl-default-rtdb.europe-west1.firebasedatabase.app/";
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
  console.log(movies);
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

  createMovie(image, title, description);

  form.reset();
  document.querySelector("#create-post-dialog").close();
}

async function createMovie(image, title, description) {
  const newMovie = {
    image: image,
    title: title,
    description: description,
  };

  const json = JSON.stringify(newMovie);

  const response = await fetch(`${endpoint}/movies.json`, {
    method: "POST",
    body: json,
  });

  if (response.ok) {
    console.log("Congratulations, new movie was created succesfully!");
    updateMovieGrid();
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
  const movieLength = form.movielength.value;
  const yearPublished = form.yearPublished.value;
  const color = form.color.value;

  if (form.color.value === yes) {
    color = true;
  } else {
    color = false;
  }

  const id = form.getAttribute("data-id");
  updateMovie(id, title, description, image, director, movieLength, yearPublished, color);
}

async function updateMovie(id, title, description, image, director, movielength, yearPublished, color) {
  const movieToUpdate = { title, description, image, director, movielength, yearPublished, color }; // movie update to update
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
    document.querySelector("#error-message-create-new").textContent = "Something went wrong. Please try again.";
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
  console.log(movieObject);
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
    console.log(movieObject);
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
    console.log(movies);
  } else if (value === "title") {
    movies.sort(compareTitle);
    console.log(movies);
    showMovies(movies);
  } else if (value === "description") {
    movies.sort(compareDescription);
    console.log(movies);
    showMovies(movies);
  }

  function compareTitle(movie1, movie2) {
    return movie1.title.localeCompare(movie2.title);
  }

  function compareDescription(movie1, movie2) {
    return movie1.description.localeCompare(movie2.description);
  }
}
