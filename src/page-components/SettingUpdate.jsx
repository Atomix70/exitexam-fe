import React, {useEffect,useState} from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLocation,useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Container,
} from '@mui/material';
import axios from "axios";

const SettingUpdate = () => {
    const navigate = useNavigate();
    const env =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_MODE_baseURL
        : process.env.REACT_APP_PRO_MODE_baseURL;
    const [settingsDocId, settingsDocIdChange]=useState("")
    
    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues: {
          settings: [''],
        },
      });
      const { fields: settingFields, append: appendSettings, remove: removeSettings } = useFieldArray({
        control,
        name: 'cuisineArray',
      });
      useEffect(() => {
          axios.get(`${env}/api/settings/`).then((response) => {
            console.log(response);
            // movieObjChange(response.data);
            settingsDocIdChange(response.data[0]._id)
            setValue('cuisineArray', response.data[0].cuisineArray, { shouldValidate: true })
          });        
      }, []);

      const onSubmit = (data) => {
        console.log(data)
        let sendData = {
            ...data,
          };
          console.log(sendData);
            // var currentId=settingsDocId
            axios.put(`${env}/api/settings/${settingsDocId}`,sendData).then((response) => {
              navigate("/description?id="+response.data._id)
            })
        // Convert steps array to an array of objects with 'description' property
    
      };
    

  return (
    <Container>

    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {settingFields.map((setting, index) => (
          <Grid item xs={12} key={setting.id}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Cuisine ${index + 1}`}
                  {...control.register(`cuisineArray.${index}`, { required: 'Cuisine  is required' })}
                  fullWidth
                  error={errors.cuisineArray?.[index] ? true : false}
                  helperText={errors.cuisineArray?.[index] && errors.cuisineArray?.[index].message}
                />
              </Grid>
              <Grid item xs={12}>
                {index > 0 && (
                  <Button variant="outlined" color="secondary" onClick={() => removeSettings(index)}>
                    Remove Cuisine
                  </Button>
                )}
                <Button variant="contained" color="primary" onClick={() => appendSettings(index + 1, "")}>
                  Add Cuisine
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
  )
}

export default SettingUpdate