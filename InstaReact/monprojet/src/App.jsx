import { Route, Routes } from "react-router";
import './App.css'
import Footer from './Footer.jsx'
import SignIn from './inscription.jsx'
import LogIn from './connexion.jsx'
import Produits from './Produit.jsx'
import Menu from "./Menu.jsx";
import AjoutProduit from './AjoutProduit.jsx'
import Panier from './Panier.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function App() {
  return (
    <div className="layout">
      <Menu />

      <main className="content">
        <Routes>
          {/* Routes publiques */}
          <Route path="/produits" element={<Produits />} />
          <Route path="/connexion" element={<LogIn />} />
          <Route path="/inscription" element={<SignIn />} />

          {/* Connecté (utilisateur ou admin) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/panier" element={<Panier />} />
          </Route>

          {/* Admin seulement */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/ajoutproduit" element={<AjoutProduit />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
