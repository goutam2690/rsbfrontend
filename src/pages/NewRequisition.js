import React, { useState,useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { TextField, Autocomplete } from '@mui/material';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const mg = [
    "1E0107",
    "450FH",
    "450HI",
    "ASTM-572B",
    "AU-14 DQ IS 513",
    "AU-14 EDD IS 513",
    "E250",
    "E350",
    "E450",
    "DILLIDUR400V",
    "CQ",
    "E410W",
    "E410",
    "E300A",
    "E34",
    "E350C",
    "E38",
    "Fe410",
    "EN34",
    "EN10025",
    "E46",
    "EN31",
    "HARDOX-400",
    "DD-1079",
    "IS-2062",
    "QUEND-700",
    "ROCK STAR-400",
    "ST52.3",
    "TIST-52",
    "WELDOX-500",
    "WELDOX-700",
    "WELDOX-700E",
    "WELTEN-780",
    "WELTEN-590",
    "WELTEN-600",
    ">WELTEN-800",
    "WELTEN-780C",
    "C-35"
]




function NewRequisition() {
    const [loading,setLoading] = useState(true)
    const [master,setMaster] = useState(null)
    const [type,setType] = useState('direct')
    const {logout } = useContext(AuthContext);
    const [itemcategory,setItemCategory] = useState(null)
    const [itemfamily,setItemFamily] = useState(null)
    const [itemType,setItemType] = useState(null)
    const [moc,setMoc] = useState(null)
    const [subtype1,setSubType1] = useState(null)
    const [subtype2,setSubType2] = useState(null)
    const [process,setProcess] = useState(null)
    const [stage,setStage] = useState(null)
    const [supplyType,setSupplyType] = useState(null)
    const [stockingType,setStockingType] = useState(null)
    const [glclass,setGlClass] = useState(null)
    const [uom,setUom] = useState(null)
    const [lineType,setLineType] = useState(null)
    const [description,setDescription] = useState(null)
    const [itemCode,setItemCode] = useState(null)
    const [open,setOpen] = useState(false)
    const [sl,setSl] = useState(null)
    const [found,setFound] = useState(false)
    const [selectValue,setSelectValue] = useState(
      {
        "id":"",
        "type":type,
        "itemcategory":"",
        "itemfamily":"",
        "itemtypes":"",
        "subtype1":"",
        "subtype2":"",
        "moc":"",
        "meterialgrade":"",
        "itemmake":"",
        "specification":"",
        "dimension":"",
        "otherdetails":"",
        "process":"",
        "stage":"",
        "supplytype":"",
        "stockingtype":"",
        "glclass":"",
        "uom":"",
        "linetype":"",
        "slno":"",
        "itemno":'',
        "description":""
      }
    )

    // const sortAlphabetically = (array) => array.slice().sort((a, b) => a.localeCompare(b));
    const ncookies = new Cookies()
    const ntoken = ncookies.get('access')
    const handleRadioButton = (event)=>{
        var radiovalue = event.target.value;
        setType(radiovalue)
        setSelectValue({
          ...selectValue,
          type:radiovalue
        })
        setItemCategory(master.item_categories.filter((col)=>col.type===radiovalue))
        setItemFamily(master.families.filter((col)=>col.type===radiovalue))
    
    }
    
    const handleUserForm = (event)=>{
        event.preventDefault();
        const formData = new FormData(event.target); // Create a FormData object from the form
        const data = Object.fromEntries(formData.entries());
        console.log(data)
  
        // Convert the FormData to an object
        
      }
    function splitString(str, chunkSize) {
        let result = [];
        for (let i = 0; i < str.length; i += chunkSize) {
            result.push(str.slice(i, i + chunkSize));
        }
        return result;
    }
    function generatecode(){
      const categ = itemcategory.find(element=>element.id===selectValue.itemcategory)
      const fam = itemfamily.find(element=>element.id===selectValue.itemfamily)
      const itemtp = itemType.find(element=>element.id===selectValue.itemtypes)
      const moc_code = moc.find(element=>element.id===selectValue.moc)
      const itemc = selectValue.itemcategory
      const itemmoc =  selectValue.moc
      const itemf = selectValue.itemfamily
      const itemt = selectValue.itemtypes 
      const supplyt = supplyType.find(element=>element.id===selectValue.supplytype)
      const subtype1code = selectValue.subtype1
      const subtype2code = selectValue.subtype2
      var item_code = ""
      var descrptn = ""
      if(type === "indirect"){
        descrptn = subtype1code + " " + itemtp.name + " " + selectValue.specification
        getindirectItemRecord({itemc,itemf,itemt})
        item_code = categ.assignedNo + fam.assignedNo + itemtp.assignedNo + "000" + (sl + 1)

      }
      else{
        descrptn = subtype1code + " " + itemtp.name + " " + subtype2code 
        getItemRecord({itemc,itemmoc,itemf,itemt})
        item_code = categ.assignedNo + moc_code.assignedNo + fam.assignedNo + itemtp.assignedNo + "000" + (sl + 1) + supplyt.assignedNo

      }
      const splited_desc = splitString(descrptn,30)
      
      console.log(sl)
      const validdesc = ValidateDescription(item_code,descrptn)
      setItemCode(item_code)
      setDescription(splited_desc)
      
      setSelectValue({
        ...selectValue,
        "slno":(sl+1),
        'itemno':item_code,
        "description":descrptn
      })
  
    }
    async function CreateRequisition(){
      try{
        console.log("Data to save is",selectValue)
        const res = await axios.post("/requisition/",{selectValue}, {
          headers: {
              'Authorization': `Bearer ${ntoken}`
          },
          withCredentials: true
      });
      const rec_response = res
      if(rec_response.status === 200){
        if(rec_response.data.exists){
          toast.warning(rec_response.data.exists)
          setFound(true)
        }
        else if(rec_response.data.not_exists){
          toast.warning(rec_response.data.not_exists)
          setFound(false)
        }
        else if(rec_response.data.valid){
          toast.success(rec_response.data.valid)
          setOpen(false)
        }
        else if(rec_response.data.not_valid){
          toast.warning(rec_response.data.not_valid)
        }
        return rec_response.data
      }
    }
    catch(error){
      console.log(error)
    }
    }
    function ValidateDescription(itemcode,description){
    
        const res = axios.post("/validatedesc/",{itemcode,description}, {
          headers: {
              'Authorization': `Bearer ${ntoken}`
          },
          withCredentials: true
      });
      res
      .then((response)=>{
        const rec_response = response
        if(rec_response.status === 200){
          if(rec_response.data.exists){
            toast.warning(rec_response.data.exists)
            setFound(true)
          }
          else if(rec_response.data.not_exists){
            toast.success(rec_response.data.not_exists)
            setFound(false)
          }
          
        }
        setOpen(true)
      })
      .catch((error)=>{
        console.log(error)
      })
      
      
    }
    function getindirectItemRecord(formdata){
      try{
        const res = axios.put("/reqrecord/",{formdata}, {
          headers: {
              'Authorization': `Bearer ${ntoken}`
          },
          withCredentials: true
      });
      res
      .then((response)=>{
        console.log(response)
        if(response.status === 200){
          setSl(response.data.record[0].indirectitemid)
        }
      })
      .catch((error)=>{
        console.log(error)
      })
   
    }
    catch(error){
      console.log(error)
    }
    }
    
    function getItemRecord(formdata){
      try{
        const res = axios.post("/reqrecord/",{formdata}, {
          headers: {
              'Authorization': `Bearer ${ntoken}`
          },
          withCredentials: true
      });
      res
      .then((response)=>{
        console.log(response)
        if(response.status === 200){
          setSl(response.data.record[0].directitemid)
        }
      })
      .catch((error)=>{
        console.log(error)
      })
   
    }
    catch(error){
      console.log(error)
    }
  }
    useEffect(()=>{
        async function MasterItem(){
            const cookies = new Cookies()
            const token = cookies.get('access')
        try{
            const res =  axios.get("/masteritem/", {
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              withCredentials: true
          });
          res
          .then((response)=>{

           if(response.status === 200){
            const item = response.data?response.data:null
            console.log(item)
            setMaster(item)
            setItemCategory(item.item_categories.filter((col)=>col.type === type))
            setItemFamily(item.families.filter((col)=>col.type === type))
            setItemType(item.item_types.filter(element => element.type === type))
            setMoc(item.metals_of_construction.filter(element => element.type === type))
            setSubType1(item.subtype.filter(element => element.type === type && element.subtype1 !== ""))
            setSubType2(item.subtype.filter(element => element.type === type && element.subtype2 !== ""))
            setProcess(item.processes.filter(element=>element.type === type))
            setStage(item.stages.filter(element=>element.type === type))
            setSupplyType(item.supply_types.filter(element=>element.type === type))
            setStockingType(item.stocking_types)
            setGlClass(item.gl_classes)
            setUom(item.uoms)
            setLineType(item.line_types)
            setLoading(false)
           }
            
          })
          .catch((error)=>{
            console.error("catched error",error)
            if(error.response.status === 401){
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
        }
        MasterItem()
    },[])
  return (
    <div>
    <Dialog onClose={()=>setOpen(false)} open={open}>
      <DialogTitle>Item Code and Desctipion</DialogTitle>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Item Code</TableCell>
            {description?description.map((element,index)=><TableCell key={index} align="right">Description {index + 1}</TableCell>):""}
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow
              key={itemCode}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {itemCode}
              </TableCell>
              {description?description.map((element,index)=>  <TableCell key={index} component="th" scope="row">
                {element}
              </TableCell>):""}
            </TableRow>
          
        </TableBody>
      </Table>
    </TableContainer>
    {found?"":
      <Button variant='contained' onClick={CreateRequisition}>Save</Button>
    }
    </Dialog>
    {   loading?<h3>Loading ......</h3>: 
        <form onSubmit={handleUserForm} className="p-2">
        <FormControl >
                
                <RadioGroup
                row
                name="type"
                value={type}    
                onChange={handleRadioButton} 
                >
                    <FormControlLabel value="direct" control={<Radio />} label="Direct" />
                    <FormControlLabel value="indirect" control={<Radio />} label="Indirect" />
                </RadioGroup>
            </FormControl>
              <Box
                
                sx={{
                    '& > :not(style)': { m: 1, width: '100',display:'flex',flexDirection:'column',gap:'5'
                     },
                     '& .MuiInputBase-root': { 
                                   fontSize: '0.85rem' // Decrease font size for TextField
                    }
                }
                
                }
                noValidate
                autoComplete="off"
                >
                <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="itemcategory_autocomplete"
                      options={itemcategory} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={itemcategory.find((item) => item.id === selectValue.itemcategory) || null} // determine the selected value
                      onChange={(event, newValue) => {
                      if(newValue ===null){
                        setSelectValue({ ...selectValue, itemcategory: newValue ? newValue.id : '' });
                      }
                      else{
                        setItemFamily(master.families.filter(element=>element.type === type && element.category === newValue.id))
                      setMoc(master.metals_of_construction.filter(element=>element.type === type && element.category === newValue.id))
                        setSelectValue({ ...selectValue, itemcategory: newValue ? newValue.id : '' });
                   
                      }
                      
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Item Category"  />
                      )}
                    />
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="itemfamily_autocomplete"
                      options={itemfamily} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={itemfamily.find((item) => item.id === selectValue.itemfamily) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        if(newValue === null){
                        setSelectValue({ ...selectValue, itemfamily: newValue ? newValue.id : '' });

                        }
                        else{
                          setItemType(master.item_types.filter(element=>element.type === type && element.family === newValue.id))
                        
                        setSelectValue({ ...selectValue, itemfamily: newValue ? newValue.id : '' });
                        }
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Item Family" />
                      )}
                    />
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="itemtypes_autocomplete"
                      options={itemType} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={itemType.find((item) => item.id === selectValue.itemtypes) || null} // determine the selected value
                      onChange={(event, newValue) => {
                      setSubType1(master.subtype.filter(element=>element.type === type && element.itemtype === newValue.id && element.subtype1 !==""))
                      setSubType2(master.subtype.filter(element=>element.type === type && element.itemtype === newValue.id && element.subtype2 !==""))
                        
                        setSelectValue({ ...selectValue, itemtypes: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Item Types" />
                      )}
                    />
                    
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="subtype1_autocomplete"
                      options={subtype1} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.subtype1} // function to display option label
                      value={subtype1.find((item) => item.subtype1 === selectValue.subtype1) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, subtype1: newValue ? newValue.subtype1 : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.subtype1}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Type1" />
                      )}
                    />
    
                  {
                    type === 'direct'?<Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="subtype2_autocomplete"
                      options={subtype2} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.subtype2} // function to display option label
                      value={subtype2.find((item) => item.subtype2 === selectValue.subtype2) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, subtype2: newValue ? newValue.subtype2 : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.subtype2}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Type2" />
                      )}
                    />:""
                }
                {
                  type === "direct"?
                  <div>
                  <Autocomplete
                    disablePortal
                    size="small"
                    classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                    id="moc_autocomplete"
                    options={moc} // the options prop expects an array of objects
                    getOptionLabel={(option) => option.name} // function to display option label
                    value={moc.find((item) => item.id === selectValue.moc) || null} // determine the selected value
                    onChange={(event, newValue) => {
                      
                      setSelectValue({ ...selectValue, moc: newValue ? newValue.id : '' });
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                    renderInput={(params) => (
                      <TextField {...params} label="Metal of construction" />
                    )}
                  />
                <Autocomplete
                    disablePortal
                    size="small"
                    sx={{marginTop:"10px"}}
                    classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm '}}
                    id="mtgrade_autocomplete"
                    options={mg} // the options prop expects an array of objects
                    getOptionLabel={(option) => option} // function to display option label
                    value={mg.find((item) => item === selectValue.meterialgrade) || null} // determine the selected value
                    onChange={(event, newValue) => {
                      setSelectValue({ ...selectValue, meterialgrade: newValue ? newValue : '' });
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                          <li {...props} key={option}>
                            {option}
                          </li>
                        )}
                    renderInput={(params) => (
                      <TextField {...params} label="Meterial Grade" />
                    )}
                  />
                  </div>
                  :""
                  }
                    {
                      type === 'indirect'?
                      <TextField size="small" id="itemmake" className="mt-4 text-sm" onChange={(e)=>setSelectValue({...selectValue,itemmake:e.target.value})} value={selectValue.itemmake} label="Item make" name="itemmake" variant="outlined" InputLabelProps={{shrink: true,}} />
                      :""
                    }
                  <TextField size="small" id="specification" onChange={(e)=>setSelectValue({...selectValue,specification:e.target.value})} value={selectValue.specification} label="Specification" name="specification" variant="outlined" InputLabelProps={{shrink: true,}} />
                  {
                      type === 'indirect'?
                      <div>
                      <TextField size="small" id="dimension" className="text-sm mt-4" onChange={(e)=>setSelectValue({...selectValue,dimension:e.target.value})} value={selectValue.dimension} label="Dimension" name="dimension" variant="outlined" InputLabelProps={{shrink: true,}} />
                      <TextField size="small" id="otherdetails" sx={{marginTop:'10px'}} className="text-sm mt-4" onChange={(e)=>setSelectValue({...selectValue,otherdetails:e.target.value})} value={selectValue.otherdetails} label="Other Details" name="otherdetails" variant="outlined" InputLabelProps={{shrink: true,}} />
                      </div>
                      
                      :""
                    }
                  {
                    selectValue.itemcategory === 2?
                    <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="lastprocess_autocomplete"
                      options={process} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={process.find((item) => item.id === selectValue.process) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, process: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} className='text-sm' label="Last Process" />
                      )}
                    />
                 :""
                  }
                  {
                    selectValue.itemcategory === 3?
                    <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="stages_autocomplete"
                      options={stage} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={stage.find((item) => item.id === selectValue.stage) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, stage: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Stages" />
                      )}
                    />
                     
                    :""
                  }
                  {
                    type === "direct"?
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="supplytype_autocomplete"
                      options={supplyType} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={supplyType.find((item) => item.id === selectValue.supplytype) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, supplytype: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Supply Type" />
                      )}
                    />
                    :""
                    }
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="stockingtype_autocomplete"
                      options={stockingType} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={stockingType.find((item) => item.id === selectValue.stockingtype) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, stockingtype: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Stocking Type" />
                      )}
                    />
                     <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="glclass_autocomplete"
                      options={glclass} // the options prop expects an array of objects
                      getOptionLabel={(option) => `${option.name} (${option.assignedNo})`} // function to display option label
                      value={glclass.find((item) => item.id === selectValue.glclass) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, glclass: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Gl Class" />
                      )}
                    />
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="uom_autocomplete"
                      options={uom} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={uom.find((item) => item.id === selectValue.uom) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, uom: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="UOM" />
                      )}
                    />
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="linetype_autocomplete"
                      options={lineType} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={lineType.find((item) => item.id === selectValue.linetype) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, linetype: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Line Type" />
                      )}
                    />
                  
                  
                  <div className='flex gap-2 mt-4'>
                    <Button variant="contained" onClick={generatecode} >Generate</Button>
                   
                  </div> 
              
                
              </Box>
      
        </form>
        }
    </div>
  )
}

export default NewRequisition