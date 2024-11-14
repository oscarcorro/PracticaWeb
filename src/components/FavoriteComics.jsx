//Componente que aparece en la vista de favoritos

export default function FavoriteComics({favorites, toggleFavorite, openPopup}){
    return(
        <div className="contenedor-principal"> {/*Contenedor padre*/}
            <h1 className="titulo">Comics Favoritos</h1>
            <div className="grid-container">
                {favorites.length > 0 ? ( //Si hay favoritos renderiza cada uno
                    favorites.map((comic) => (
                        <div key={comic.id} className="comic-card" onClick={() => openPopup(comic)}>
                            <div className="comic-content"> {/*Contenedor de cada comic*/}
                                <img
                                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                    alt={comic.title}
                                    className="comic-image"
                                />
                                <div className="comic-info">
                                    <h2 className="comic-title">{comic.title}</h2>
                                    <button className="remove-favorite-button" onClick={(e) => {
                                        e.stopPropagation(); //Evita openpopup
                                        toggleFavorite(comic);
                                    }}>
                                        Quitar de favoritos
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay comics favoritos</p>
                )}
            </div>
        </div>
    )
}