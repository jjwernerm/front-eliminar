// BuscarEliminar.jsx
import { useState, useContext, useEffect } from 'react';
// Importa hooks de React para gestionar el estado y efectos colaterales.

import { ImSpinner9 } from "react-icons/im";
// Importa un ícono de spinner para mostrar mientras se realiza una acción.

import { MdDeleteForever } from "react-icons/md";
// Importa un ícono para representar la acción de eliminación.

import Alert from '../componentes/Alert.jsx';
// Importa el componente Alert para mostrar mensajes de error o éxito.

import ModalDialogs from '../componentes/Modal.jsx';
// Importa el componente ModalDialogs para confirmar la eliminación.

import { DatosContext } from '../context/DatosContext.jsx';
// Importa el contexto para acceder a datos y funciones compartidos entre componentes.

export default function Consultar() {
  // Componente principal para buscar y eliminar productos.

  // Obtiene valores y funciones del contexto.
  const { idproducto, setIdProducto, btnValueEliminar, resjson, configAxios } = useContext(DatosContext);

  // Estados del componente.
  const [spinner, setSpinner] = useState(false); // Estado para mostrar el spinner durante la búsqueda.
  const [btn, setBtn] = useState(true); // Estado para habilitar/deshabilitar el botón de búsqueda.
  const [globalErrorMsg, setGlobalErrorMsg] = useState(''); // Estado para mostrar mensajes de error globales.
  const [producto, setProducto] = useState(null); // Estado para almacenar el producto encontrado.
  const [modal, setModal] = useState(false); // Estado para controlar la visibilidad del modal.

  useEffect(() => {
    // Efecto que se ejecuta cuando cambia `resjson`.
    if (btnValueEliminar) {
      setProducto(''); // Limpia el producto cuando se elimina uno.
      msgEliminado(); // Muestra el mensaje de producto eliminado.
    }
  }, [resjson]);

  const msgEliminado = async () => {
    // Función para mostrar el mensaje de eliminación.
    setGlobalErrorMsg(resjson); // Actualiza el mensaje global con el contenido de `resjson`.
    await new Promise(resolve => setTimeout(resolve, 3000)); // Espera 3 segundos.
    setGlobalErrorMsg(''); // Limpia el mensaje global después de la espera.
  };

  const handleIdProductoChange = (e) => {
    // Función para manejar el cambio en el campo del ID del producto.
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Verifica que el valor sea un número.
      setIdProducto(value); // Actualiza el ID del producto en el contexto.
    }
    setBtn(!value); // Habilita o deshabilita el botón según si el campo está vacío.
  };

  const handleBuscar = async e => {
    // Función para manejar la búsqueda del producto.
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    setGlobalErrorMsg(''); // Limpia los mensajes de error globales.
    setProducto(null); // Limpia el producto encontrado anteriormente.
    setSpinner(true); // Muestra el spinner mientras se realiza la búsqueda.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo para simular la carga.
    setSpinner(false); // Oculta el spinner después de la espera.

    try {
      const url = `/consultar/${idproducto}`; // Construye la URL para la solicitud.
      const { data } = await configAxios.get(url); // Realiza la solicitud GET para buscar el producto.
      setProducto(data); // Establece el producto encontrado.
      setIdProducto(''); // Limpia el campo de ID del producto.
      setBtn(true); // Habilita el botón de búsqueda.

    } catch (error) {
      // Maneja errores durante la búsqueda.
      setGlobalErrorMsg({
        msg: error.response?.data?.msg || 'Error en la solicitud: contactar al administrador',
        error: false
      });

    } finally {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Espera 3 segundos.
      setGlobalErrorMsg(''); // Limpia el mensaje global después de la espera.
    }
  };

  const handleOpenModal = () => {
    // Función para abrir el modal.
    setModal(true); // Actualiza el estado para mostrar el modal.
  };

  const handleCloseModal = () => {
    // Función para cerrar el modal.
    setModal(false); // Actualiza el estado para ocultar el modal.
  };

  return (
    <>
      <a
        href='https://crud-producto-seven.vercel.app/'
        className="ml-5 underline">
        Regresar al Dashboard
      </a>
      <div className="flex flex-col items-center my-4">

        <form
          className="border border-gray-100 rounded-xl w-9/12 md:w-3/12 p-4 shadow-md"
          onSubmit={handleBuscar}
        >
          <div className="text-center font-bold">Producto a Eliminar</div>

          <div className="mt-4">
            <label htmlFor="input-id" className="text-gray-500">Id Producto <span className='text-red-500'>*</span></label>
            <input
              type="number"
              placeholder="Escribe el id del producto"
              id="input-id"
              className="border-gray-100 focus:ring-green-400 bg-gray-100 p-1 rounded-xl w-full outline-none focus:ring-1"
              value={idproducto}
              onChange={handleIdProductoChange}
            />
          </div>

          <button
            type="submit"
            className={`
          ${btn ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-500'} w-full py-3 px-10 rounded-xl 
          text-white uppercase font-bold mt-5 flex items-center justify-center
        `}
            disabled={btn}
          >
            {spinner ? (
              <div className="flex items-center">
                <ImSpinner9 className="animate-spin h-5 w-5 text-white mr-2" />
                Buscando...
              </div>
            ) : (
              'Buscar'
            )}
          </button>
          {/* Botón para realizar la búsqueda, que muestra un spinner cuando está en proceso */}

          {globalErrorMsg.msg && <Alert props={globalErrorMsg} />}
          {/* Muestra el componente Alert si hay un mensaje de error global */}
        </form>

        <div className="flex justify-center w-full">
          <table className="border-separate border-spacing-1 border border-slate-500 rounded w-full mx-1 my-4 md:w-1/2 text-sm md:text-base">
            <caption className="caption-top font-bold">
              Producto a Eliminar
            </caption>
            <thead>
              <tr>
                <th></th>
                <th className="bg-slate-200 border border-slate-600 rounded">Id Producto</th>
                <th className="bg-slate-200 border border-slate-600 rounded">Nombre del Producto</th>
              </tr>
            </thead>
            {producto && (
              <tbody>
                <tr>
                  <td className='flex justify-center text-2xl text-red-600'>
                    <button
                      onClick={handleOpenModal}
                    ><MdDeleteForever /></button>
                    {/* Botón para abrir el modal de eliminación */}
                  </td>
                  <td>{producto.idproducto}</td>
                  <td>{producto.nombre}</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        <div>
          {modal && <ModalDialogs nombre={producto.nombre} idproducto={producto.idproducto} onClose={handleCloseModal} />}
          {/* Muestra el modal si `modal` es true */}
        </div>
      </div>
    </>
  );
};