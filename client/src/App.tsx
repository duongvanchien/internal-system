import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import React, { createContext } from 'react';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { SocketService } from "../src/api/realtime";
import { AppNavigation } from './navigation/AppNavigation';
import { store } from './redux/store';
import './styles/overrideStype.scss';
import './styles/styles.scss';
import color from "./styles/themes.module.scss";
// import { Toaster } from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const RealtimeContext: React.Context<SocketService> = createContext(new SocketService());

const theme = createTheme({
  palette: {
    primary: {
      main: `${color.main}`
    }
  },
});

const realtime = new SocketService();

function App() {
  return (
    <RealtimeContext.Provider value={realtime.init()}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss={false}
            draggable={true}
            pauseOnHover={true}
            limit={3}
            toastStyle={{ backgroundColor: '#000', color: '#fff' }}
          />
          <SnackbarProvider maxSnack={3}>
            <Router>
              <Switch>
                <AppNavigation />
              </Switch>
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </RealtimeContext.Provider>
  );
}

export default App;
