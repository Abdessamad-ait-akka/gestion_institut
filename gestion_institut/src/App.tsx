import React, {useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App(){

  const[userRole, setUserRole] = useState ('etudiant'); 
  
  return(
    <BrowserRouter>
    <AppRoutes userRole={userRole}/>
    </BrowserRouter>
  ); 
};

export default App;