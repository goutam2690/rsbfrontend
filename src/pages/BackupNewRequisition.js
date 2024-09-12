import React, { useState,useContext, useEffect } from 'react'
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { InputLabel, MenuItem, Select, TextField } from '@mui/material';

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
    const [selectValue,setSelectValue] = useState(
      {
        "type":type,
        "itemcategory":"",
        "itemfamily":"",
        "itemtypes":"",
        "subtype1":"",
        "subtype2":"",
        "moc":"",
        "meterialgrade":"",
        "specification":"",
        "process":"",
        "stage":"",
        "supplytype":"",
        "stockingtype":"",
        "glclass":"",
        "uom":"",
        "linetype":"",
        "itemno":'',
        "description":""
      }
    )
    const ncookies = new Cookies()
    const ntoken = ncookies.get('access')
    const handleRadioButton = (event)=>{
        var radiovalue = event.target.value;
        setType(radiovalue)
        setItemCategory(master.item_categories.filter((col)=>col.type===radiovalue))
        setItemFamily(master.families.filter((col)=>col.type===radiovalue))
    
    }
    function handleCategory(event){
      setItemFamily(master.families.filter(element=>element.type === type && element.category === event.target.value))
      setSelectValue({...selectValue,[event.target.name]:event.target.value})
      setMoc(master.metals_of_construction.filter(element=>element.type === type && element.category === event.target.value))
    }
    function handleFamilyChange(event){
      setItemType(master.item_types.filter(element=>element.type === type && element.family === event.target.value))
      setSelectValue({...selectValue,[event.target.name]:event.target.value})
   
    }
    function handleItemTypeChange(event){
      setSubType1(master.subtype.filter(element=>element.type === type && element.itemtype === event.target.value && element.subtype1 !==""))
      setSelectValue({...selectValue,[event.target.name]:event.target.value})
      setSubType2(master.subtype.filter(element=>element.type === type && element.itemtype === event.target.value && element.subtype2 !==""))
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
      const descrptn = subtype1code + " " + itemtp.name + " " + subtype2code 
      
      const splited_desc = splitString(descrptn,30)
      getItemRecord({itemc,itemmoc,itemf,itemt})
      console.log(sl)
      const item_code = categ.assignedNo + moc_code.assignedNo + fam.assignedNo + itemtp.assignedNo + "000" + (sl + 1) + supplyt.assignedNo
      const validdesc = ValidateDescription(item_code,descrptn)
      setItemCode(item_code)
      setDescription(splited_desc)
      
      setSelectValue({
        ...selectValue,
        'itemno':item_code,
        "description":descrptn
      })
  
    }
    async function CreateRequisition(){
      try{
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
        }
        else if(rec_response.data.not_exists){
          toast.warning(rec_response.data.not_exists)
        }
        else if(rec_response.data.valid){
          toast.success(rec_response.data.valid)
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
          }
          else if(rec_response.data.not_exists){
            toast.success(rec_response.data.not_exists)
            
          }
          
        }
        setOpen(true)
      })
      .catch((error)=>{
        console.log(error)
      })
      
      
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
    <Button variant='contained' onClick={CreateRequisition}>Save</Button>
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
                    '& > :not(style)': { m: 1, width: '30ch', display:'flex',flexDirection:'column' },
                }}
                noValidate
                autoComplete="off"
                >
                  <FormControl fullWidth>
                    <InputLabel id="category_label">Item Category</InputLabel>
                    <Select
                      labelId="category_label"
                      id="category"
                      label="Item Category"
                      name="itemcategory"
                      value={selectValue.itemcategory}
                      onChange={handleCategory}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {itemcategory
                        .map(filteredElement => (
                            <MenuItem value={filteredElement.id} key={filteredElement.id}>
                            {filteredElement.name}
                            </MenuItem>
                        ))
                    }
                   
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="family_label">Item Family</InputLabel>
                    <Select
                      labelId="family_label"
                      id="family"
                      label="Item Family"
                      name="itemfamily"
                      value={selectValue.itemfamily}
                      onChange={handleFamilyChange}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        itemfamily
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="itemtypes_label">Item Types</InputLabel>
                    <Select
                      labelId="itemtypes_label"
                      id="itemtypes"
                      label="Item Types"
                      name="itemtypes"
                      value={selectValue.itemtypes}
                      onChange={handleItemTypeChange}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        itemType
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="subtype1_label">Sub Type1</InputLabel>
                    <Select
                      labelId="subtype1_label"
                      id="subtype1"
                      label="Sub Type1"
                      name="subtype1"
                      value={selectValue.subtype1}
                      onChange={(e)=>setSelectValue({...selectValue,subtype1:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        subtype1
                        .map((element)=> <MenuItem value={element.subtype1} key={element.subtype1}>{element.subtype1}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="subtype2_label">Sub Type2</InputLabel>
                    <Select
                      labelId="subtype2_label"
                      id="subtype2"
                      label="Sub Type2"
                      name="subtype2"
                      value={selectValue.subtype2}
                      onChange={(e)=>setSelectValue({...selectValue,subtype2:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        subtype2
                        .map((element)=> <MenuItem value={element.subtype2} key={element.subtype2}>{element.subtype2}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="moc_label">Metal of construction</InputLabel>
                    <Select
                      labelId="moc_label"
                      id="moc"
                      label="Metal of construction"
                      name="moc"
                      value={selectValue.moc}
                      onChange={(e)=>setSelectValue({...selectValue,moc:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        moc
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="mg_label">Meterial Grade</InputLabel>
                    <Select
                      labelId="mg_label"
                      id="mg"
                      label="Meterial of Grade"
                      name="meterialgrade"
                      value={selectValue.meterialgrade}
                      onChange={(e)=>setSelectValue({...selectValue,meterialgrade:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        mg
                        .map((element)=> <MenuItem value={element} key={element}>{element}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <TextField id="specification" onChange={(e)=>setSelectValue({...selectValue,specification:e.target.value})} value={selectValue.specification} label="Specification" name="specification" variant="outlined" InputLabelProps={{shrink: true,}} />
                  {
                    selectValue.itemcategory === 2?
                  <FormControl fullWidth>
                    <InputLabel id="process_label">Last Process</InputLabel>
                    <Select
                      labelId="process_label"
                      id="process"
                      label="Last Process"
                      name="process"
                      value={selectValue.process}
                      onChange={(e)=>setSelectValue({...selectValue,process:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        process
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>:""
                  }
                  {
                    selectValue.itemcategory === 3?
                      <FormControl fullWidth>
                      <InputLabel id="stages_label">Stages</InputLabel>
                      <Select
                        labelId="stages_label"
                        id="stages"
                        label="Stages"
                        name="stage"
                        value={selectValue.stage}
                        onChange={(e)=>setSelectValue({...selectValue,stage:e.target.value})}
                        >
                      <MenuItem value="">Select</MenuItem>
                      {
                          stage
                          .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                      }
                        
                      </Select>
                    
                      </FormControl>
                    :""
                  }
                 
                  <FormControl fullWidth>
                    <InputLabel id="supplytype_label">Type of supply</InputLabel>
                    <Select
                      labelId="supplytype_label"
                      id="supplytype"
                      label="Type of Supply"
                      name="supplytype"
                      value={selectValue.supplytype}
                      onChange={(e)=>setSelectValue({...selectValue,supplytype:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        supplyType
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="stockingtype_label">Stocking Type</InputLabel>
                    <Select
                      labelId="stockingtype_label"
                      id="stockingtype"
                      label="Stocking Type"
                      name="stockingtype"
                      value={selectValue.stockingtype}
                      onChange={(e)=>setSelectValue({...selectValue,stockingtype:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        stockingType
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="glclass_label">Gl Class</InputLabel>
                    <Select
                      labelId="glclass_label"
                      id="glclass"
                      label="Gl Class"
                      name="glclass"
                      value={selectValue.glclass}
                      onChange={(e)=>setSelectValue({...selectValue,glclass:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        glclass
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="uom_label">UOM</InputLabel>
                    <Select
                      labelId="uom_label"
                      id="uom"
                      label="UOM"
                      name="uom"
                      value={selectValue.uom}
                      onChange={(e)=>setSelectValue({...selectValue,uom:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        uom
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="linetype_label">Line Type</InputLabel>
                    <Select
                      labelId="linetype_label"
                      id="linetype"
                      label="Line Type"
                      name="linetype"
                      value={selectValue.linetype}
                      onChange={(e)=>setSelectValue({...selectValue,linetype:e.target.value})}
                      >
                    <MenuItem value="">Select</MenuItem>
                    {
                        lineType
                        .map((element)=> <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
                    }
                      
                    </Select>
                  
                  </FormControl>
                  
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