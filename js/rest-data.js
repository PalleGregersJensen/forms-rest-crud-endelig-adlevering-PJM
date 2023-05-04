import { prepareMovieData } from "./helpers.js";
// global variable //
const endpoint = "https://movies-forms-rest-crud-afl-default-rtdb.europe-west1.firebasedatabase.app/";
// ========== READ ========== //

async function getMovies() {
  const response = await fetch(`${endpoint}/movies.json`);
  const data = await response.json();

  const movies = prepareMovieData(data);
  return movies;
}

// create new movie - HTTP Method: POST
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
  return response;
}

// delete an existing movie - HTTP Method: DELETE
async function deleteMovie(id) {
  const response = await fetch(`${endpoint}/movies/${id}.json`, {
    method: "DELETE",
  });
  return response;
}

// update an exitsting movie - HTTP Method: PUT
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
  return response;
}

export { getMovies, createMovie, deleteMovie, updateMovie };
