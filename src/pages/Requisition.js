import React from 'react'
import RequitionList from './RequitionList'
import { Box, Button, Drawer } from '@mui/material'
import NewRequisition from './NewRequisition'

function Requisition() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <div className='w-full h-full p-2'>
        <div className='w-full border-2 m-2 p-2'>
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <Button variant="contained" onClick={toggleDrawer(true)}>New</Button>
            <div className=' mt-2'>
            <RequitionList />
            </div>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} sx={{
        '& .MuiDrawer-paper': {
          width: 400, // Increase the width here
        },
      }}>
            <NewRequisition />
            </Drawer>
            </Box>
        </div>
    </div>
  )
}

export default Requisition