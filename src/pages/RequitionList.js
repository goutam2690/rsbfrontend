import React, { useContext, useEffect, useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Button } from '@mui/material';
import { AuthContext } from '../AuthContext';
const columns = [
  { field: 'id', headerName: 'Trn No', width: 50 },
  { field: 'created', headerName: 'Date', width: 130 },
  { field: 'branch', headerName: 'Branch', width:130, renderCell: (params) => params.row.branch?.branch},
  { field: 'type', headerName: 'Type', width: 70 },
  { field: 'itemcategory', headerName: 'Item Category', width: 130,  renderCell: (params) =>params.row.itemcategory?.name || ''  },
  { field: 'itemfamily', headerName: 'Item Family', width: 130,  renderCell: (params) =>params.row.itemfamily?.name || ''  },
  {
    field: 'itemtype',
    headerName: 'Item Types',
    width: 130,
    renderCell: (params) =>params.row.itemtype?.name || 'No types' 
  },
  { field: 'subtype1', headerName: 'Sub Type1', width: 130 },
  { field: 'subtype2', headerName: 'Sub Type2', width: 130 },
  { field: 'mtofconst', headerName: 'Metal of construction', width: 130,  renderCell: (params) =>params.row.mtofconst?.name || ''  },
  { field: 'materialg', headerName: 'Material Grade', width: 130 },
  { field: 'specification', headerName: 'Specification', width: 130 },
  { field: 'process', headerName: 'Process', width: 130, renderCell: (params) =>params.row.process?.name || ''  },
  { field: 'stage', headerName: 'Stage', width: 130, renderCell: (params) =>params.row.stage?.name || ''  },
  { field: 'supplytype', headerName: 'Supply Type', width: 130, renderCell: (params) =>params.row.supplytype?.name || ''   },
  { field: 'stockingtype', headerName: 'Stocking Type', width: 130, renderCell: (params) =>params.row.stockingtype?.name || ''   },
  { field: 'glclass', headerName: 'GL Class', width: 130,renderCell: (params) =>params.row.glclass?.name || ''   },
  { field: 'uom', headerName: 'UOM', width: 130, renderCell: (params) =>params.row.uom?.name || ''  },
  { field: 'linetype', headerName: 'Line Type', width: 130,renderCell: (params) =>params.row.linetype?.name || ''   },
  { field: 'itemno', headerName: 'Item Code', width: 130,renderCell: (params) =>params.row.itemno  },
  { field: 'description', headerName: 'Description', width: 130,renderCell: (params) =>params.row.description || ''   },
  
  { field: 'operation', headerName: 'Operation', width: 130,renderCell: (params) =>{
      if (params.row.operation) {
        return 'Approved';
      } else if (params.row.orejected) {
        return 'Rejected';
      } else {
        return 'Pending';
      }
    }   
  },
  { field: 'accounts', headerName: 'Accounts', width: 130,renderCell: (params) =>{
    if (params.row.account) {
      return 'Approved';
    } else if (params.row.arejected) {
      return 'Rejected';
    } else {
      return 'Pending';
    }
  }   
},
  
];



function RequitionList() {
  const [open,setOpen] = useState(false)
  const [reqlist,setReqList] = useState(null)
  const {user,token,logout} = useContext(AuthContext);
  const group = ['accounts','operation']
  const [loading,setLoading] = useState(false)
  const [row,setRow] = useState(null)
const [selectionModel, setSelectionModel] = useState([]);
const handleSelectionChange = (newSelection) => {
  
  setSelectionModel(newSelection);
  console.log("selected",selectionModel)
};
  const handleRowClick = (params) => {
    console.log(params);
    setRow(params.row)

    if(user){
      if(user.groups){
        if(group.includes(user.groups[0])){

          setOpen(true)
        }
      }
    }
    

};
function handleAction(event){

  setLoading(true)
  const res = axios.patch("/requisition/" +row.id+"/",
    {action:event.target.id},
    {
      headers: {
              'Authorization': `Bearer ${token}`
          },
          withCredentials: true
    }
  )
  res
  .then((response)=>{
    if(response.status === 200){
      if(response.data.success){
        toast.success(response.data.success)
      }
      else if(response.data.warning){
        toast.error(response.data.warning)
      }
      
      setLoading(false)
    
    }
    setOpen(false)
  })
  .catch((error)=>{
    console.log(error)
    if(error.response.status === 401){
      toast.warning("Session expired")
      logout()
    }
  })

}
function pushToJD(){
  console.log("data to push to JD",selectionModel)
}
  useEffect(()=>{
    const cookies = new Cookies()
    const token = cookies.get('access')
    const res =  axios.get("/requisition/", {
      headers: {
          'Authorization': `Bearer ${token}`
      },
      withCredentials: true
  });
  res
  .then((response)=>{
    if(response.status === 200){
      console.log(response.data)
      setReqList(response.data.rq)
    }
  })
  .catch((error)=>{
    console.log(error)
  })
  },[])
  return (
    <div id='rqlist'>
    
     <Dialog onClose={()=>setOpen(false)} open={open} id="approvediv">
      <DialogTitle>Item Code and Desctipion</DialogTitle>
    
      <div className='grid grid-cols-2 w-full gap-4 p-2'>
        <Button variant='contained' id="approve" onClick={handleAction}>{loading?"Wait ...":"Approve"}</Button>
        <Button variant='contained' color='secondary' onClick={handleAction} id="reject">{loading?"Wait ...":"Reject"}</Button>
      </div>
      
    </Dialog>
      <div style={{ height: 500, width: '100%' }}>

        <DataGrid
            rows={reqlist}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 5 },
            },
            }}
            pageSizeOptions={[5, 10, 50]}
            checkboxSelection
            onRowClick={handleRowClick}
            onRowSelectionModelChange={handleSelectionChange}
            selectionModel={selectionModel}
        />
      </div>
      <div className='p-2'>
        {user?user.is_superuser?<Button variant="contained" onClick={pushToJD}>Push</Button>:"":""}
      </div>
    </div>
  )
}

export default RequitionList