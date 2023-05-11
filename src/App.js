import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ShowResult from './components/ShowResult';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowResult></ShowResult>}></Route>
      </Routes>
   </BrowserRouter> 
  )
}

export default App;
