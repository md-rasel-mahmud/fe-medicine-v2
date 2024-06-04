import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import About from '../pages/About';
import Home from '../pages/Home';
import Stock from '../pages/Stock';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/stock',
        element: <Stock />,
      },
    ],
  },
]);
