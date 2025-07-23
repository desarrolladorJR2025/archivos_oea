import React, { useEffect, useState } from 'react';
import { readYamlFile } from './utils/readYaml';
import './App.css';

function normalizar(texto) {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function InputBusqueda({ busqueda, setBusqueda }) {
  return (
    <input
      className="campo-busqueda"
      type="text"
      placeholder="Buscar archivos..."
      value={busqueda}
      onChange={e => setBusqueda(e.target.value)}
      aria-label="Buscar archivos"
    />
  );
}

function ResultadoArchivo({ archivo }) {
  const esEnlace = archivo.ruta && archivo.ruta.startsWith('http');
  const icono = archivo.tipo === 'Word' ? '📄' : archivo.tipo === 'PDF' ? '📑' : archivo.tipo === 'Excel' ? '📊' : archivo.tipo === 'PowerPoint' ? '📑' : '📁';
  return (
    <div className="resultado">
      <div className="nombre">{icono} {archivo.nombre}</div>
      <div className="descripcion">{archivo.descripcion}</div>
      {esEnlace ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
  <a
    className="enlace-carpeta"
    href={archivo.ruta}
    target="_blank"
    rel="noopener noreferrer"
  >
    Abrir documento
  </a>
</div>

      ) : archivo.ruta ? (
        <div className="ruta-local">
          <span>{archivo.ruta}</span>
          <button onClick={() => navigator.clipboard.writeText(archivo.ruta)} className="copiar-btn">Copiar ruta</button>
        </div>
      ) : (
        <span className="sin-ruta">Sin ruta disponible</span>
      )}
    </div>
  );
}

function ListaResultados({ archivos }) {
  if (!archivos.length) {
    return <div className="sin-resultados">No se encontraron archivos.</div>;
  }
  return (
    <div className="resultados">
      {archivos.map((archivo, idx) => (
        <ResultadoArchivo key={idx} archivo={archivo} />
      ))}
    </div>
  );
}

function App() {
  const [archivos, setArchivos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      setError('');
      try {
        const data = await readYamlFile('/files_2.yaml');
        if (!Array.isArray(data)) throw new Error('El archivo YAML no contiene una lista.');
        const limpio = data.map(item => ({
          nombre: typeof item.nombre === 'string' ? item.nombre : '',
          descripcion: typeof item.descripcion === 'string' ? item.descripcion : '',
          ruta: typeof item.ruta === 'string' ? item.ruta : '',
          tipo: typeof item.tipo === 'string' ? item.tipo : ''
        }));
        setArchivos(limpio);
      } catch (e) {
        setError('Error al cargar los archivos. Verifica el formato del YAML.');
        setArchivos([]);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!busqueda) {
      setFiltrados(archivos);
    } else {
      const terminoNormalizado = normalizar(busqueda);
      setFiltrados(
        archivos.filter((a) =>
          normalizar(a.nombre).includes(terminoNormalizado) ||
          normalizar(a.descripcion).includes(terminoNormalizado)
        )
      );
    }
  }, [busqueda, archivos]);

  return (
    <div className="buscador-container">
      <h1>Buscador de Procesos TI</h1>
      <InputBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
      {error && <div className="error-msg">{error}</div>}
      {cargando ? <div className="cargando">Cargando archivos...</div> : <ListaResultados archivos={filtrados} />}
    </div>
  );
}

export default App;
