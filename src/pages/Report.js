import React, { useContext, useEffect, useState } from 'react'

import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { AuthContext } from '../AuthContext';
import { Box, Button, Input } from '@mui/material';
const columns = [
  { field: 'id', headerName: 'Trn No', width: 50 },
  { field: 'created', headerName: 'Date', width: 130 },
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
  { field: 'user', headerName: 'User', width: 130, renderCell: (params) => params.row.user?.username },
  { field: 'unit', headerName: 'Unit', width:130, renderCell: (params) => params.row.branch?.unit},
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


function Report() {
   
    const [reqlist,setReqList] = useState(null)
    const {logout} = useContext(AuthContext);
    const [tempReq, setTempReq] = useState(null)
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        // Define initial visibility model
        itemcategory:false,
        itemfamily:false,
        itemtype:false,
        subtype1:false,
        subtype2:false,
        mtofconst:false,
        materialg:false,
        specification:false,
        supplytype:false,
        process:false,
        stage:false,
        stockingtype:false,
        glclass:false,
        uom:false,
        linetype:false,
        // other columns...
      });
    function filterRequistion(event){
        event.preventDefault();
        const formData = new FormData(event.target); // Create a FormData object from the form
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        const startDate = new Date(data.startdate); // Start date for the range
        const endDate = new Date(data.enddate); // End date for the range
        
        const filteredData = tempReq.filter(item => {
        const itemDate = new Date(item.created);
        return itemDate >= startDate && itemDate <= endDate;
        });
        setReqList(filteredData)
    }
    function handlePrint() {
        // Get visible columns from the state
        const visibleColumns = columns.filter(column => columnVisibilityModel[column.field] !== false);
      
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; }</style>');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h1>Report</h1>');
        printWindow.document.write('<table>');
      
        // Add table headers
        printWindow.document.write('<tr>');
        visibleColumns.forEach(column => printWindow.document.write(`<th>${column.headerName}</th>`));
        printWindow.document.write('</tr>');
      
        // Add table rows
        reqlist.forEach(row => {
          printWindow.document.write('<tr>');
          visibleColumns.forEach(column => {
            let cellValue = row[column.field];
      
            // Handle nested objects
            if (typeof cellValue === 'object' && cellValue !== null) {
              cellValue = cellValue.username || cellValue.name || cellValue.branch || ""; // Adjust based on your data
            }
            if(column.headerName==='Operation' || column.headerName==='Accounts'){
                if (cellValue === true) {
                    cellValue = 'Approved';
                  }  else {
                    cellValue = 'Pending';
                  }
            }
            
            printWindow.document.write(`<td>${cellValue}</td>`);
          });
          printWindow.document.write('</tr>');
        });
      
        printWindow.document.write('</table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
      
      
      
    useEffect(()=>{
        let isMounted = true; // Flag to track component mount status
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
      if(response.status === 200 && isMounted === true){
        console.log(response.data)
        setReqList(response.data.rq)
        setTempReq(response.data.rq)
      }
    })
    .catch((error)=>{
        if (isMounted) {
      console.log(error)
      toast.warning('Session expired')
      logout()
        }
    })
    return () => {
        isMounted = false; // Cleanup flag on unmount
      };
    },[])
    return (
      <div id='rqlist'>
      <div className='w-full p-2 rounded-sm border-2 border-gray-300'>
        <form onSubmit={filterRequistion}>
        <Box 
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        
            sx={{
                '& > :not(style)': { m: 1, width: '35ch',gap:'5'
                    },
                   
            }
            
            }
            noValidate
            autoComplete="off"
            >
            <Input type='date' name="startdate" id="startdate" />
            <Input type='date' name='enddate' id='enddate' />
            <Button type='submit' variant='contained'>Filter</Button>
            <Button onClick={handlePrint} variant='contained'>Print</Button>
        </Box>
        </form>
      </div>
        <div style={{ height: 500, width: '100%' }}>
        
          <DataGrid
              rows={reqlist}
              columns={columns}
              initialState={{
                columns: {
                    columnVisibilityModel: columnVisibilityModel,
                    
                    },
              pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
              },
              }}
              pageSizeOptions={[5, 10, 50]}
              slots={{ toolbar: GridToolbar }}
              onColumnVisibilityModelChange={(newModel) =>
    setColumnVisibilityModel(newModel)
  } 
          />
        </div>
      </div>
    )
  }

export default Report