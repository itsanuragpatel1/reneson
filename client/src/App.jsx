import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import GoogleCalender from './components/GoogleCalender'
import { useData } from './context/DataContext'
import ServiceDetail from './pages/ServiceDetail'
import Portfolio from './pages/Portfolio'
import { useAdmin } from './admin/context/AdminContext'
import { adminConfigs } from './admin/config/data.js'
import CRUDPage from './admin/pages/CRUDPage.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminLayout from './admin/pages/AdminLayout.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import ScrollToTop from './components/scrollToTop.jsx'
import {Toaster} from 'react-hot-toast'

function App() {

  const {showScheduler}=useData();
  const { isAdmin } = useAdmin()

  return (
    <>
      <Toaster/>
      <ScrollToTop/>
      {showScheduler && <GoogleCalender/>}
      <Routes>
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/service/:serviceName" element={<ServiceDetail />} />
              <Route path="/project/:id" element={<ProjectDetail/>}/>
            </Routes>
            <Footer />
          </>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          isAdmin ? (
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to={'/admin/projects'}/>} />
                <Route path="projects"element={<CRUDPage {...adminConfigs.projects} />} />
                <Route path="team" element={<CRUDPage {...adminConfigs.team} />} />
                <Route path="testimonials" element={<CRUDPage {...adminConfigs.testimonials} />} />
                <Route path="clients" element={<CRUDPage {...adminConfigs.clients} />} />
                <Route path="stats" element={<CRUDPage {...adminConfigs.stats} />} />
                <Route path="phase" element={<CRUDPage {...adminConfigs.phase} />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/admin/login" />
          )
        } />
      </Routes>
    </>
  )
}

export default App
