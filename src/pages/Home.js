import React, {useEffect, useState } from 'react';
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Cookies from 'universal-cookie';
import axios from 'axios';


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
  


const Home = () => {

  const [reqlist,setReqList] = useState(null)
  const [data,setData] = useState(
    {
        op_pending:0,
        op_rejected:0,
        a_pending:0,
        a_rejected:0,
        ytd:0,
        mtd:0
    }
  )
  const isCurrentYear = (date) => {
    const year = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    return year === currentYear;
};

const isCurrentMonth = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth(); // 0-based index (January is 0)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return year === currentYear && month === currentMonth;
};

// Count requisitions by year and month

    useEffect(()=>{
        const cookies = new Cookies()
        const token = cookies.get('access')
        const countRequisitions = (data) => {
            let yearCount = 0;
            let monthCount = 0;
        
            data.forEach(item => {
                if (isCurrentYear(item.created)) {
                    yearCount++;
                    if (isCurrentMonth(item.created)) {
                        monthCount++;
                    }
                }
            });
        
            return { yearCount, monthCount };
        };
        const getOp_pending = (data)=>{
            return data?data.filter(element=>element.operation === false).length:0
        }
        const getOp_rejected = (data)=>{
            return data?data.filter(element=>element.orejected === false).length:0
        }
        const getA_rejected = (data)=>{
            return data?data.filter(element=>element.arejected === false).length:0
        }
        const getA_pending = (data)=>{
            return data?data.filter(element=>element.account === false).length:0       }
        
        try{
            const getRequisiton = async ()=>{
                const res = await axios.get("/requisition/", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                const response = await res;
                if(response.status === 200){
                    console.log(response.data)
                    setReqList(response.data.rq)
                    const { yearCount, monthCount } = countRequisitions(response.data.rq);
                    setData({
                        op_pending:getOp_pending(response.data.rq),
                        op_rejected:getOp_rejected(response.data.rq),
                        a_pending:getA_pending(response.data.rq),
                        a_rejected:getA_rejected(response.data.rq),
                        ytd:yearCount,
                        mtd:monthCount
                    })
                  }
            }
            getRequisiton() 
        }
        catch(error){
            console.log(error);
        }
        
      
      },[])
    return (
        <div className='w-full h-screen p-4'>
            <div className='w-full flex justify-center gap-4 flex-wrap'>
                <div className=' w-72 rounded-md h-40 p-4  bg-[#EAF7CF]'>
                    <h1 className=' text-lg font-bold text-gray-400'>Operations</h1>
                    <div className='grid grid-cols-2 gap-2'>
                    <div className='w-full flex flex-col items-center pr-2 justify-center border-r-2'>
                        <p>Direct</p>
                        <div className='grid grid-cols-2 gap-2'>
                            <p>Pending</p><p>Rejected</p>
                            <p className='text-center'>{data.op_pending}</p><p className='text-center'>0</p>
                        </div>
                    
                    </div>
                 
                    <div className='w-full flex flex-col items-center pr-2 justify-center'>
                        <p> InDirect</p>
                        <div className='grid grid-cols-2 gap-2'>
                            <p>Pending</p><p>Rejected</p>
                            <p className='text-center'>{data.op_pending}</p><p className='text-center'>0</p>
                        </div>
                    
                    </div>
                    </div>
                </div>
                <div className=' w-72 rounded-md h-40 p-4 bg-[#EAF7CF]'>
                <h1 className='text-lg font-bold text-gray-400'>Accounts</h1>
                <div className='grid grid-cols-2 gap-2 w-full'>
                <div className='w-full flex flex-col items-center pr-2 justify-center border-r-2'>
                        <p>Direct</p>
                        <div className='grid grid-cols-2 gap-2'>
                            <p>Pending</p><p>Rejected</p>
                            <p className='text-center'>{data.op_pending}</p><p className='text-center'>0</p>
                        </div>
                    
                    </div>
                 
                    <div className='w-full flex flex-col items-center pr-2 justify-center'>
                        <p> InDirect</p>
                        <div className='grid grid-cols-2 gap-2'>
                            <p>Pending</p><p>Rejected</p>
                            <p className='text-center'>{data.op_pending}</p><p className='text-center'>0</p>
                        </div>
                    
                    </div>
                </div>
                </div>
                <div className=' w-72 rounded-md h-40 p-4 bg-[#EAF7CF]'>
                <div className='grid grid-cols-2 gap-2 w-full'>
                    <h1 className='text-lg font-bold text-gray-400'>YTD</h1>

                    <p className='text-center'>{data.ytd}</p>
                    
                    <p>Direct</p><p className='text-center'>2</p>
                    <p>InDirect</p><p className='text-center'>1</p>
                    
                </div>

                </div>
                <div className=' w-72 rounded-md h-40 p-4 bg-[#EAF7CF]'>
                <div className='grid grid-cols-2 gap-2 w-full'>
                    <h1 className='text-lg font-bold text-gray-400'>MTD</h1>

                    <p className='text-center'>{data.ytd}</p>
                    
                    <p>Direct</p><p className='text-center'>2</p>
                    <p>InDirect</p><p className='text-center'>1</p>
                    
                </div>
                </div>
                {/* <div className=' w-72 rounded-md h-40 bg-[#A10702]'>


                </div> */}
            </div>
            <Box
                
                sx={{
                    '& > :not(style)': { m: 1, width: '100', display:'flex',flexDirection:'column' },
                }}
                noValidate
                autoComplete="off"
                >
                <DataGrid
                rows={reqlist}
                columns={columns}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                        // Set the columns you want to hide here
                       
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
                        
                        // You can add more columns to hide by default
                        },
                    },
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 50]}
                slots={{ toolbar: GridToolbar }}
                    />
            
            </Box>
        </div>
    );
};

export default Home;
