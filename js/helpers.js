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

export { prepareMovieData, updateDatalist };
