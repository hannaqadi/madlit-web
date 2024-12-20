import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import Playing from './Playing';
import Reading from './Reading';

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/Playing", element: <Playing /> },
  { path: "/Reading", element: <Reading /> },

])
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
