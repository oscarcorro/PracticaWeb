//COMPONENTE PRINCIPAL

//COMPONENTES
import { useState, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu.jsx';
import FavoriteComics from './components/FavoriteComics.jsx';
import ComicCarousel from './components/ComicCarrousel.jsx';
import AdvancedSearch from './components/AdvancedSearch.jsx';

function App() {
  //VARIABLES
  const [vista, setVista] = useState('recent'); //menu, favoritos o recientes
  const [favorites, setFavorites] = useState(() => { //almacenar favoritos, utilizando localstorage
    const savedFavorties = localStorage.getItem('favorites');
    return savedFavorties ? JSON.parse(savedFavorties) : []; //si hay favoritos guardados convierte texto en array de objetos, sino uno vacío
  });
  const [filters, setFilters] = useState({}); //filtros de búsqueda
  const [selectedComic, setSelectedComic] = useState(null); //comic para popup
  const [characters, setCharacters] = useState([]); //carrousel de personajes
  const [isPopUpVisible, setIsPopUpVisible] = useState(false); //vista del popup
  const [characterIndex, setCharacterIndex] = useState(0); //carrousel de personajes

  //FUNCIONES
  //Almacenar en favoritos los comics que se habían seleccionado antes con localstorage
  //Hook que se ejecuta cada vez que favorites cambia
  useEffect(() => { 
    localStorage.setItem('favorites', JSON.stringify(favorites)); //array de objetos a cadena de texto
  }, [favorites]);
  //Marcar un cómic como favorito, si ya lo es lo quita de favoritos
  const toggleFavorite = (comic) => {
    if (favorites.some(fav => fav.id === comic.id)) {
      setFavorites(favorites.filter(fav => fav.id !== comic.id)); //si ya es favorito lo quita
    } else {
      setFavorites([...favorites, comic]); //si no es favorito lo añade
    }
  };
  //Abrir detalles del cómic
  const openPopup = (comic) => {
    //Fecha de lanzamiento
    const onSaleDate = comic.dates.find(date => date.type === 'onsaleDate');
    const releaseDate = onSaleDate ? new Date(onSaleDate.date).toLocaleDateString() : 'Fecha no disponible';
    //Actualizar comic y mostrar popup
    setSelectedComic({ ...comic, releaseDate });
    setIsPopUpVisible(true);
    // Variables para la API
    const hash = 'd100e38c62fc4dcaea9841688cac1964';
    const publicKey = 'bebb3c74579f7d835e2ecf6bd8734e70';
    const ts = '2';
    // Obtener los personajes del cómic para el carrousel
    //llamada a la api
    //  convertir respuesta en JSON
    //  actualizar personajes con los datos obtenidos
    //  empezar en el primer personaje
    //  capturar errores
    fetch(`http://gateway.marvel.com/v1/public/comics/${comic.id}/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
      .then((results) => results.json())
      .then((data) => {
        setCharacters(data.data.results)
        setCharacterIndex(0);
    })
      .catch((error) => console.log("Error en el fetch de los personajes:", error));
  };
  //Cerrar popup
  const closePopup = () => {
    setIsPopUpVisible(false); //ocultar popup
    setSelectedComic(null); //ningun comic seleccionado
    setCharacters([]); //array personajes vacio
  };
  //Navegar entre personajes en el carrousel
  const handleNextCharacter = () => {
    setCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
  }
  const handlePreviousCharacter = () => {
    setCharacterIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
  }

  //MAIN
  return (
    <div id="container"> {/*Contenedor padre*/}
      <div className="menu-advanced-container"> {/*Menu recientes(por defecto)/favoritos y añadir filtros*/}
        <Menu setVista={setVista} vista={vista} />
        {vista === 'recent' && <AdvancedSearch setFilters={setFilters} />}
      </div>
      <div className="content"> {/*Contenido dependiendo de la vista con las funciones respectivas*/}
        {vista === 'recent' && <ComicCarousel favorites={favorites} toggleFavorite={toggleFavorite} filters={filters} openPopup={openPopup} />}
        {vista === 'favorites' && <FavoriteComics favorites={favorites} toggleFavorite={toggleFavorite} openPopup={openPopup} />}
      </div>
      {/*Cuando se seleciona un comic y se abre el popup*/}
      {isPopUpVisible && selectedComic && (
        <div className="popup"> {/*Padre del popup*/}
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>X</button>
            <div className="popup-header"> {/*Imagen y título*/}
              <img
                //obtener la ruta y luego la extension de la imagen
                src={`${selectedComic.thumbnail.path}.${selectedComic.thumbnail.extension}`}
                alt={selectedComic.title}
                className="popup-comic-image"
              />
              <h2 className="popup-title">{selectedComic.title}</h2>
            </div>
            <p className="popup-release-date">{selectedComic.releaseDate}</p> {/*Fecha de lanzamiento*/}
            <p className="popup-description">{selectedComic.description || "No hay descripción disponible"}</p> {/*Descripción*/}
            <h3>Personajes:</h3>
            {characters.length > 0 ? ( //si hay más de 0 personajes
              <div className="character-carousel">
                <button className="carousel-arrow" onClick={handlePreviousCharacter}>‹</button> {/*Despalzamiento izquierda*/}
                <div className="character-image-container">
                  <img
                    src={`${characters[characterIndex].thumbnail.path}.${characters[characterIndex].thumbnail.extension}`}
                    alt={characters[characterIndex].name}
                    className="character-image"
                  />
                  <p>{characters[characterIndex].name}</p>
                </div>
                <button className="carousel-arrow" onClick={handleNextCharacter}>›</button> {/*Desplazamiento derecha*/}
              </div>
            ) : (
              <p>No hay personajes disponibles</p> //Si no, mostrar que no hay
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
