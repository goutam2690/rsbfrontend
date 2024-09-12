import React, { useState,useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import { FaSync } from "react-icons/fa";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';



function Setting() {
  const [open, setOpen] = React.useState(false);

    const [data,setData] = useState({"branchlist":[],"userlist":[]});
    const [value, setValue] = React.useState("1");
    const [row,setrow] = useState({
      "id": "",
      "username": "",
      "email": "",
      "profile": {
          "id": "",
          "user": '',
          "branch": null
      },
      "groups": [],
      "is_active": false,
      "is_superuser": false
  })
    const {token, logout } = useContext(AuthContext);

    const [role,setRole] = useState('')
    const handleNewUser = () =>setrow({
      "id": "",
      "username": "",
      "email": "",
      "profile": {
          "id": "",
          "user": '',
          "branch": null
      },
      "groups": [""],
      "is_active": false,
      "is_superuser": false
  })
    const handleChange = (event,newValue) => {
      setValue(newValue);
    };
    function clearFields(event) {
      // we have to convert event.target to array
      // we use from method to convert event.target to array
      // after that we will use forEach function to go through every input to clear it
      Array.from(event.target).forEach((e) => (e.value = ""));
    }
    const handleUserForm = (event)=>{
      event.preventDefault();
      const formData = new FormData(event.target); // Create a FormData object from the form
      const data = Object.fromEntries(formData.entries());
      console.log(data)
      if(row.id){
        
        console.log("id is present")
        updateuser(data)
      }
      else{
        console.log("id not present")
        createuser(data)
      }
      // Convert the FormData to an object
      
    }
    const handleUserRowClick = (params) => {
    
      setrow(params.row);
      setRole(params.row.groups[0])
      console.log("row",row)
      console.log("role is ",role)
    
  };
  const columns = [
    { field: 'id', headerName: 'SL', width: 70 },
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'profile', headerName: 'Branch', width: 130, renderCell: (params) =>params.row.profile?.branch?.branch || 'No Branch' },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 130, renderCell: (params) => (params.value ? 'YES' : 'NO')
    },
    { field: 'is_superuser', headerName: 'Admin', width: 130, renderCell: (params) => (params.value ? 'YES' : 'NO') },
  ];
  const branchcol = [
    { field: 'id', headerName: 'id', width: 70 },
    { field: 'unit', headerName: 'Branch Unit', width: 150 },
    { field: 'branch', headerName: 'Branch Plant', width: 200 },
  ]
  
 
  const fetchbranchjd = async ()=>{
    try{
      const res = await axios.get('/branchesjd/', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
    });
    setData((prevdata)=>(
    {
      ...prevdata,
      branchlist:res.data.branchlist
    })
    )
    }
    catch(error){
      toast.warning("session timeout")
      logout()
    }
 

  }
  async function changepassword(event){
    event.preventDefault();
    const formData = new FormData(event.target); // Create a FormData object from the form
    const data = Object.fromEntries(formData.entries());
    console.log(data)
    
    try
    {
      const res = await axios.patch('/user/'+row.id+"/",{data},{
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      if(res.status === 200){
        console.log(res)
        
        toast.success(res.data.success)
        clearFields(event)
        setOpen(false)
    
      }
      
      
    }
    catch(error){
      console.log(error)
      if(error.response.status === 422){
        toast.warning(error.response.data.warning)
      }
      else if(error.response.status === 409){
        toast.warning(error.response.data.warning)
      }
     //toast.warning('error')
    }

  }
 async function updateuser(formdata){
  try
  {
    const res = await axios.post('/user/'+row.id+"/",{formdata},{
      headers: {
          'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    if(res.status === 200){
      console.log(res)
      const users = await res.data.users

      setData((prevdata)=>(
        {
          ...prevdata,
          userlist:users
        })
        )
      toast.success('User updated Successfully')
    }
    
    
  }
  catch(error){
    console.log(error)
    if(error.response.status === 422){
      toast.warning(error.response.data.warning)
    }
    else if(error.response.status === 409){
      toast.warning(error.response.data.warning)
    }
   //toast.warning('error')
  }
 }
 const createuser = async (formdata)=>{
  try
  {
    const res = await axios.post('/users/',{formdata},{
      headers: {
          'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    if(res.status === 200){
      console.log(res)
      const users = await res.data.users

      setData((prevdata)=>(
        {
          ...prevdata,
          userlist:users
        })
        )
      toast.success('User created Successfully')
    }
    
    
  }
  catch(error){
    console.log(error)
    if(error.response.status === 422){
      toast.warning(error.response.data.warning)
    }
    else if(error.response.status === 409){
      toast.warning(error.response.data.warning)
    }
   //toast.warning('error')
  }
 }

  useEffect(()=>{
    const fetchbranch = async ()=>{
      try{
        const res = await axios.get('/branchlist/', {
          headers: {
              'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        const branches = await res.data.branchlist
        
        setData((prevdata)=>(
          {
            ...prevdata,
            branchlist:branches
          })
          )

      }
      catch(error){
        toast.warning("session timeout")
        logout()
      }
    }
     
    const fetchuserlist = async ()=>{
      try
      {
        const res = await axios.get('/users/', {
          headers: {
              'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        const users = await res.data.users
        setData((prevdata)=>(
          {
            ...prevdata,
            userlist:users
          })
          )
       
      }
      catch(error){
        toast.warning("session timeout")
        logout() 
      }
      
   
    }
  
    if(value === "1"){
      fetchuserlist()
      fetchbranch()
    }
    else if(value === "2"){
      fetchbranch()
    }
   
  },[value,token,logout])
  return (
    <div className='w-full h-full p-2 '>
      <Dialog
        open={open}
        onClose={()=>setOpen(false)}
      >
      <form onSubmit={changepassword}>
        <DialogContent>
          <DialogContentText>
            Please Enter Your New Password
          </DialogContentText>
          
          <TextField id="newpassword" type='password' label="New Password" className='mt-2' name="newpassword" variant="outlined" />

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button type="submit">Change</Button>
        </DialogActions>
        </form>
      </Dialog>
      <div className='p-2 border-2 m-2'>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="users" value="1" />
                <Tab label="branch" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                          rows={data.userlist}
                          columns={columns}
                          initialState={{
                          pagination: {
                              paginationModel: { page: 0, pageSize: 5 },
                          },
                          }}
                          pageSizeOptions={[5, 10]}
                          checkboxSelection
                          onRowClick={handleUserRowClick}
                      />
              </div>
            
              <form onSubmit={handleUserForm}>
              <Box
                
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                  
                  <TextField id="username" label="Username" name="username" variant="outlined" InputLabelProps={{shrink: true,}} value={row.username} onChange={(e)=>(setrow((prevdata)=>({...prevdata,username:e.target.value})))} />
                  <TextField id="email" label="Email" name="email" variant="outlined" InputLabelProps={{shrink: true,}} value={row.email} onChange={(e)=>(setrow((prevdata)=>({...prevdata,email:e.target.value})))} />
                  
                  <FormControl fullWidth>
                    <InputLabel id="branch_label">Branch</InputLabel>
                    <Select
                      labelId="branch_label"
                      id="branch"
                      label="Branch"
                      name="branch"
                      value={row.branch?row.branch.id:row.profile?row.profile.branch?row.profile.branch.id:"":""}
                      onChange={(e)=>(setrow((prevdata)=>({...prevdata,branch: {...prevdata.profile?.branch,id:e.target.value}})))}>
                    <MenuItem value={0}>Select</MenuItem>
                    {
                      data.branchlist?data.branchlist.map((element)=>{
                        return <MenuItem value={element.id} key={element.id}>{element.branch}</MenuItem>
                      }):<MenuItem value="01">Nothing</MenuItem>
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl>
                    <InputLabel id="role_label">Role</InputLabel>
                    <Select
                      labelId="role_label"
                      id="role"
                      label="Role"
                      name="role"
                      value={role??""}
                      onChange={(e)=>(setRole(e.target.value))}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="operation">operation</MenuItem>
                      <MenuItem value="accounts">Accounts</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                        
                    </Select>
                  </FormControl>
                  <FormGroup row>
                    <FormControlLabel 
                      control={<Checkbox 
                                checked={row.is_active ?? false}
                                inputProps={{ 'aria-label': 'controlled' }} 
                                onChange={(e) => setrow((prevData) => ({
                                  ...prevData,
                                  is_active: e.target.checked
                                }))} 
                                  name="is_active"
                                />} 
                      label="Active" />
                    <FormControlLabel 
                      control={<Checkbox 
                                checked={row.is_superuser || false}
                                        inputProps={{ 'aria-label': 'controlled' }} 
                                        onChange={(e) => setrow((prevData) => ({
                                          ...prevData,
                                          is_superuser: e.target.checked
                                        }))}
                                name="is_superuser"
                      />} 
                      label="Admin" />
                  </FormGroup>
                  {
                    row.id? 
                    (
                      <>

                          <Button variant="contained" onClick={()=>setOpen(true)}>Change Password</Button>
                      </>
                    )
                    :
                    (<>
                    <TextField id="password" type='password' label="Password" name="password" variant="outlined" InputLabelProps={{shrink: true,}} />
                    <TextField id="cpassword" type='password' label="Confirm Password" name="cpassword" variant="outlined" InputLabelProps={{shrink: true,}}/>
                    </>)
                  }
                  <div className='flex gap-2 mt-4'>
                    <Button variant="contained" onClick={handleNewUser}>New</Button>
                    <Button variant="contained" type='submit'>Save</Button>
                  
                  </div> 
              
                
              </Box>
              </form>
            </TabPanel>
            <TabPanel value="2">
              <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={data.branchlist}
                            columns={branchcol}
                            initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowClick={handleUserRowClick}
                        />
              </div>
              <div className='flex gap-2 mt-4'>
                  <Button variant="contained" onClick={fetchbranchjd}><FaSync /> Sync</Button>
                </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  )
}

export default Setting