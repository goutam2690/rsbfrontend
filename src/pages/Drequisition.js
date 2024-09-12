
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FaPlus } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

function Drequisition() {
    const [value, setValue] = React.useState("1");
    const [open, setOpen] = React.useState(false);

    
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  return (
    <div className='w-full h-full p-2'>
       
        <div className='w-full border-2 p-2'>
       
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Requisition" value="1" />
                    <Tab label="Pending" value="2" />
                    <Tab label="Approved" value="3" />
                    <Tab label="Push" value="4" />
                </TabList>
                </Box>
                <TabPanel value="1">
                <div className='flex flex-col gap-2'>
                    <div className="heading border-b-2 py-2 ">
                    <Tooltip title="New Requisition">
                        <Button className='' variant="outlined" onClick={()=>setOpen(!open)}>
                        <FaPlus /></Button>
                 
                    </Tooltip>    
                    </div>
                    <div className="body">
                   
                    <Drawer  anchor="right" open={open} onClose={()=>setOpen(!open)}>
                    <Box sx={{ width: 450 }} role="presentation">
                       <div className='w-full flex  items-center flex-col gap-2  p-2'>
                        <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={top100Films}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Item Category" />}
                                />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Item Category" />}
                            />
                        </div>
                        <Divider />
                        </Box>
                    </Drawer>
                    </div>
                </div>
                </TabPanel>
                <TabPanel value="2">Pending Requisition</TabPanel>
                <TabPanel value="3">Approved Requisition</TabPanel>
                <TabPanel value="4">Push the Requisiton to JD</TabPanel>
            </TabContext>
            </Box>
        </div>
    </div>
  )
}

export default Drequisition