import React ,{useState,useEffect} from 'react'
import { Container, Typography } from '@mui/material'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
// import "./DescriptionPage.scss";
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const RecipeView = () => {
    const env =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DEV_MODE_baseURL
      : process.env.REACT_APP_PRO_MODE_baseURL;
  let query = useQuery();
  let currentId = query.get("id");
  const [recipeObj, recipeObjChange] = useState({steps:[]});
  useEffect(() => {
    axios.get(`${env}/api/recipes/${currentId}`).then((response) => {
      console.log(response);
      recipeObjChange(response.data);
      console.log(recipeObj)
    });
  }, []);
  return (
    <Container>
            <Typography variant='h2'>{recipeObj.name}</Typography>
            <div className='image-wrapper'>
                <div>
                    <img src={recipeObj.imageUrl} alt="" />
                </div>
            </div>
            <div className=''>
                <Typography variant='h4'>Description</Typography>
                <Typography variant='p'>{recipeObj.description}</Typography>
                <Typography variant='h4'>Steps</Typography>
                {recipeObj?.steps.length>0 ? recipeObj?.steps.map((step,index)=>{
                    return <Typography variant="p">{index+1}:- &nbsp; {step}<br/></Typography>

                }):""}
            </div>
    </Container>
  )
}

export default RecipeView