import React, { useState } from "react";
import "./RecipeCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClock,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import axios from "axios";
const RecipeCard = (props) => {
    console.log(props)
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
  const deleteClick = () => {
    // handleClose();

    axios
      .delete(`${env}/api/recipes/${props.recipe._id}`)
      .then((response) => {props.onDelete()});
  };

  return (
    <div className="card">
    <Link to={"/description?id="+props.recipe._id}>
      <div className="card__body">
        <img src={props.recipe.imageUrl} class="card__image" />
        <h2 className="card__title">{props.recipe.name}</h2>
        {/* <p className="card__description">{props.recipe.description}</p> */}
      </div>
      <span className="more-button">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link to={"/edit?id=" + props.recipe._id}>Edit</Link>
          </MenuItem>
          <MenuItem onClick={deleteClick}>Delete</MenuItem>
        </Menu>
      </span>
      <div className="det">
        <span>
          <FontAwesomeIcon icon={faUser} />
          <span className="num">{props.recipe.servings}</span>
        </span>
        <span>
          <FontAwesomeIcon icon={faClock} />
          <span className="num">{props.recipe.cookTime}</span>
        </span>
      </div>
    </Link>
          <div className="button-wrapper">
            <Button> <Link to={"/edit?id=" + props.recipe._id}>Edit</Link></Button>
            <Button onClick={deleteClick}>Delete</Button>
          </div>
      {/* <button className="card__btn">View Recipe</button> */}
    </div>
  );
};

export default RecipeCard;
