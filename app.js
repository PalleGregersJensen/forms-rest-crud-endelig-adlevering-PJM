"use strict";

window.addEventListener("load", startApp);

const endpoint = "https://movies-forms-rest-crud-afl-default-rtdb.europe-west1.firebasedatabase.app/";

let movies;

function startApp() {
  movies = getMovies();
  console.log(movies);
}

async function getMovies() {
  const response = await fetch(`${endpoint}/movies.json`);
  const data = await response.json();

  return data;
}
