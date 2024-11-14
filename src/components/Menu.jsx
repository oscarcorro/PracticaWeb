//Este componente es un menú para alternar entre los comics recientes o favoritos

import React from 'react';

export default function Menu({ setVista, vista }) {
    //Es un navegador que tiene dos botones de la clase boton-menu y, si se les asigna la vista se activan para 
    //cambiar la página, sino no
    return (
        <nav className="menu">
            <button onClick={() => setVista('recent')} className={`boton-menu ${vista === 'recent' ? 'active' : ''}`}>
                Comics Recientes
            </button>
            <button onClick={() => setVista('favorites')} className={`boton-menu ${vista === 'favorites' ? 'active' : ''}`}>
                Comics Favoritos
            </button>
        </nav>
    );
}
