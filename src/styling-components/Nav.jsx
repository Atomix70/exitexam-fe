import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "axios";
import "./Nav.scss"

const Nav = () => {
  const env =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_MODE_baseURL
      : process.env.REACT_APP_PRO_MODE_baseURL;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [allCuisines, allCuisineChange] = useState([]);
  useEffect(() => {
    axios.get(`${env}/api/settings/`).then((response) => {
      console.log(response);
      // movieObjChange(response.data);
      allCuisineChange(response.data[0].cuisineArray);
    });
  }, []);
  return (
    <AppBar position="static" className="nav">
      <Toolbar className="toolbar">
        <div className="logo">Logo</div>
        <div className="right-nav">
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Cuisines
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          ><MenuItem onClick={handleClose}>
          <Link to="/">All</Link>
        </MenuItem>
            {allCuisines.map((cuisine) => {
              return (
                <MenuItem onClick={handleClose}>
                  <Link to={"/?cuisine=" + cuisine}>{cuisine}</Link>
                </MenuItem>
              );
            })}

            <MenuItem onClick={handleClose}>
              <Link to="/editSettings">Add Cuisine</Link>
            </MenuItem>
          </Menu>
          <Link to="/add">
            <Typography variant="h6" component="div">
              Add Recipe
            </Typography>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
