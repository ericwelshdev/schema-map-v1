import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/actions/authActions';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Box } from '@mui/material';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Projects from './pages/Projects';
import Sources from './pages/Sources';
import NewSource from './pages/NewSource';
import SourceDetail from './pages/SourceDetail';
import Targets from './pages/Targets';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import { SnackbarProvider } from 'notistack';
import { ViewProvider } from './contexts/ViewContext';
import { userConfig } from './config/userConfig';
import { WorkspaceProvider } from './contexts/WorkspaceContext';


  const theme = createTheme({
    palette: {
    mode: userConfig.theme,
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <ErrorBoundary>
            <ViewProvider>
              <WorkspaceProvider>
                <Router>
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                      <Sidebar />
                      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/workspace" element={<Workspace />} />
                          <Route path="/projects" element={<Projects />} />
                          <Route path="/sources" element={<Sources />} />
                          <Route path="/source/:id" element={<SourceDetail />} />
                          <Route path="/sources/new" element={<NewSource />} />
                          <Route path="/targets" element={<Targets />} />
                          <Route path="/admin" element={<Admin />} />
                        </Routes>
                      </Box>
                    </Box>
                    <Footer />
                  </Box>
                </Router>
              </WorkspaceProvider>
            </ViewProvider>
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}export default App;