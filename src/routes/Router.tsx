import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import UtilComponents from '../components/utils/UtilComponents';
import RenderedForm from '../components/utils/form/RenderedForm';
import Home from '../pages/Home';
import Medicine from '../pages/Medicine';
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
        path: '/medicine',
        element: <Medicine />,
      },
      {
        path: '/stock',
        element: <Stock />,
      },
      {
        path: '/util-components',
        element: <UtilComponents />,
        children: [
          {
            path: 'form',
            element: <RenderedForm />,
          },
        ],
      },
    ],
  },
]);
