import logo from "./logo.svg";
import "./App.css";
import { Route, Routes,BrowserRouter } from "react-router-dom";
import Layout from "./styling-components/Layout";
import Home from "./page-components/Home";
import AddRecipe from "./page-components/AddRecipe";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import RecipeForm from "./page-components/RecipeForm";
import SettingUpdate from "./page-components/SettingUpdate";
import RecipeView from "./page-components/RecipeView";
const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
});
function App() {
  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="add" element={<RecipeForm mode="add"/>} />
          <Route path="edit"  element={<RecipeForm mode="edit" />} />
          <Route path="editSettings"  element={<SettingUpdate />} />
          <Route path="description"  element={<RecipeView />} />
        </Route>
      </Routes>
    </div>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
