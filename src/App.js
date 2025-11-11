// MainLayout.js
import MainLayout from "./MainLayout"; // import your layout
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import Components and Pages
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import UserLogin from "./Pages/UserLogin";
import Cards from "./Cards";
import Verify from "./Pages/Verify";
import Password from "./Pages/Password";
import SuperLogin from "./Pages/SuperLogin";
import NewPassword from "./Components/NewPassword";
import ChangePassword from "./Components/ChangePassword";
import LogsPage from "./Logs/LogsPage";
import ProfilePart from "./ProfilePart";

//Employee Data


//Purchase module
import PurchaseModule from "./PurchaseModule/PurchaseModule";
import RaiseRequest from "./PurchaseModule/PurchaseModule";
import AllRequest from "./PurchaseModule/AllRequest";
import FinancialBudget from "./PurchaseModule/FinancialBudget";
import PurchaseApproval from "./PurchaseModule/Approvals";
import PurchaseWorkflow from "./PurchaseModule/PurchaseWorkflow";
import IndentApprovals from "./PurchaseModule/IndentApprovals";
import PopupModal from "./PurchaseModule/PopupModal";

import VendorManagement from "./PurchaseModule/VendorManagement";
import PurchaseProcess from "./PurchaseModule/PurchaseProcess";
import InventryIndenting from "./PurchaseModule/InventryIndenting";
import QuotationView from "./PurchaseModule/rfpTabs/QuotationView";

function App({ employeeId, userId }) {
  const appRouter = createBrowserRouter([
    //***********************With no HEader *************** */
    { path: "/", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/user-login", element: <UserLogin /> },
    { path: "/password", element: <Password /> },
    { path: "/verify", element: <Verify /> },
    { path: "/super-login", element: <SuperLogin /> },
    { path: "/new-password", element: <NewPassword /> },
    { path: "profile-part", element: <ProfilePart /> },
    { path: "change-password", element: <ChangePassword /> },
    { path: "/cards", element: <Cards /> },
  
    //***********************  WITH HEADER  *********************/
    {
      path: "/",
      element: <MainLayout />,
      children: [
      
        //3.......Financial Budget
        { path: "/FinancialBudget", element: <FinancialBudget /> },

        //5................LogsPage
        { path: "logspage", element: <LogsPage /> },
        //6...........Settings------ Profile
        // { path: "employeelayout/:employeeId", element: <EmployeeLayout /> },
        //7...........Communication Service
        //8.1.............Organization Setup
    
        //2..............Purchase Module
        { path: "/PurchaseModule", element: <PurchaseModule /> },
        { path: "/RaiseRequest", element: <RaiseRequest /> },
        { path: "/AllRequest", element: <AllRequest /> },
        { path: "/PurchaseApproval", element: <PurchaseApproval /> },
        { path: "/PurchaseWorkflow", element: <PurchaseWorkflow /> },
        { path: "/VendorManagement", element: <VendorManagement /> },
        { path: "/InventryIndenting", element: <InventryIndenting /> },
  { path: "/quotation/:quotationId", element: <QuotationView /> },
        { path: "/PopupModal", element: <PopupModal /> },

        // 14 ...........................Purchase
        { path: "/PurchaseProcess", element: <PurchaseProcess /> },
      ],
    },
  ]);
  return <RouterProvider router={appRouter} />;
}
export default App;
