import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Join from './pages/Join';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Screen from './pages/Screen';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3949ab' }, // indigo
    secondary: { main: '#00897b' } // teal
  },
  shape: { borderRadius: 16 },
  typography: { fontSize: 16 }
});

const router = createBrowserRouter([
  { path: '/', element: <Join/> },
  { path: '/join', element: <Join/> },
  { path: '/student/:code', element: <Student/> },
  { path: '/teacher/:code', element: <Teacher/> },
  { path: '/screen/:code', element: <Screen/> }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
