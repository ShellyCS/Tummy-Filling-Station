import AllRoutes from "./routes/routes";
import { Provider, useSelector } from "react-redux";
import lightTheme from "./theme/light";
import darkTheme from "./theme/dark";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import appStore from "./utils/appStore";
import "./App.css";

const App = () => {
  // const currentTheme = useSelector((state) => state.theme.currentTheme);
  // const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <Provider store={appStore}>
      {/* <ThemeProvider theme={theme}> */}
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={2000}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        <div className="App">
          <AllRoutes />
        </div>
      </SnackbarProvider>
      {/* </ThemeProvider> */}
    </Provider>
  );
};

export default App;
