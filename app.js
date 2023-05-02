"use strict";
// ========== Globale variables ========== //

const endpoint = "https://movies-forms-rest-crud-afl-default-rtdb.europe-west1.firebasedatabase.app/";
let movies;

// ========== Load & startup ========== //
window.addEventListener("load", startApp);

function startApp() {
  // update the grid of movies: get and show all movies
  updateMovieGrid();
  //eventlisteners for delete
  document.querySelector("#form-delete-movie").addEventListener("submit", deleteMovieClicked);
  document.querySelector("#form-delete-movie .btn-cancel").addEventListener("click", cancelDelete);
  // eventlisteners for update
  document.querySelector("#update-movie-form").addEventListener("submit", updateMovieClicked);
  document.querySelector("#update-movie-form .btn-cancel").addEventListener("click", cancelUpdate);
  // adding eventlisteners for search functions
  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}

// ========== READ ========== //
async function getMovies() {
  const response = await fetch(`${endpoint}/movies.json`);
  const data = await response.json();

  const movies = prepareMovieData(data);
  return movies;
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

  const id = form.getAttribute("data-id");
  updateMovie(id, title, description, image);
}

async function updateMovie(id, title, description, image) {
  const movieToUpdate = { title, description, image }; // movie update to update
  const json = JSON.stringify(movieToUpdate); // convert the JS objekt to JSON string
  console.log(movieToUpdate);
  const response = await fetch(`${endpoint}/movies/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("Movie succesfully updatet in firebase");
    updateMovieGrid();
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
