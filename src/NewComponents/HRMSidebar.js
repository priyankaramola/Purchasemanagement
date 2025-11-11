import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaFile,
  FaProjectDiagram,
  FaTh,
  FaUserCog,
  FaCog,
  FaTimes,
  FaTachometerAlt,
} from "react-icons/fa";
import logo from "../assests/Logo.png";
import API from "../config/api";
import SoftTrails from "../assests/SoftTrails.png";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [loading, setLoading] = useState();
  const [hasAMSAccessASM, setHasAMSAccessASM] = useState(false);
  const [hasAMSAccessUCS, setHasAMSAccessUCS] = useState(false);
  const [hasAMSAccessPrivilege, setHasAMSAccessPrivilege] = useState(false);
  const [hasAMSAccessApprovals, setHasAMSAccessApprovals] = useState(false);
  const [hasAMSAccessLogs, setHasAMSAccessLogs] = useState(false);
  const [hasAMSAccessAsset, setHasAMSAccessAsset] = useState(false);
  const [hasAMSAccessCategory, setHasAMSAccessCategory] = useState(false);
  const [hasAMSAccessValuation, setHasAMSAccessValuation] = useState(false);
  const [hasAMSAccessWorkflow, setHasAMSAccessWorkflow] = useState(false);
  const [hasAMSAccessPurchase, setHasAMSAccessPurchase] = useState(false);
  const [hasAMSAccessLogsAccess, setHasAMSAccessLogsAccess] = useState(false);
  const [hasAMSAccessBudget, setHasAMSAccessBudget] = useState(false);
  const [hasAMSAccessDMS, setHasAMSAccessDMS] = useState(false);
  const userId = sessionStorage.getItem("userId");

  const [isAssetOpen, setIsAssetOpen] = useState(
    location.pathname.includes("/AllTab") ||
      location.pathname.includes("/RepoAllTab") ||
      location.pathname.includes("/CategoryTab") ||
      location.pathname.includes("/AddRequirement") ||
      location.pathname.includes("/Depreciation") ||
      location.pathname.includes("/Workflow") ||
      location.pathname.includes("/AssetHistory") ||
      location.pathname.includes("/Reports")
  );
  const [isProcessOpen, setIsProcessOpen] = useState(
    location.pathname.includes("/Project") ||
      location.pathname.includes("/AllocationRequest") ||
      location.pathname.includes("/ProjectApproval")
  );
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(
    location.pathname.includes("/PurchaseModule") ||
      location.pathname.includes("/PurchaseApproval") ||
      location.pathname.includes("/PurchaseProcess") ||
      location.pathname.includes("/PurchaseWorkflow") ||
      location.pathname.includes("/VendorManagement")
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    location.pathname.includes(`/employeelayout/${userId}`) ||
      location.pathname.includes("/change")
  );
  const [isDmsOpen, setIsDmsOpen] = useState(
    location.pathname.includes("/dms")
  );
  const toggleAssetMenu = () => {
    setIsAssetOpen((prevState) => !prevState);
  };
  const toggleProcessMenu = () => {
    setIsProcessOpen((prevState) => !prevState);
  };
  const toggleDmsMenu = () => {
    setIsDmsOpen((prevState) => !prevState);
  };
  const togglePurchaseMenu = () => {
    setIsPurchaseOpen((prevState) => !prevState);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen((prevState) => !prevState);
  };

  const hasFetchedRef = useRef(false);

  const checkAMSAccess = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    setLoading(true);
    try {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (!userId || !token) {
        console.error("userId or token is missing");
        return;
      }

      const response = await axios.get(
        `${API.API_BASE}/access/access/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userAccess = response.data;
      const hasAccess = {
        ASM: "ASM",
        UCS: "UCS",
        HRMS: "HRMS",
        CRM: "CRM",
        ORG: "ORG",
        UMC: "UMC",
        LMC: "LMC",
        DMS: "DMS",
        update_access: "update_access",
        Approvals: "Approvals",
        Logs: "Logs",
        RepoAllTab: "RepoAllTab",
        Category: "Category",
        Valuation: "Valuation",
        Workflow: "Workflow",
        purchase_module: "purchase_module",
        doc_management: "doc_management",
        Budget: "Budget",
        LogsAccess: "LogsAccess",
        HR: "HR",
        TalentDatabase: "TalentDatabase",
        AttendanceTab: "AttendanceTab",
        PMS: "PMS",
      };
      setHasAMSAccessASM(
        userAccess.some((access) => access.api_name === hasAccess.ASM)
      );
      setHasAMSAccessUCS(
        userAccess.some((access) => access.api_name === hasAccess.UCS)
      );
      setHasAMSAccessPrivilege(
        userAccess.some((access) => access.api_name === hasAccess.update_access)
      );
      setHasAMSAccessApprovals(
        userAccess.some((access) => access.api_name === hasAccess.Approvals)
      );
      setHasAMSAccessLogs(
        userAccess.some((access) => access.api_name === hasAccess.Logs)
      );
      setHasAMSAccessAsset(
        userAccess.some((access) => access.api_name === hasAccess.RepoAllTab)
      );
      setHasAMSAccessCategory(
        userAccess.some((access) => access.api_name === hasAccess.Category)
      );
      setHasAMSAccessValuation(
        userAccess.some((access) => access.api_name === hasAccess.Valuation)
      );
      setHasAMSAccessWorkflow(
        userAccess.some((access) => access.api_name === hasAccess.Workflow)
      );
      setHasAMSAccessPurchase(
        userAccess.some(
          (access) => access.api_name === hasAccess.purchase_module
        )
      );
      setHasAMSAccessBudget(
        userAccess.some((access) => access.api_name === hasAccess.Budget)
      );
      setHasAMSAccessLogsAccess(
        userAccess.some((access) => access.api_name === hasAccess.LogsAccess)
      );
      setHasAMSAccessDMS(
        userAccess.some(
          (access) => access.api_name === hasAccess.doc_management
        )
      );
    } catch (error) {
      console.error("Error occurred during API call: ", error);
      if (error.response) {
        console.error("API Response error:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("No response received from API:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setHasAMSAccessASM(false);
      setHasAMSAccessDMS(false);
      setHasAMSAccessUCS(false);
      setHasAMSAccessPrivilege(false);
      setHasAMSAccessApprovals(false);
      setHasAMSAccessLogs(false);
      setHasAMSAccessAsset(false);
      setHasAMSAccessCategory(false);
      setHasAMSAccessValuation(false);
      setHasAMSAccessWorkflow(false);
      setHasAMSAccessPurchase(false);
      setHasAMSAccessBudget(false);
      setHasAMSAccessLogsAccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAMSAccess();
  }, [checkAMSAccess]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 left-0 h-full w-64 bg-white border p-5 rounded-r-lg flex flex-col text-[14px] z-30
    transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
    transition-transform duration-300 ease-in-out
    lg:static lg:translate-x-0 lg:w-[15%] lg:rounded-lg
  `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 lg:hidden"
        >
          <FaTimes size={20} />
        </button>

        {/* Logo */}
        <div className="border-b border-gray-300 pb-4 mb-4 flex justify-center">
          <img src={logo} alt="Logo" className="w-28" />
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-hide pr-2">
          <ul className="list-none p-0">
            {/* ASM Menu Item */}
            {/* {hasAMSAccessASM && (
              <li className="mt-1">
                <div
                  onClick={toggleAssetMenu}
                  className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {" "}
                  <FaUser className="mr-2" /> Asset Management{" "}
                </div>
                {isAssetOpen && (
                  <ul className="ml-4">
                    <li className="mt-3">
                      <Link
                        to="/Reports"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/Reports"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        <FaTachometerAlt className="mr-2" />
                        Dashboard
                      </Link>
                    </li>
                    {hasAMSAccessApprovals && (
                      <li className="mt-3">
                        <Link
                          to="/AllTab"
                          className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                            location.pathname === "/AllTab"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          <FaUserCog className="mr-2" /> Approvals
                        </Link>
                      </li>
                    )}
                  
                    {hasAMSAccessAsset && (
                      <li className="mt-3">
                        {" "}
                        <Link
                          to="/RepoAllTab"
                          className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                            location.pathname === "/RepoAllTab"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          <FaTh className="mr-2" /> Asset{" "}
                        </Link>{" "}
                      </li>
                    )}
                    {hasAMSAccessCategory && (
                      <li className="mt-3">
                        {" "}
                        <Link
                          to="/CategoryTab"
                          className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                            location.pathname === "/CategoryTab"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {" "}
                          <FaClipboardList className="mr-2" /> Asset Category{" "}
                        </Link>{" "}
                      </li>
                    )}
                    {hasAMSAccessValuation && (
                      <li className="mt-3">
                        <Link
                          to="/Depreciation"
                          className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                            location.pathname === "/Depreciation"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          <FaUserCog className="mr-2" />
                          Asset Valuation
                        </Link>
                      </li>
                    )}
                    {hasAMSAccessWorkflow && (
                      <li className="mt-3">
                        <Link
                          to="/Workflow"
                          className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                            location.pathname === "/Workflow"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          <FaProjectDiagram className="mr-2" />
                          Approval Workflow
                        </Link>
                      </li>
                    )}
                    <li className="mt-3">
                      <Link
                        to="/AssetHistory"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/AssetHistory"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        <FaProjectDiagram className="mr-2" />
                        Asset History
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )} */}
            {/*Document Management System */}
            {/* {hasAMSAccessDMS && (
              <li className="mt-1">
                <div
                  onClick={toggleDmsMenu}
                  className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FaFile className="mr-2" /> DMS
                </div>
                {isDmsOpen && (
                  <ul className="ml-4">
                    <li className="mt-1">
                      <Link
                        to="/dms/setup"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/dms/setup"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        <FaCog className="mr-2" /> DMS Setup
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link
                        to="/dms/upload"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/dms/upload"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        <FaFile className="mr-2" /> File Upload
                      </Link>
                    </li>
                    <li className="mt-1">
                      <Link
                        to="/dms/approval"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/dms/approval"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        <FaClipboardList className="mr-2" /> Approval
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )} */}
            {/* Project */}
            {/* <li className="mt-1">
              <div
                onClick={toggleProcessMenu}
                className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
              >
                <FaUser className="mr-2" /> Product Assembly Line
              </div>
              {isProcessOpen && (
                <ul className="ml-4">
                  <li className="mt-3">
                    <Link
                      to="/Project"
                      className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                        location.pathname === "/Project"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <FaUserCog className="mr-2" /> Project
                    </Link>
                  </li>
                  <li className="mt-3">
                    <Link
                      to="/AllocationRequest"
                      className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                        location.pathname === "/AllocationRequest"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <FaProjectDiagram className="mr-2" />
                      Allocation
                    </Link>
                  </li>
                  <li className="mt-3">
                    <Link
                      to="/Processtab"
                      className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                        location.pathname === "/Processtab"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <FaUser className="mr-2" />
                      Approvals
                    </Link>
                  </li>
                  <li className="mt-3">
                    <Link
                      to="/ProjectEstimation"
                      className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                        location.pathname === "/ProjectEstimation"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <FaUser className="mr-2" />
                      Production Estimation
                    </Link>
                  </li>
                  <li className="mt-3">
                    <Link
                      to="/ProductionOutput"
                      className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                        location.pathname === "/ProductionOutput"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      <FaProjectDiagram className="mr-2" />
                      Production Output
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}
            {/*UCS */}
            {/* {hasAMSAccessUCS && (
              <li className="mt-1">
                {" "}
                <Link
                  to="/AllTabs"
                  className={`flex items-center p-2 text-black rounded transition-colors ${
                    location.pathname === "/AllTabs"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {" "}
                  <FaUser className="mr-2" /> Communication Service{" "}
                </Link>
              </li>
            )} */}
            {/* PURCHASE MODULE */}
            {hasAMSAccessPurchase && (
              <li className="mt-1">
                <div
                  onClick={togglePurchaseMenu}
                  className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {" "}
                  <FaUser className="mr-2" /> Purchase Module{" "}
                </div>
                {isPurchaseOpen && (
                  <ul className="ml-4">
                    <li className="mt-3">
                      <Link
                        to="/PurchaseModule"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/PurchaseModule"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        <FaUserCog className="mr-2" /> Indent
                      </Link>
                    </li>
                    <li className="mt-3">
                      <Link
                        to="/PurchaseApproval"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/PurchaseApproval"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {" "}
                        <FaUserCog className="mr-2" /> Approval{" "}
                      </Link>
                    </li>
                    <li className="mt-3">
                      <Link
                        to="/PurchaseWorkflow"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/PurchaseWorkflow"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {" "}
                        <FaTh className="mr-2" /> Purchase Workflow{" "}
                      </Link>
                    </li>
                    <li className="mt-3">
                      <Link
                        to="/PurchaseProcess"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/PurchaseProcess"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {" "}
                        <FaTh className="mr-2" /> Purchase Process{" "}
                      </Link>
                    </li>
                    <li className="mt-3">
                      <Link
                        to="/VendorManagement"
                        className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                          location.pathname === "/VendorManagement"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {" "}
                        <FaTh className="mr-2" /> Vendor Management{" "}
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}
            {/* Financial Module */}
            {hasAMSAccessBudget && (
              <li className="mt-1">
                {" "}
                <Link
                  to="/FinancialBudget"
                  className={`flex items-center p-2 text-black rounded transition-colors ${
                    location.pathname === "/FinancialBudget"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {" "}
                  <FaUser className="mr-2" /> Financial Budget{" "}
                </Link>{" "}
              </li>
            )}
            {/* Settings */}
            <li className="mt-1">
              <div
                onClick={toggleSettingsMenu}
                className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
              >
                {" "}
                <FaCog className="mr-2" /> Settings{" "}
              </div>
              {isSettingsOpen && (
                <ul className="ml-4">
                  <li className="mt-3">
                    <Link
                      to={`/employeelayout/${userId}`}
                      className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${
                        location.pathname === `/employeelayout/${userId}`
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {" "}
                      <FaUser className="mr-2" /> Profile{" "}
                    </Link>
                  </li>
                  {/* <li className="mt-3">
                                <Link
                                    to="/ChangePassword"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${location.pathname === '/ChangePassword' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaKey className="mr-2" /> Change Password
                                </Link>
                            </li> */}
                </ul>
              )}
            </li>
          </ul>
        </div>
        {/* Footer */}
        <div className="mt-auto flex flex-col items-center text-center border-t border-gray-300">
          <p className="text-sm text-gray-500 mt-5">Powered by</p>
          <img src={SoftTrails} alt="SoftTrails Logo" className="w-28 mb-2" />
        </div>
      </div>
    </>
  );
};
export default Sidebar;
