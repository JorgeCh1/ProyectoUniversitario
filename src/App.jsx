import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'
import Home from './modules/store/Home.jsx'
import AdminMain from './modules/admin/AdminMain.jsx'


function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Home />
       {/*<AdminMain />*/}
      </main>
      <Footer />
    </div>
  )
}

export default App
