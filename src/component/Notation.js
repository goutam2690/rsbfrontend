import React, { useEffect,useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {field:'created', headerName:"Date",width:130},
    {field:'day',headerName:"Since",width:160,renderCell:(params)=>{
        const now = new Date(); // Current date and time
    const target = new Date(params.row.created); // Convert the target date to a Date object

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = target - now;

    // Convert milliseconds to days, hours, minutes
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const millisecondsInAnHour = 1000 * 60 * 60;
    const millisecondsInAMinute = 1000 * 60;

    const days = Math.floor(differenceInMilliseconds / millisecondsInADay);
    const hours = Math.floor((differenceInMilliseconds % millisecondsInADay) / millisecondsInAnHour);
    const minutes = Math.floor((differenceInMilliseconds % millisecondsInAnHour) / millisecondsInAMinute);
return ` Days: ${days} Hours: ${hours} minutes ${minutes}`
    }},
    { field: 'user', headerName: 'User', width: 130, renderCell: (params) =>params.row.user?.username || 'No user' } ,
    { field: 'branch', headerName: 'Branch', width: 130, renderCell: (params) =>params.row.branch?.branch || 'No branch' },
    { field: 'itemcategory', headerName: 'Item category', width: 130 },
    { field: 'itemfamily', headerName: 'Item Family', width: 130 },
    { field: 'itemtype', headerName: 'Item Type', width: 130 },
    { field: 'subtype1', headerName: 'subtype1', width: 130 },
    { field: 'subtype2', headerName: 'subtype2', width: 130 },
    { field: 'materialg', headerName: 'Material Grade', width: 130 },
    { field: 'mtofconst', headerName: 'Material Construction', width: 130 },
    { field: 'specification', headerName: 'Specification', width: 130 },
    { field: 'process', headerName: 'Process', width: 130 },
    { field: 'stage', headerName: 'Stage', width: 130 },
    { field: 'supplytype', headerName: 'Supply Type', width: 130 },
    { field: 'itemmake', headerName: 'Item make', width: 130 },
    { field: 'techspec', headerName: 'Tech Specification', width: 130 },
    { field: 'dimension', headerName: 'dimension', width: 130 },
    { field: 'otherdetails', headerName: 'Other details', width: 130 },
    { field: 'stockingtype', headerName: 'Stocking type', width: 130 },
    { field: 'glclass', headerName: 'GL Class', width: 130 },
    { field: 'uom', headerName: 'UOM', width: 130 },
    { field: 'linetype', headerName: 'Line Type', width: 130 },
    { field: 'hsn', headerName: 'HSN', width: 130 },
    { field: 'commodity', headerName: 'Commodity', width: 130 },
    { field: 'subcommodity', headerName: 'Sub commodity', width: 130 },

    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) =>params.row.approved?"Done" : 'Pending' 
    },
   
  ];
function Notation() {
    const [notation,setNotation] = useState(null)
    const {user,token,logout } = useContext(AuthContext);
    const [row,setrow] = useState('')
    const handleNewItem = () =>{
        setrow({id:""})
    }
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
          event.target.reset();
        }
        // Convert the FormData to an object
        
    }
    const ApproveNotation = async ()=>{
        try{
            const res = await axios.get("/notation/" +row.id+ "/", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if(res.status===200){
                const resdata = res.data || null
                setNotation(resdata.item)
                toast.success(resdata.success)
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
    const updateItem = async (formdata)=>{
        try{
            const res = await axios.patch("/notation/" +row.id+ "/",{formdata}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if(res.status===200){
                const resdata = res.data || null
                setNotation(resdata.item)
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
            const res = await axios.post("/notation/",{formdata}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if(res.status===200){
                const resdata = res.data || null
                setNotation(resdata.item)
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
     
            const res =  axios.get("/notation/list/", {
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
            setNotation(resdata.item)
           
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
        <h3 className='p-2 bg-indigo-600 text-white font-mono '>Notation</h3>
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={notation}
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
                <Box
           
                    sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField id="itemcategory" name="itemcategory" label="item category" variant="outlined" />
                    <TextField id="itemfamily" name="itemfamily" label="item family" variant="outlined" />     
                    <TextField id="itemtype" name="itemtype" label="item type" variant="outlined" />   
                    <TextField id="subtype1" name="subtype1" label="subtype1" variant="outlined" />  
                    <TextField id="subtype2" name="subtype2" label="subtype2" variant="outlined" />  
                    <TextField id="materialg" name="materialg" label="Material Grade" variant="outlined" /> 
                    <TextField id="mtofconst" name="mtofconst" label="Material of construction" variant="outlined" />           
                     
                    <TextField id="specification" name="specification" label="specification" variant="outlined" />  
                    <TextField id="process" name="process" label="process" variant="outlined" />  
                    <TextField id="stage" name="stage" label="stage" variant="outlined" />  

                    <TextField id="supplytype" name="supplytype" label="supply type" variant="outlined" />  
                    <TextField id="itemmake" name="itemmake" label="item make" variant="outlined" />  
                    <TextField id="techspec" name="techspec" label="Technical Specification" variant="outlined" />  
                    <TextField id="dimension" name="dimension" label="Dimension" variant="outlined" />  
                    <TextField id="otherdetails" name="otherdetails" label="Other Details" variant="outlined" />  
                    <TextField id="stockingtype" name="stockingtype" label="stocking type" variant="outlined" /> 
                    <TextField id="glclass" name="glclass" label="gl class" variant="outlined" /> 
                    <TextField id="uom" name="uom" label="uom" variant="outlined" /> 
                    <TextField id="linetype" name="linetype" label="line type" variant="outlined" /> 
                    <TextField id="hsn" name="hsn" label="hsn" variant="outlined" /> 
                    <TextField id="commodity" name="commodity" label="commodity" variant="outlined" /> 
                    <TextField id="subcommodity" name="subcommodity" label="sub commodity" variant="outlined" /> 

                    {
                        user.is_superuser?
                        <Button variant="contained" onClick={ApproveNotation} >Approve</Button>
                        :
                        
                          
                            <div className='flex gap-2'>
                            <Button variant="contained" type="submit">Save</Button>
                            </div>
                    }

                 
                </Box>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Notation