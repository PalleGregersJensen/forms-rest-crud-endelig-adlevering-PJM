"use strict";
// ========== Globale variables ========== //

const endpoint =
  "https://movies-forms-rest-crud-afl-default-rtdb.europe-west1.firebasedatabase.app/";

let movies;

// ========== Load & startup ========== //
window.addEventListener("load", startApp);

function startApp() {
  // update the grid of movies: get and show all movies
  updateMovieGrid();
}

// ========== READ ========== //
async function getMovies() {
  const response = await fetch(`${endpoint}/movies.json`);
  const data = await response.json();

  const movies = prepareMovieData(data);
  return movies;
}

// ========== Update Function ========== //
async function updateMovieGrid() {
  document.querySelector("#movies").innerHTML = ""; // tømmer hele div'en for movie elementer
  movies = await getMovies();

  showMovies(movies);
}

// ========== HTML opsætning ========== //

function showMovies(movieList) {
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
