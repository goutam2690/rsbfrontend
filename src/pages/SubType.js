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
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'itemtype', headerName: 'Item Type', width: 130, renderCell: (params) =>params.row.itemtype?.name || 'No item type' },
    { field: 'subtype1', headerName: 'Sub Type 1', width: 130 },
    {
      field: 'subtype2',
      headerName: 'Sub Type 2',
      width: 130,
    },
   
  ];
  

function SubType() {
    const [SubType,setSubType] = useState(null)
    const [tempSubType,setTempSubType] = useState(null)
    const [tempItemType,setTempItemType] = useState(null)
    const [ItemType,setItemType] = useState(null)
    const [row,setrow] = useState('')
    const {token,logout } = useContext(AuthContext);
    const handleNewItem = () =>setrow({'id':'','type':'direct','itemtype':'','subtype1':'','subtype2':''})
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
            const res = await axios.patch("/subtype/" +row.id+ "/",{formdata}, {
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
            const res = await axios.post("/subtype/",{formdata}, {
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
        const cookies = new Cookies()
        const usertoken = cookies.get('access')
     
            const res =  axios.get("/subtype/", {
              headers: {
                  'Authorization': `Bearer ${usertoken}`
              },
              withCredentials: true
          });
          res
          .then((response)=>{
          if(response.status === 200){
            const resdata = response.data || null
            console.log(resdata)
            setSubType(resdata.item)
            setTempSubType(resdata.item)
            setItemType(resdata.itemtype)
            setTempItemType(resdata.itemtype)
          }

          })
          .catch((error)=>{
            console.log(error)
            if(error.response.status === 401){
             toast.warning("session timeout")
            
            }
            else if(error.response.status === 404){
             toast.warning("wrong url")
            }
          })
          
         

        
    },[])
  return (
    <div>
     <h3 className='p-2 bg-indigo-600 text-white font-mono '>Item Sub Type</h3>
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={tempSubType}
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
                            setTempSubType(SubType.filter(item=>item.type===e.target.value))
                            setTempItemType(ItemType.filter(item=>item.type===e.target.value))
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
                  <InputLabel id="itemtype_label">Item Type</InputLabel>
                  <Select
                    labelId="itemtype_label"
                    id="itemtype"
                    label="itemtype"
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
                        ItemType && ItemType.length > 0 ?
                        (
                             
                            tempItemType.filter(element => element.type === row.type || 'direct')
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
                    <TextField id="subtype1" name='subtype1' label="Sub Type1" variant="outlined" InputLabelProps={{shrink: true,}} value={row.subtype1} onChange={(e)=>(setrow((prevData)=>({...prevData,subtype1:e.target.value})))}/>
                    <TextField id="subtype2" name='subtype2' label="Sub Type2" variant="outlined" InputLabelProps={{shrink: true,}} value={row.subtype2} onChange={(e)=>(setrow((prevData)=>({...prevData,subtype2:e.target.value})))} />
                    
                    <div className='flex gap-2'>
                    <Button variant="contained" onClick={handleNewItem}>New</Button>
                    <Button variant="contained" type="submit">Save</Button>
                    </div>
                </Box>
            </form>
            </div>
        </div>
    </div>
  )
}

export default SubType