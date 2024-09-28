import React, { useState,useContext, useEffect, useLayoutEffect, useRef } from 'react'
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
import { FaWindowClose } from 'react-icons/fa';





function NewRequisition(props) {
    const [loading,setLoading] = useState(true)
    const [master,setMaster] = useState(null)
    const [type,setType] = useState('direct')
    const {logout } = useContext(AuthContext);
    const [itemmake,setItemMake] = useState(null)
    const [itemcategory,setItemCategory] = useState(null)
    const [itemfamily,setItemFamily] = useState(null)
    const [itemType,setItemType] = useState(null)
    const [moc,setMoc] = useState(null)
    const [mg,setMg] = useState(null)
    const [subtype1,setSubType1] = useState(null)
    const [subtype2,setSubType2] = useState(null)
    const [process,setProcess] = useState(null)
    const [stage,setStage] = useState(null)
    const [specification,setSpecification] = useState(null)
    const [dimensions,setDimension] = useState(null)
    const [otherdetails,setOtherDetails] = useState(null)
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
    const [hsn,setHsn] = useState(null)
    const [commodity,setCommodity] = useState(null)
    const [subcommodity,setSubCommodity] = useState(null)
    const editrow = useRef(props.editRow)
   const familyids = [70,72,55,56,57,59]
    const [selectValue,setSelectValue] = useState(
      {
        "id":"",
        "type":type,
        "itemcategory":"",
        "itemfamily":"",
        "itemtypes":"",
        "otheritemtype":"",
        "subtype1":"",
        "othersubtype1":"",
        "subtype2":"",
        "othersubtype2":"",
        "moc":"",
        "meterialgrade":"",
        "materialg":"",
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
        'hsn':'',
        "commodity":"",
        "subcommodity":"",
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
        setSpecification(master.specification.filter((col)=>col.type===radiovalue))
    
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
    function validateField(obj){
      let indirectFields = [
        'itemcategory',
        'itemfamily',
        'itemtypes',
        'subtype1',
        'subtype2',
        'stockingtype',
        'glclass',
        'uom',
        'linetype',
      ]
      let directFields = [
        'itemcategory',
        'itemfamily',
        'itemtypes',
        'subtype1',
        'subtype2',
        'moc',
        'supplytype',
        'stockingtype',
        'glclass',
        'uom',
        'linetype',
      ]
      
      let requiredFields = ""
      if(type==='direct'){
        requiredFields =directFields;
      }
      else{
        requiredFields = indirectFields;
      }
      for (const field of requiredFields) {
       
        if (obj[field] === null || obj[field] === '') {
          toast.warning(`Field ${field} is required`)
          return false; // Field is null or blank
        }
       
       
      }
    
      return true; // All fields are valid
    }
    function generatecode(){
      
      let vfield = validateField(selectValue)
      function generate(){
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
        var srl
        if(type === "indirect"){
          descrptn = subtype1code + " " + itemtp.name + " " + selectValue.specification
          if(props.editRow){
            setSl(props.editRow.slno)
            srl = props.editRow.slno
            setSl(Number(srl))
          item_code = categ.assignedNo + fam.assignedNo + itemtp.assignedNo + (Number(srl)).toString().padStart(4, '0')

            }
            else{
              srl = getindirectItemRecord({itemc,itemf,itemt})
              setSl(Number(srl)+1)
          item_code = categ.assignedNo + fam.assignedNo + itemtp.assignedNo + (Number(srl) + 1).toString().padStart(4, '0')

            }
          

        }
        else{
          descrptn = subtype1code + " " + itemtp.name + " " + subtype2code 
          
          if(props.editRow){
            setSl(Number(props.editRow.slno))
            srl = props.editRow.slno
          item_code = categ?.assignedNo + moc_code?.assignedNo + fam?.assignedNo + itemtp?.assignedNo  + (Number(srl)).toString().padStart(4, '0') + supplyt.assignedNo

            }
            else{
             srl =  getItemRecord({itemc,itemmoc,itemf,itemt})
             setSl(Number(srl)+1)
          item_code = categ?.assignedNo + moc_code?.assignedNo + fam?.assignedNo + itemtp?.assignedNo  + (Number(srl) + 1).toString().padStart(4, '0') + supplyt.assignedNo
          console.log("before item code sl is",sl)
            }
         
        

        }
        const splited_desc = splitString(descrptn,30)
        
        console.log("serial no is ",srl)
        
        if(props.editRow){

          const itemno = props.editRow.itemno
          console.log("types are",typeof(itemno),typeof(item_code),itemno,item_code,itemno===item_code)
          if(props.editRow.itemno === item_code){
            console.log("Do Not validate")
            setOpen(true)
            setFound(false)
          }
          else{
            ValidateDescription(item_code,descrptn)
          }
        
        }
        else{
          console.log("not row")
          ValidateDescription(item_code,descrptn)
        }

        
        setItemCode(item_code)
        setDescription(splited_desc)
        
        setSelectValue({
          ...selectValue,
          "slno":(sl),
          'itemno':item_code,
          "description":descrptn
        })
    
      }
      vfield?generate()
      : console.log(false)
  
    }
    async function CreateRequisition(){
      try{
        console.log("Data to save is",selectValue)
        let res = ""
        console.log("props is ",props)
        if(props.editRow){
          console.log("props exists")
          res = await axios.put("/requisition/"+props.editRow.id+"/",{selectValue}, {
            headers: {
                'Authorization': `Bearer ${ntoken}`
            },
            withCredentials: true
        });
        }
        else{
          res = await axios.post("/requisition/",{selectValue}, {
            headers: {
                'Authorization': `Bearer ${ntoken}`
            },
            withCredentials: true
        });
        }
        
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
          return response.data.record[0].indirectitemid
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
          return response.data.record[0].directitemid
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
      let isMounted = true
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

           if(response.status === 200 && isMounted===true){
            const item = response.data?response.data:null
            console.log("items are",item)
            setMaster(item)
            setItemCategory(item.item_categories.filter((col)=>col.type === type))
            setItemFamily(item.families.filter((col)=>col.type === type))
            setItemType(item.item_types.filter(element => element.type === type))
            setMoc(item.metals_of_construction.filter(element => element.type === type))
            setSubType1(item.subtype1.filter(element => element.type === type))
            setSubType2(item.subtype2.filter(element => element.type === type))
            setProcess(item.processes.filter(element=>element.type === type))
            setStage(item.stages.filter(element=>element.type === type))
            setSupplyType(item.supply_types.filter(element=>element.type === type))
            setStockingType(item.stocking_types)
            setGlClass(item.gl_classes)
            setUom(item.uoms)
            setLineType(item.line_types)
            setMg(item.materialgrade)
            setItemMake(item.itemmake)
            setSpecification(item.specification)
            setOtherDetails(item.otherdetails)
            setDimension(item.dimensions)
            setHsn(item.hsn)
            setCommodity(item.commodity)
            setSubCommodity(item.subcommodity)
            setLoading(false)
           }
            
          })
          .catch((error)=>{
            console.error("catched error",error)
            if(error.response.status === 401 && isMounted === true){
                toast.warning("Session expired")
                logout()
            }
            isMounted = false
          })
         
          
          }
          catch(error){
            console.log(error)
            toast.warning("session timeout")
     
          }
        }
        MasterItem()
        return () => {
          isMounted = false; // Cleanup flag on unmount
        };
    },[])
    useLayoutEffect(()=>{
   let isMounted = true
   function editablerow(){ 
      if(editrow.current){
        console.log("Editable row",editrow.current)
        setSelectValue({
          ...selectValue,
          id:editrow.current.id,
          type:editrow.current.type,
          itemcategory:editrow.current.itemcategory?.id,
          itemfamily:editrow.current.itemfamily?.id,
          itemtypes:editrow.current.itemtype?.id,
          subtype1:editrow.current.subtype1?.name,
          subtype2:editrow.current.subtype2?.name,
          moc:editrow.current.mtofconst.id,
          meterialgrade:editrow.current.materialg,
          itemmake:editrow.current.itemmake,
          specification:editrow.current.specification,
          dimension:editrow.current.dimension?.id,
          otherdetails:editrow.current.otherdetails?.id,
          process:editrow.current.process?.id,
          stage:editrow.current.stage?.id,
          supplytype:editrow.current.supplytype?.id,
          stockingtype:editrow.current.stockingtype?.id,
          glclass:editrow.current.glclass?.id,
          uom:editrow.current.uom?.id,
          linetype:editrow.current.linetype?.id,
          hsn:editrow.current.hsn?.id,
          commodity:editrow.current.commodity?.id,
          subcommodity:editrow.current.subcommodity?.id,
          slno:editrow.current.slno,
          itemno:editrow.current.itemcode,
          description:editrow.current.description,
        })
      }
    }
    if(isMounted===true){
      editablerow()
    }
    return ()=>{
      isMounted = false
    }
  
     
     
    },[editrow.current])
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
<FaWindowClose className='float-end text-xl mr-2' onClick={props.toggleDrawer(false)} />
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
                    '& > :not(style)': { m: 1,gap:'5'
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
                      setSubType1(master.subtype1.filter(element=>element.type === type && element.itemtype === newValue.id))
                      setSubType2(master.subtype2.filter(element=>element.type === type && element.itemtype === newValue.id))
                        
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
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={subtype1.find((item) => item.name === selectValue.subtype1) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        console.log(newValue)
                        setSelectValue({ ...selectValue, subtype1: newValue ? newValue.name : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Type1" />
                      )}
                    />
                 
    
                  {
                    type === 'direct'? 
                    <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="subtype2_autocomplete"
                      options={subtype2} // the options prop expects an array of objects
                      getOptionLabel={(option) => option.name} // function to display option label
                      value={subtype2.find((item) => item.name === selectValue.subtype2) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, subtype2: newValue ? newValue.name : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Type2" />
                      )}
                    />
                     
                    :""
                }
                {
                  type === "direct"?
                  <div>
                  <Autocomplete
                    disablePortal
                    size="small"
                    sx={{marginTop:"10px"}}
                    classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm '}}
                    id="mtgrade_autocomplete"
                    options={mg} // the options prop expects an array of objects
                    getOptionLabel={(option) => option.name} // function to display option label
                    value={mg.find((item) => item.name === selectValue.meterialgrade) || null} // determine the selected value
                    onChange={(event, newValue) => {
                      setSelectValue({ ...selectValue, meterialgrade: newValue ? newValue.name : '',materialg:newValue?newValue.id:"" });
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                    renderInput={(params) => (
                      <TextField {...params} label="Meterial Grade" />
                    )}
                  />
                  <Autocomplete
                  className='mt-2'
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
                      <TextField {...params} label="Meterial of construction" />
                    )}
                  />
               
                  </div>
                  :""
                  }
                    {
                      type === 'indirect'?
                      <Autocomplete
                        disablePortal
                        size="small"
                        sx={{marginTop:"10px"}}
                        classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm '}}
                        id="itemmake_autocomplete"
                        options={itemmake} // the options prop expects an array of objects
                        getOptionLabel={(option) => option} // function to display option label
                        value={itemmake.find((item) => item.id === selectValue.itemmake) || null} // determine the selected value
                        onChange={(event, newValue) => {
                          setSelectValue({ ...selectValue, itemmake: newValue ? newValue.id : '' });
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option) => (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            )}
                        renderInput={(params) => (
                          <TextField {...params} label="Item Make" />
                        )}
                      />
                      :""
                    }
                    {
                      selectValue.itemfamily === 63?
                      <Autocomplete
                        disablePortal
                        size="small"
                        sx={{marginTop:"10px"}}
                        classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm '}}
                        id="specification_autocomplete"
                        options={specification} // the options prop expects an array of objects
                        getOptionLabel={(option) => option} // function to display option label
                        value={specification.find((item) => item.id === selectValue.specification) || null} // determine the selected value
                        onChange={(event, newValue) => {
                          setSelectValue({ ...selectValue, specification: newValue ? newValue.id : '' });
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option) => (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            )}
                        renderInput={(params) => (
                          <TextField {...params} label="Item Make" />
                        )}
                      />
                      :""
                    }
                  {
                    familyids.includes(selectValue.itemfamily)?
                      <div>
                      <Autocomplete
                        disablePortal
                        size="small"
                        sx={{marginTop:"10px"}}
                        classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm '}}
                        id="dimensions_autocomplete"
                        options={dimensions} // the options prop expects an array of objects
                        getOptionLabel={(option) => option.name} // function to display option label
                        value={dimensions.find((item) => item.id === selectValue.dimension) || null} // determine the selected value
                        onChange={(event, newValue) => {
                          setSelectValue({ ...selectValue, dimension: newValue ? newValue.id : '' });
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option) => (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            )}
                        renderInput={(params) => (
                          <TextField {...params} label="Dimension" />
                        )}
                      />
                       <Autocomplete
                        disablePortal
                        size="small"
                        sx={{marginTop:"10px"}}
                        classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm '}}
                        id="otherdetails_autocomplete"
                        options={otherdetails} // the options prop expects an array of objects
                        getOptionLabel={(option) => option.name} // function to display option label
                        value={otherdetails.find((item) => item.id === selectValue.otherdetails) || null} // determine the selected value
                        onChange={(event, newValue) => {
                          setSelectValue({ ...selectValue, otherdetails: newValue ? newValue.id : '' });
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option) => (
                              <li {...props} key={option.id}>
                                {option.name}
                              </li>
                            )}
                        renderInput={(params) => (
                          <TextField {...params} label="Other Details" />
                        )}
                      />
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
                      getOptionLabel={(option) => `${option.assignedNo}`} // function to display option label
                      value={glclass.find((item) => item.id === selectValue.glclass) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, glclass: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.assignedNo}
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
                      getOptionLabel={(option) => `${option.shortform}`} // function to display option label
                      value={uom.find((item) => item.id === selectValue.uom) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, uom: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.shortform}
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
                      id="hsn_autocomplete"
                      options={hsn} // the options prop expects an array of objects
                      getOptionLabel={(option) => `${option.name}`} // function to display option label
                      value={hsn.find((item) => item.id === selectValue.hsn) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, hsn: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="HSN" />
                      )}
                    />
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="linetype_autocomplete"
                      options={lineType} // the options prop expects an array of objects
                      getOptionLabel={(option) => `${option.name}`} // function to display option label
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
                  
                  <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="commodity_autocomplete"
                      options={commodity} // the options prop expects an array of objects
                      getOptionLabel={(option) => `${option.name}`} // function to display option label
                      value={commodity.find((item) => item.id === selectValue.commodity) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, commodity: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Commodity Class" />
                      )}
                    />
                 <Autocomplete
                      disablePortal
                      size="small"
                      classes={{ input: 'autoComplete-text', option: 'autoComplete-text text-sm'}}
                      id="subCommodity_autocomplete"
                      options={subcommodity} // the options prop expects an array of objects
                      getOptionLabel={(option) => `${option.name}`} // function to display option label
                      value={subcommodity.find((item) => item.id === selectValue.subcommodity) || null} // determine the selected value
                      onChange={(event, newValue) => {
                        
                        setSelectValue({ ...selectValue, subcommodity: newValue ? newValue.id : '' });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                      renderInput={(params) => (
                        <TextField {...params} label="Commodity Sub Class" />
                      )}
                    />
                      <Button variant="contained" onClick={generatecode}>Generate</Button>
                 
             
              
                
              </Box>
      
        </form>
        }
    </div>
  )
}

export default NewRequisition