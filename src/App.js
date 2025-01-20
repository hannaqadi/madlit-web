import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from "./ThemeContext";

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
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
