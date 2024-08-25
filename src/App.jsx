import { DatosProvider } from './context/DatosContext.jsx';
import Header from './layout/Header.jsx';
import Footer from './layout/Footer.jsx';
import BuscarEliminar from './views/BuscarEliminar.jsx';

function App() {
  return (
    <>
      <DatosProvider>
        <Header />
        <BuscarEliminar />
        <Footer />
      </DatosProvider>
    </>
  );
};

export default App;