import React, { useEffect, useState } from 'react';
import { readYamlFile } from './utils/readYaml';
import './App.css';

function obtenerCarpetaDeRuta(ruta) {
  // Extrae la carpeta contenedora de la ruta completa
  if (!ruta) return '';
  const partes = ruta.split(/[\\/]/);
  partes.pop(); // Quita el archivo
  return partes.join('/');
}

function App() {
  const [archivos, setArchivos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      const data = await readYamlFile('/src/files_2.yaml');//archivo de descripcion de archivos
      setArchivos(data);
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!busqueda) {
      setFiltrados(archivos);
    } else {
      setFiltrados(
        archivos.filter(
          (a) =>
            a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.descripcion.toLowerCase().includes(busqueda.toLowerCase())
        )
      );
    }
  }, [busqueda, archivos]);

  return (
    <div className="buscador-container">
      <h1>Buscador de Archivos</h1>
      <input
        className="campo-busqueda"
        type="text"
        placeholder="Buscar archivos..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />
      <div className="resultados">
        {filtrados && filtrados.length > 0 ? (
          filtrados.map((archivo, idx) => (
            <div className="resultado" key={idx}>
              <div className="nombre">{archivo.nombre}</div>
              <div className="descripcion">{archivo.descripcion}</div>
              <a
                className="enlace-carpeta"
                href={`file:///${obtenerCarpetaDeRuta(archivo.ruta)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir carpeta
              </a>
            </div>
          ))
        ) : (
          <div className="sin-resultados">No se encontraron archivos.</div>
        )}
      </div>
    </div>
  );
}

export default App;
