//Componente que aparece en la vista recientes, carrousel de cómics

import { useState, useEffect } from 'react';

export default function ComicCarousel({ favorites, toggleFavorite, filters, openPopup }) {
    //VARIABLES
    const [comics, setComics] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(2); //Índice para el carrousel, empezar en el tercero
    const [isLoading, setIsLoading] = useState(false); //Mostrar mensaje de carga

    // Variables para la API
    const hash = 'd100e38c62fc4dcaea9841688cac1964';
    const publicKey = 'bebb3c74579f7d835e2ecf6bd8734e70';
    const ts = '2';

    //FUNCIONES
    //Función para generar la url según los filtros de la búsqueda avanzada
    const generarApiUrl = () => {
        let url = `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&orderBy=-modified`;
        if(filters.year){
            url+=`&startYear=${filters.year}`;
        } 
        if(filters.genre){
            url+=`&format=${filters.genre}`;
        } 
        if(filters.characterId){
            url+=`&characters=${filters.characterId}`;
        }
        return url;
    }
    //Cargar cómics al principio y cada vez que se actualicen los filtros
    useEffect(() => {
        setIsLoading(true);
        fetch(generarApiUrl())
            .then((results) => results.json())
            .then((data) => {
                setComics(data.data.results);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log("Error en el fetch de los comics:", error);
                setIsLoading(false);
            });
    }, [filters]);
    //Desplazamiento circular entre los cómics
    const handleMoveLeft = () => {
        setCurrentIndex((prevIndex) => {return (prevIndex - 1 + comics.length) % comics.length;});    
    };
    const handleMoveRight = () => {
        setCurrentIndex((prevIndex) => {return (prevIndex + 1) % comics.length;});    
    };
    //Función auxiliar para obtener un índice circular
    const getCircularIndex = (index) => {
        return (index + comics.length) % comics.length;
    }

    return (
        <div className="carousel-container"> {/*Contenedor padre carrousel*/}
            {isLoading && <div className="loading-spinner">Cargando...</div>} {/*Mostrar mensaje de carga*/}
            <button onClick={handleMoveLeft} className="carousel-button">‹</button> {/*Desplazamiento*/}
            <div className="carousel"> {/*Carrousel de cómics*/}
                {comics.length > 0 && [...Array(5)].map((_, i) => { {/*Array temporal de 5 comics e iteración sobre todos*/}
                        const comicIndex = getCircularIndex(currentIndex - 2 + i);
                        const comic = comics[comicIndex];
                        const isCenter = i === 2; //Centro de los 5 cómics
                        return (
                            //Renderizar cada comic, si es el central se le añade la clase center, sino side
                            <div
                                key={comic.id}
                                className={`carousel-item ${isCenter ? 'center' : 'side'}`}
                                style={{ position: "relative" }}
                                onClick={() => openPopup(comic)}
                            >
                                {/*Renderizar imagen del comic, con filtro opaco si no es el centrar*/}
                                <img
                                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                    alt={comic.title}
                                    className="comic-image"
                                    style={{ filter: isCenter ? 'none' : 'brightness(0.5)' }}
                                />
                                {/*Icono de favorito*/}
                                <span 
                                    className="favorite-icon"
                                    onClick={(e) => {
                                        e.stopPropagation(); //Evita openpopup
                                        toggleFavorite(comic);
                                    }}
                                    //Cambiar color si es favorito
                                    style={{ color: favorites.some(fav => fav.id === comic.id) ? '#ffcc00' : '#ffffff' }}
                                >★</span>
                                {/*Si es el central mostrar titulo*/}
                                {isCenter && <h2 className="comic-title">{comic.title}</h2>}
                            </div>
                        );
                    })
                }
            </div>
            <button onClick={handleMoveRight} className="carousel-button">›</button>
        </div>
    );
}
