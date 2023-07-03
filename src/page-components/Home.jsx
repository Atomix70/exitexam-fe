import React, { useState, useEffect } from "react";
import RecipeCard from "../styling-components/RecipeCard";
import { styled, alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import "./Home.scss"

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Home = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);
  console.log(query.get("cuisine"));
  const [allRecs, recipeChange] = useState([]);
  const searchChange = (event) => {
    console.log(event.target.value);
    if (event.target.value.length > 0) {
      axios
        .get(`${env}/api/recipes/search/${event.target.value}`)
        .then((response) => {
          console.log(response.data);
          recipeChange(response.data);
        })
        .catch(() => {
          recipeChange([]);
        });
    } else {
      axios.get(`${env}/api/recipes`).then((response) => {
        recipeChange(response.data);
      });
    }
  };
  const env =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_MODE_baseURL
      : process.env.REACT_APP_PRO_MODE_baseURL;
  useEffect(() => {
    if (!!!query.get("cuisine")) {
      console.log("no query");
      axios.get(`${env}/api/recipes`).then((response) => {
        recipeChange(response.data);
      });
    } else {
      console.log("query");
      axios
        .get(`${env}/api/recipes/cuisine/${query.get("cuisine")}`)
        .then((response) => {
          recipeChange(response.data);
        })
        .catch((err) => {
          console.log(err);
          recipeChange([]);
        });
    }
  }, [query]);
  const handleDelete=()=>{
    if (!!!query.get("cuisine")) {
        console.log("no query");
        axios.get(`${env}/api/recipes`).then((response) => {
          recipeChange(response.data);
        });
      } else {
        console.log("query");
        axios
          .get(`${env}/api/recipes/cuisine/${query.get("cuisine")}`)
          .then((response) => {
            recipeChange(response.data);
          })
          .catch((err) => {
            recipeChange([]);
            console.log(err);
          });
      }
  }
  return (
    <div>
      <Container className="home">
        <Search  className="search">
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={searchChange}
          />
        </Search>
        <Grid container spacing={2}>
          {allRecs.map((recipe) => {
            return (
              <Grid item xs={12} md={6} lg={3}>
                <RecipeCard onDelete={handleDelete} recipe={recipe}> </RecipeCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
