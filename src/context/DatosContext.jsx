import { createContext, useState } from 'react';
import configAxios from '../config/axios.jsx';

export const DatosContext = createContext();

export const DatosProvider = ({ children }) => {
  const [idproducto, setIdProducto] = useState('');
  const [btnValueEliminar, setBtnValueEliminar] = useState('');
  const [resjson, setResjson] = useState({});


  return (
    <DatosContext.Provider value={{ idproducto, setIdProducto, btnValueEliminar, setBtnValueEliminar, resjson, setResjson, configAxios }}>
      {children}
    </DatosContext.Provider>
  );
};