import React, { useEffect,useContext, useState } from 'react'
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import FileUpload from './FileUpload';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'itemtype', headerName: 'Item Types', width: 130, renderCell: (params) =>params.row.itemtype?.name || 'No Item Types' } ,
    { field: 'name', headerName: 'Name', width: 130 },
   
   
  ];
  
function Format3(props) {
    const [subtype,setSubType] = useState(null)
    const [tempsubtype,setTempSubType] = useState(null)
    const [tempItemTypes,setTempItemTypes] = useState(null)
    const [itemTypes,setItemTypes] = useState(null)
    const [row,setrow] = useState('')
    const {token,logout } = useContext(AuthContext);
    const handleNewItem = () =>setrow({'id':'','type':'direct','category':'','name':''})
    const handleRowClick = (params) => {
        setrow(params.row);
    };
    const handleItemForm = (event)=>{
        event.preventDefault();
        const formData = new FormData(event.target); // Create a FormData object from the form
        const data = Object.fromEntries(formData.entries());
        console.log(data)
        if(row.id){
            updateItem(data)
          console.log("id is present")
        }
        else{
           createNewItem(data)
          console.log("id not present")
        }
        // Convert the FormData to an object
        
    }
    const updateItem = async (formdata)=>{
        try{
            const res = await axios.patch(props.apiurl +row.id+ "/",{formdata}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if(res.status===200){
                const resdata = res.data || null
                setSubType(resdata.item)
                setTempSubType(resdata.item)
                toast.success("Updated Successfully")
            }
        }
      catch(error){
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
            const res = await axios.post(props.apiurl,{formdata}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if(res.status===200){
                const resdata = res.data || null
                setSubType(resdata.item)
                setTempSubType(resdata.item)
                toast.success("Saved Successfully")
            }
        }
      catch(error){
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
        const usertoken = cookies.get('access')
     
            const res =  axios.get(props.apiurl, {
              headers: {
                  'Authorization': `Bearer ${usertoken}`
              },
              withCredentials: true
          });
          res
          .then((response)=>{
          if(response.status === 200 && isMounted === true){
            const resdata = response.data || null
            console.log(resdata)
            setSubType(resdata.item)
            setTempSubType(resdata.item)
            setItemTypes(resdata.itemtype)
            setTempItemTypes(resdata.itemtype)
          }

          })
          .catch((error)=>{
            console.log(error)
            if(error.response.status === 401 && isMounted === true){
             toast.warning("session timeout")
          
            }
            else if(error.response.status === 404){
             toast.warning("wrong url")
            }
          })
          
         return ()=>{
            isMounted = false
         };

        
    },[])
  return (
    <div>
     <h3 className='p-2 bg-indigo-600 text-white font-mono '>{props.heading}</h3>
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={tempsubtype}
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
                        defaultValue="direct"
                        name="type"
                        value={row.type ||"direct"} 
                        onChange={(e)=>{
                            setTempItemTypes(itemTypes.filter(item=>item.type===e.target.value))
                            setTempItemTypes(itemTypes.filter(item=>item.type===e.target.value))
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
                     <FormControl>
                  <InputLabel id="itemtype_label">Item Types</InputLabel>
                  <Select
                    labelId="itemtype_label"
                    id="itemtype"
                    label="Item Type"
                    name="itemtype"
                    value={row.itemtype?.id??""}
                    onChange={(e)=>setrow((prevData) => ({
                                    ...prevData,
                                    itemtype:{ ...(prevData.itemtype ?? {}),  // Use empty object if category is null or undefined
                                    id: e.target.value
                                     }
                                }))}
                  >
                    <MenuItem value="">Select</MenuItem>
                
                    {    
                        itemTypes && itemTypes.length > 0 ?
                        (
                             
                            tempItemTypes.filter(element => element.type === row.type || 'direct')
                            .map(element => (
                                            <MenuItem value={element.id} key={element.id}>
                                                {element.name}
                                            </MenuItem>
                                            )
                                )
                        ) : (
                                <MenuItem value="01">Nothing</MenuItem>
                            )
                    }    
                  </Select>
                </FormControl>
                    <TextField id="name" name='name' label="Name" variant="outlined" InputLabelProps={{shrink: true,}} value={row.name} onChange={(e)=>(setrow((prevData)=>({...prevData,name:e.target.value})))}/>
                    
                    <div className='flex gap-2'>
                    <Button variant="contained" onClick={handleNewItem}>New</Button>
                    <Button variant="contained" type="submit">Save</Button>
                    </div>
                </Box>
            </form>
            {<FileUpload importurl={props.importurl} />}
            </div>
        </div>
    </div>
  )
}

export default Format3