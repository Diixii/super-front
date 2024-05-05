import './styles/main.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contacts from './pages/Contacts';
import Project from './pages/Project';

import ScrollToTop from './utils/ScrollToTop';
import Recorder_2 from './components/reco/Recorder_2';

function App() {
  return (
    <div className="App">

	  	<Router>
			<Recorder_2 />
			<ScrollToTop />
		  	<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/contacts" element={<Contacts />} />
				<Route path="/project/:id" element={<Project />} />
			</Routes>

			<Footer />
		</Router>      	

    </div>
  );
}

export default App;
