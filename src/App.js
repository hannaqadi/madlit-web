import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import Playing from './Playing';
import Reading from './Reading';
function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="*" element={<Homepage/>}/>
    <Route path="/Playing" element={<Playing/>}/>
    <Route path="/Reading" element={<Reading/>}/>

   </Routes>
   </BrowserRouter>
  );
}

export default App;
