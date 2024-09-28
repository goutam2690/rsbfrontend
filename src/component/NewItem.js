import React, { useState, useEffect,useContext } from 'react'
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'assignedNo', headerName: 'ASIGNED NO', width: 130 },
    {
      field: 'shortform',
      headerName: 'SHORTFORM',
      width: 130,
    },
   
  ];
  

function NewItem({heading,apiurl}) {
    const ncookies = new Cookies()
    const ntoken = ncookies.get('access')
    const [data,setData] = useState(null)
    const [tempdata,setTempData] = useState(data)
    const [row,setrow] = useState('')
    const {logout } = useContext(AuthContext);
    const handleNewItem = () =>setrow({'id':'','name':'','assignedNo':'','shortform':''})
    const handleRowClick = (params) => {
        setrow(params.row);

    };
    const handleItemForm = (event)=>{
        event.preventDefault();
        const formData = new FormData(event.target); // Create a FormData object from the form
        const data = Object.fromEntries(formData.entries());
        console.log(data)
        if(row.id){
          console.log("id is present")
          updateItem(data)
        }
        else{
            createNewItem(data)
          console.log("id not present")
        }
        // Convert the FormData to an object
        
    }

    const updateItem = async (formdata)=>{
      try{
        const res =  await axios.patch(apiurl +row.id+ "/",{formdata}, {
          headers: {
              'Authorization': `Bearer ${ntoken}`
          },
          withCredentials: true
      });
      console.log(res)
      if (res.status === 400){
        toast.warning("invalid data")
      }
      if (res.status === 200){
        const categ = res.data || null
        setData(categ.item)
        setTempData(categ.item)
        toast.success("Saved Successfully")
      }
    }catch(error){
        if(error.response.status === 400){
        toast.warning("Invalid data")
        }
        if(error.response.status === 401){
            toast.warning("Session expired")
            logout()
        }
      }
    }

    const createNewItem = async (formdata)=>{
        try{
            const res =  await axios.post(apiurl,{formdata}, {
              headers: {
                  'Authorization': `Bearer ${ntoken}`
              },
              withCredentials: true
          });
          console.log(res)
          if (res.status === 400){
            toast.warning("invalid data")
          }
          if (res.status === 200){
            const categ = res.data || null
            setData(categ.item)
            setTempData(categ.item)
            toast.success("Saved Successfully")
          }
        }catch(error){
            if(error.response.status === 400){
            toast.warning("Invalid data")
            }
            if(error.response.status === 401){
                toast.warning("Session expired")
                logout()
            }
          }
    }
    useEffect(()=>{
      let isMounted = true
        const cookies = new Cookies()
        const token = cookies.get('access')
        try{
            const res =  axios.get(apiurl, {
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              withCredentials: true
          });
          res
          .then((response)=>{
            if(response.status === 200 && isMounted === true){
              const cat = response.data?response.data:null
              console.log(cat)
              setData(cat.item)
              setTempData(cat.item)
            }
          
          })
          .catch((error)=>{
            console.error("catched error",error.response.status)
            if(error.response.status === 401 && isMounted === true){
                toast.warning("Session expired")
                logout()
            }
          })
         
          
          }
          catch(error){
            console.log(error)
            toast.warning("session timeout")
            logout()
          }
          return () => {
            isMounted = false; // Cleanup flag on unmount
          };
    },[])
  return (
    <>
        <h3 className='p-2 bg-indigo-600 text-white font-mono '>{heading.toUpperCase()}</h3>
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={tempdata}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowClick={handleRowClick}
                />
            </div>
            <div className="p-2">
            <form onSubmit={handleItemForm}>
                <FormControl>
                
                    <RadioGroup
                    row
                    name="type"
                    value={row.type ||"direct"} 
                    onChange={(e)=>{
                        setTempData(data.filter(item=>item.type===e.target.value))
                        setrow((prevData) => ({
                                ...prevData,
                                type: e.target.value
                              }))
                            console.log(row)
                    }}
                            
                    >
                        <FormControlLabel value="direct" control={<Radio />} label="Direct" />
                        <FormControlLabel value="indirect" control={<Radio />} label="Indirect" />
                    </RadioGroup>
                </FormControl>
                <Box
                    
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField id="name" label="Name" name="name" variant="outlined" InputLabelProps={{shrink: true,}} value={row.name} onChange={(e)=>(setrow((prevData)=>({...prevData,name:e.target.value})))} />
                    <TextField id="assigned_no" name="assignedNo" label="Assigned No" variant="outlined" InputLabelProps={{shrink: true,}} value={row.assignedNo} onChange={(e)=>(setrow((prevData)=>({...prevData,assignedNo:e.target.value})))} />
                    <TextField id="short_form" name="shortform" label="Short Form" variant="outlined" InputLabelProps={{shrink: true,}} value={row.shortform} onChange={(e)=>(setrow((prevData)=>({...prevData,shortform:e.target.value})))} />
                    <div className='flex gap-2'>
                    <Button variant="contained" onClick={handleNewItem}>New</Button>
                    <Button variant="contained" type='submit'>Save</Button>
                    </div>
                </Box>
            </form>
            </div>
        </div>
    </>
  )
}

export default NewItem