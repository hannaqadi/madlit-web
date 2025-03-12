import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import "@flaticon/flaticon-uicons/css/all/all.css";
import { ThemeProvider } from "./ThemeContext";

import Homepage from './Homepage';
import Playing from './Playing';
import Reading from './Reading';
import Contact from './Contact';
import { Info } from './Info';

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/Playing", element: <Playing /> },
  { path: "/Reading", element: <Reading /> },
  { path: "/Info", element: <Info /> },
  { path: "/Contact", element: <Contact /> },
])
function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
