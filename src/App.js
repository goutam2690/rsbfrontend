import React from 'react';

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Setting from './pages/Setting';
import SideBar from './component/SideBar';
import Drequisition from './pages/Drequisition';
import ItemCategory from './pages/ItemCategory';
import Moc from './pages/Moc';
import Family from './pages/Family';
import Process from './pages/Process';
import Stages from './pages/Stages';
import SupplyType from './pages/SupplyType';
import ItemTypes from './pages/ItemTypes';
import Dimension from './pages/Dimension';
import StockingType from './pages/StockingType';
import GlClass from './pages/GlClass';
import LineType from './pages/LineType';
import Uom from './pages/Uom';
import Scm from './pages/Scm';
import CommodityClass from './pages/CommodityClass';
import Requisition from './pages/Requisition';
import SubType from './pages/SubType';
import ApproveRqList from './pages/ApproveRqList';
import RequitionList from './pages/RequitionList';
import Report from './pages/Report';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';


function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
              <SideBar>
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="drequisition" element={<Drequisition />} />
                  <Route path="settings" element={<Setting />} />
                  <Route path="Category" element={<ItemCategory />} />
                  <Route path="moc" element={<Moc />} />
                  <Route path="family" element={<Family />} />
                  <Route path="types" element={<ItemTypes />} />
                  <Route path="process" element={<Process />} />
                  <Route path="stage" element={<Stages />} />
                  <Route path="supplytype" element={<SupplyType />} />
                  <Route path="dimension" element={<Dimension />} />
                  <Route path="stockingtype" element={<StockingType />} />
                  <Route path="linetype" element={<LineType />} />
                  <Route path="uom" element={<Uom />} />
                  <Route path="glclass" element={<GlClass />} />
                  <Route path="cmc" element={<CommodityClass />} />
                  <Route path="scm" element={<Scm />} />
                  <Route path="subtype" element={<SubType />} />
                  <Route path="rqlist" element={<RequitionList />} />
                  <Route path="report" element={<Report />} />
                  <Route path="requisition" element={<Requisition />} />
                </Routes>
                </SideBar>
              </ProtectedRoute>
            } 
          />
       
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
