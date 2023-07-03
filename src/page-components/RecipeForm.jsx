import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClock,
  faEllipsisV,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
  Container,
} from "@mui/material";
import axios from "axios";

const StyledTextareaAutosize = styled("textarea")({
  width: "100%",
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "4px",
  borderColor: "#ccc",
});

const RecipeForm = (props) => {
  console.log(props);
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);
  const env =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_MODE_baseURL
      : process.env.REACT_APP_PRO_MODE_baseURL;

  const [allCuisines, allCuisineChange] = useState([]);
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      cookTime: "",
      servings: "",
      ingredients: [{ ingredient: "", quantity: "", unit: "" }],
      steps: [""],
      imageUrl: "",
      cuisine: "",
    },
  });
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = (data) => {
    if (data.ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }
    console.log(data);
    let sendData = {
      ...data,
    };
    console.log(sendData);
    if (props.mode === "edit") {
      var currentId = query.get("id");
      axios
        .put(`${env}/api/recipes/${currentId}`, sendData)
        .then((response) => {
          navigate("/description?id=" + response.data._id);
        });
    }
    if (props.mode === "add") {
      axios.post(`${env}/api/recipes`, sendData).then((response) => {
        navigate("/description?id=" + response.data._id);
      });
    }
    // Convert steps array to an array of objects with 'description' property
  };
  useEffect(() => {
    if (props.mode === "edit") {
      console.log(query.get("id"));
      var currentId = query.get("id");
      axios.get(`${env}/api/recipes/${currentId}`).then((response) => {
        console.log(response);
        // movieObjChange(response.data);
        setValue("name", response.data.name, { shouldValidate: true });
        setValue("imageUrl", response.data.imageUrl, { shouldValidate: true });
        setValue("author", response.data.director, { shouldValidate: true });
        setValue("uploadedDate", response.data.releaseDate, {
          shouldValidate: true,
        });
        setValue("cuisine", response.data.cuisine, { shouldValidate: true });
        setValue("ingredients", response.data.ingredients, {
          shouldValidate: true,
        });
        setValue("steps", response.data.steps, { shouldValidate: true });
        setValue("cookTime", response.data.cookTime, { shouldValidate: true });
        setValue("servings", response.data.servings, { shouldValidate: true });
        setValue("description", response.data.description, {
          shouldValidate: true,
        });
      });
    }
    axios.get(`${env}/api/settings/`).then((response) => {
      console.log(response);
      // movieObjChange(response.data);
      allCuisineChange(response.data[0].cuisineArray);
    });
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              {...control.register("name", { required: "Name is required" })}
              fullWidth
              error={errors.name ? true : false}
              helperText={errors.name && errors.name.message}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextareaAutosize
              minRows={3}
              placeholder="Brief Description"
              {...control.register("description", {
                required: "Description is required",
              })}
              error={errors.description ? true : false}
              helperText={errors.description && errors.description.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Cooking Time"
              type="number"
              {...control.register("cookTime", {
                required: "Cooking Time is required",
              })}
              fullWidth
              error={errors.cookTime ? true : false}
              helperText={errors.cookTime && errors.cookTime.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Servings"
              type="number"
              {...control.register("servings", {
                required: "Servings is required",
              })}
              fullWidth
              error={errors.servings ? true : false}
              helperText={errors.servings && errors.servings.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              {...control.register("imageUrl", {
                required: "Image URL is required",
              })}
              fullWidth
              error={errors.imageUrl ? true : false}
              helperText={errors.imageUrl && errors.imageUrl.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={errors.cuisine ? true : false}>
              <InputLabel>Cuisine</InputLabel>
              <Controller
                name="cuisine"
                control={control}
                rules={{ required: "Cuisine is required" }}
                render={({ field }) => (
                  <Select {...field}>
                    {allCuisines.map((cuisine) => {
                      return <MenuItem value={cuisine}>{cuisine}</MenuItem>;
                    })}
                  </Select>
                )}
              />
              {errors.cuisine && <span>{errors.cuisine.message}</span>}
            </FormControl>
          </Grid>

          {/* <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={() => appendIngredient({ ingredient: '', quantity: '', unit: '' })}>
            Add Ingredient
          </Button>
        </Grid> */}
          {ingredientFields.map((ingredient, index) => (
            <Grid item xs={12} key={ingredient.id}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={`Ingredient ${index + 1}`}
                    {...control.register(`ingredients.${index}.ingredient`, {
                      required: "Ingredient is required",
                    })}
                    fullWidth
                    error={
                      errors.ingredients?.[index]?.ingredient ? true : false
                    }
                    helperText={
                      errors.ingredients?.[index]?.ingredient &&
                      errors.ingredients?.[index]?.ingredient.message
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    label="Quantity"
                    type="number"
                    {...control.register(`ingredients.${index}.quantity`, {
                      required: "Quantity is required",
                    })}
                    fullWidth
                    error={errors.ingredients?.[index]?.quantity ? true : false}
                    helperText={
                      errors.ingredients?.[index]?.quantity &&
                      errors.ingredients?.[index]?.quantity.message
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <FormControl
                    fullWidth
                    error={errors.ingredients?.[index]?.unit ? true : false}
                  >
                    <InputLabel>Unit</InputLabel>
                    <Controller
                      name={`ingredients.${index}.unit`}
                      control={control}
                      rules={{ required: "Unit is required" }}
                      render={({ field }) => (
                        <Select {...field}>
                          <MenuItem value="teaspoon">Teaspoon</MenuItem>
                          <MenuItem value="tablespoon">Tablespoon</MenuItem>
                          <MenuItem value="grams">Grams</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.ingredients?.[index]?.unit && (
                      <span>{errors.ingredients?.[index]?.unit.message}</span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeIngredient(index)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                  )}
                  </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      appendIngredient(index + 1, {
                        ingredient: "",
                        quantity: "",
                        unit: "",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => appendStep("")}
            >
              Add Step
            </Button>
          </Grid>
          {stepFields.map((step, index) => (
            <Grid item xs={12} key={step.id}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    label={`Step ${index + 1}`}
                    {...control.register(`steps.${index}`, {
                      required: "Step is required",
                    })}
                    fullWidth
                    error={errors.steps?.[index] ? true : false}
                    helperText={
                      errors.steps?.[index] && errors.steps?.[index].message
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeStep(index)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => appendStep(index + 1, "")}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RecipeForm;
