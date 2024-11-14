//Componente para implementar una búsqueda avanzada por filtros

import { useState } from "react";

export default function AdvancedSearch({setFilters}){
    //Filtros por año, genero y personajes
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [character, setCharacter] = useState('');

    //aplicar filtros
    const handleSearch = () => {
        setFilters({year, genre, characterId: character});
    };

    return(
        <div className="advanced-search">
            <input //Filtro de año
                type="number" 
                placeholder="Año" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
            />
            <select value={genre} onChange={(e) => setGenre(e.target.value)}> {/*Seleccionar tipo*/}
                <option value="">Seleccionar género</option>
                <option value="comic">Cómic</option>
                <option value="digital comic">Cómic digital</option>
                <option value="hardcover">Hardcover</option>
            </select>
            <input //Filtrar por id de personaje que aparece
                type="text" 
                placeholder="ID del personaje" 
                value={character} 
                onChange={(e) => setCharacter(e.target.value)} 
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
}