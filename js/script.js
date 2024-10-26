// Cuando la página cargue, deberá traer el listado de información sobre películas disponible en https://japceibal.github.io/japflix_api/movies-data.json, pero no mostrarlo al usuario.

const API_url = "https://japceibal.github.io/japflix_api/movies-data.json";
let movies;

// Traer la información de la API
fetch(API_url)
    .then((response) => response.json()) // Convertir la respuesta a JSON
    .then((array) => {
        console.log(array);
        movies = array;
    })
    .catch((error) => alert("Pasó algo terrible, Error 21003:" + error)); // En caso de error, mostrar un mensaje al usuario

// 2.1 - Tomar del campo de busqueda lo que ingresó el usuario.
const botonBuscar = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");

botonBuscar.addEventListener("click", () => {
    showMovies(moviesFiltered(inputBuscar.value, movies));
    console.log(moviesFiltered(inputBuscar.value, movies));
});

// 2.3 Mostar los datos de la lista filtrada.

function moviesFiltered(texto, lista) {
    let filtrados = [];
    texto = texto.toLowerCase();
    for (let item of lista) {
        if (
            item.title.toLowerCase().includes(texto) ||
            item.overview.toLowerCase().includes(texto) ||
            item.genres.some((genre) => genre.name.toLowerCase().includes(texto)) ||
            item.tagline.toLowerCase().includes(texto)
        ) {
            filtrados.push(item);
        }
    }
    return filtrados;
}

function getStars(rating) {
    let stars = "";
    let mitad = Math.round(rating / 2);

    for (let i = 0; i < mitad; i++) {
        stars += '<span class="fa fa-star checked"></span>';
    }
    for (let i = 0; i < 5 - Math.round(rating / 2); i++) {
        stars += '<span class="fa fa-star"></span>';
    }
    return stars;
}

function showMovies(movies) {
    const container = document.getElementById("lista");
    container.innerHTML = "";
    for (let peli of movies) {
        const li = document.createElement("li");
        li.innerHTML = `
         <li class="list-group-item bg-dark text-white d-flex justify-content-between">
                    <div class="">
                        <p class="fw-bold">${peli.title}</p>
                        <p class="fst-italic text-white-50">${peli.tagline}</p>
                    </div>
                    <div>
                    ${getStars(peli.vote_average)}
                    </div>
                </li>
        `;
        li.addEventListener("click", () => showDetails(peli));
        container.appendChild(li);
    }

    function showDetails(movie) {
        const detailsContainer = document.getElementById("details");
        detailsContainer.innerHTML = `
            <div class="offcanvas-header">
                <h2 class="offcanvas-title" id="movietitle">${movie.title}</h2>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <p>${movie.overview}</p>
                <hr>
                <p class="text-muted"> ${movie.genres.map((genre) => genre.name).join(", ")} </p>
            </div>
        <div class="dropdown ms-auto me-3 mb-3">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
              More info
          </button>
          <ul class="dropdown-menu px-3 pt-3" aria-labelledby="dropdownMenuButton">
              <li class="d-flex justify-content-between">Year: <p>${movie.release_date.split("-")[0]}</p></li>
              <li class="d-flex justify-content-between">Runtime: <p>${movie.runtime} mins</p></li>
              <li class="d-flex justify-content-between">Budget: <p>$${movie.budget}</p></li>
              <li class="d-flex justify-content-between">Revenue: <p> $${movie.revenue}</p></li>
          </ul>
      </div>
        `;
        const offcanvasElement = new bootstrap.Offcanvas(document.getElementById("details"));
        offcanvasElement.show();
    }
}
