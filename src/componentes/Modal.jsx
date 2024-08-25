// Modal.jsx
import { useState, useContext, useEffect } from 'react'; 
// Importa hooks de React para gestionar el estado y efectos colaterales.

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'; 
// Importa componentes de Headless UI para crear el modal.

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; 
// Importa un ícono de advertencia para el modal.

import { DatosContext } from '../context/DatosContext.jsx'; 
// Importa el contexto para acceder a datos y funciones compartidos entre componentes.

import { ImSpinner9 } from "react-icons/im"; 
// Importa un ícono de spinner para mostrar mientras se realiza la acción de eliminación.

export default function Example({ idproducto, nombre, onClose }) {
  // Componente de modal para confirmar la eliminación del producto.

  // Obtiene valores y funciones del contexto.
  const { resjson, setResjson, setBtnValueEliminar, configAxios } = useContext(DatosContext);

  // Estados del componente.
  const [open, setOpen] = useState(true); // Estado para controlar la visibilidad del modal.
  const [spinner, setSpinner] = useState(false); // Estado para mostrar el spinner durante la eliminación.

  useEffect(() => {
    // Efecto que se ejecuta cuando cambia `resjson` (aunque está vacío en este caso).
  }, [resjson]);

  const eliminarProducto = async (e) => {
    // Función para manejar la eliminación del producto.
    setSpinner(true); // Muestra el spinner mientras se realiza la eliminación.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo para simular la carga.
    setSpinner(false); // Oculta el spinner después de la espera.

    try {
      const url = `/eliminar/${idproducto}`; // Construye la URL para la solicitud de eliminación.
      const respuesta = await configAxios.delete(url); // Realiza la solicitud DELETE para eliminar el producto.
      setResjson({
        msg: respuesta?.data?.msg || 'Producto Eliminado', // Actualiza el mensaje global con la respuesta.
        error: true
      });
    } catch (error) {
      // Maneja errores durante la eliminación.
      setResjson({
        msg: error.response?.data?.msg || 'Error en la solicitud: contactar al administrador',
        error: false
      });
    } finally {
      onClose(); // Llama a la función `onClose` para cerrar el modal.
      setBtnValueEliminar(e.target.value); // Actualiza el valor de `btnValueEliminar`.
    }
  };

  const handleOnClose = () => {
    // Función para manejar el cierre del modal.
    if (spinner) {
      return; // No permite cerrar el modal si el spinner está activo.
    }

    setOpen(false); // Oculta el modal.
    onClose(); // Llama a la función `onClose` para realizar cualquier acción adicional al cerrar el modal.
  };

  return (
    <Dialog open={open} onClose={handleOnClose} className="relative z-10">
      {/* Componente del modal de Headless UI */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      {/* Fondo oscuro detrás del modal */}

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        {/* Contenedor principal del modal */}
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {/* Panel del contenido del modal */}
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              {/* Contenedor de la parte superior del panel */}
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                  {/* Icono de advertencia */}
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Eliminar Producto
                  </DialogTitle>
                  {/* Título del modal */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Necesitas eliminar este producto?
                      <span className='font-bold'> {nombre}. </span>
                      Esta acción no se puede deshacer.
                    </p>
                    {/* Mensaje de confirmación */}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {/* Contenedor para los botones del modal */}
              <button
                type="button"
                value='eliminar'
                onClick={eliminarProducto}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                {spinner ? (
                  <div className="flex items-center">
                    <ImSpinner9 className="animate-spin h-5 w-5 text-white mr-2" />
                    Eliminando...
                  </div>
                ) : (
                  'Eliminar'
                )}
              </button>
              {/* Botón para confirmar la eliminación */}
              <button
                type="button"
                data-autofocus
                onClick={handleOnClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                disabled={spinner}
              >
                Cancelar
              </button>
              {/* Botón para cancelar la acción */}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};