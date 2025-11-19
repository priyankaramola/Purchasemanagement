import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useRef } from "react";
import PropTypes from "prop-types";
/**
 * Props:
 * - isOpen, onClose
 * - po: optional default PO object
 * - onGenerate: callback(res) called after successful create (or when parent handles submit)
 * - submitToApi: boolean (default true) -> modal will call API itself
 * - apiEndpoint: optional override for create GRN endpoint
 */
const GenerateGrnModal = ({
  isOpen,
  onClose,
  po = {},
  onGenerate,
  submitToApi = true,
  apiEndpoint = "http://13.204.15.86:3002/purchase/supplier_grn/create_grn",
  onSuccess,
}) => {
  const items = po.indenting_items || po.items || [];
  const [selectedPo, setSelectedPo] = useState(po?.po_id ? { value: po.po_id, label: po.po_id } : null);
  const [rows, setRows] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [otherFile, setOtherFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("Full GRN");
  const [error, setError] = useState("");
  const [documentOptions, setDocumentOptions] = useState([]);
      const token = sessionStorage.getItem("token");
const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (isOpen) {
      setRows(
        (po.indenting_items || po.items || []).map((it) => ({
          ...it,
          qc: false,
          receiving: false,
          unitPrice: it.unitPrice ?? it.unit_price ?? 0,
        }))
      );
      setCurrentDate("");
      setDeliveryDate("");
      setInvoiceFile(null);
      setOtherFile(null);
      setError("");
      setStatus("Full GRN");
      setSelectedPo(po?.po_id ? { value: po.po_id, label: po.po_id } : null);
    }
  }, [isOpen, po]);

  // Fetch PO options if you need (parent can provide PO via props instead)
useEffect(() => {
  let mounted = true;
  const url = "http://13.204.15.86:3002/purchase/supplier_po/received_po_data";

  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (!mounted) return;
      const list = (res.data?.data || []).map((item) => ({
        value: item.po_id,
        label: item.po_id,
      }));
      setOptions(list);
    })
    .catch((error) => {
      console.error("Error fetching PO data:", error);
      // silent fail — options remain empty; parent can pass po prop
    });

  return () => {
    mounted = false;
  };
}, [token]);
const lastFetchedRef = useRef(null);

useEffect(() => {
  let mounted = true;
  const controller = new AbortController();
  let timer = null;

  const fetchPoDetails = async (poId) => {
    try {
      setError("");
      const url = `http://13.204.15.86:3002/purchase/supplier_grn/quotation_data/${poId}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      if (!mounted) return;

      const payload = res.data || {};
      const record = Array.isArray(payload.data) ? payload.data[0] : payload.data;

      // mark fetched id so repeated identical requests are skipped
      lastFetchedRef.current = poId;

      if (payload.po_id) {
        setSelectedPo({ value: payload.po_id, label: payload.po_id });
      }

      if (record) {
        const itemsArr =
          record.indenting_items ||
          record.items ||
          (record.asset_name ? [record] : []) ||
          [];
        setRows(
          itemsArr.map((it) => ({
            asset_name: it.asset_name || it.name || "",
            quantity: it.quantity ?? it.qty ?? "",
            unitPrice: it.unit_price ?? it.unitPrice ?? 0,
            uom: it.uom || it.unit || "",
            description: it.description || record.description || "",
            qc: false,
            receiving: false,
          }))
        );

        setCurrentDate(
          record.quotation_date ? record.quotation_date.slice(0, 10) : new Date().toISOString().slice(0, 10)
        );
        if (record.delivery_date) setDeliveryDate(record.delivery_date.slice(0, 10));

        const reqDocObj = record.required_doc || payload.required_doc || {};
        if (reqDocObj && typeof reqDocObj === "object") {
          const docs = Object.keys(reqDocObj).map((k) => ({ label: k, value: reqDocObj[k] }));
          setDocumentOptions(docs);
        } else {
          setDocumentOptions([]);
        }
      }
    } catch (err) {
      if (!mounted) return;
      if (axios.isCancel?.(err)) return;
      console.error("Failed to fetch PO details:", err);
      setError("Failed to load PO details");
    }
  };

  const poId = selectedPo?.value;
  if (isOpen && poId && lastFetchedRef.current !== poId) {
    // debounce small interval to avoid rapid duplicate calls
    timer = setTimeout(() => fetchPoDetails(poId), 200);
  }

  return () => {
    mounted = false;
    if (timer) clearTimeout(timer);
    controller.abort();
  };
}, [isOpen, selectedPo?.value, token]);

  if (!isOpen) return null;

  const handleToggle = (index, key) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: !r[key] } : r)));
  };

  const buildPayload = () => {
    const payload = {
      po_id: selectedPo?.value || po?.po_id || "",
      generated_date: currentDate,
      delivery_date: deliveryDate,
      status,
      // backend accepts invoice/documents as links or files; when sending files we use FormData
      invoice: "",
      documents: "",
    };

    return payload;
  };

 const handleGenerate = async () => {
  setError("");
  setLoading(true);

  try {
    const payload = buildPayload();
    const apiEndpoint =
      "http://13.204.15.86:3002/purchase/supplier_grn/create_grn";
    const token = sessionStorage.getItem("token");

    // If parent handles submission externally
    if (!submitToApi && typeof onGenerate === "function") {
      onGenerate({ ...payload, invoiceFile, otherFile, items: rows });
      onClose();
      setLoading(false);
      return;
    }

    const hasFiles = invoiceFile instanceof File || otherFile instanceof File;
    let res;

    if (hasFiles) {
      // If there are attached files, send FormData
      const fd = new FormData();
      fd.append("po_id", payload.po_id);
      fd.append("generated_date", payload.generated_date);
      fd.append("delivery_date", payload.delivery_date);
      fd.append("status", payload.status || "Full GRN");
      if (invoiceFile) fd.append("invoice", invoiceFile);
      if (otherFile) fd.append("documents", otherFile);

      res = await axios.post(apiEndpoint, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          // No Content-Type here — browser sets it automatically
        },
      });
    } else {
      // No file → send JSON payload
      const body = {
        po_id: payload.po_id,
        generated_date: payload.generated_date,
        delivery_date: payload.delivery_date,
        invoice: payload.invoice || "",
        documents: payload.documents || "",
        status: payload.status || "Full GRN",
      };

      res = await axios.post(apiEndpoint, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    // ✅ Handle success or error response
    if (res?.data?.success) {
        setModal({
          isOpen: true,
          type: "success",
          title: "Success!",
          message: "GRN created successfully!",
        });
        
        // ✅ Call parent callback to refresh table
        if (typeof onSuccess === "function") {
          onSuccess();
        }
        
        onGenerate?.(res.data);
      } else {
        setError(res?.data?.message || "Failed to create GRN");
        setModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: res?.data?.message || "Failed to create GRN",
        });
      }
    } catch (err) {
      console.error("Error while creating GRN:", err);
      const errorMsg = err?.response?.data?.message || "Network error while creating GRN";
      setError(errorMsg);
        setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleModalClose = () => {
  //   setModal({ ...modal, isOpen: false });
  //   if (modal.type === "success") {
  //     onClose(); // Close GenerateGrnModal after success
  //   }
  // };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4" aria-modal="true">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-6 py-3 bg-blue-600 text-white">
          <h3 className="text-lg font-semibold">Generate GRN</h3>
          <button onClick={onClose} className="rounded-full p-1 bg-blue-700 hover:bg-blue-800" aria-label="Close">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PO ID</label>
            <div className="mt-1">
              <Select
                value={selectedPo}
                onChange={(selected) => setSelectedPo(selected)}
                options={options}
                placeholder={po?.po_id ? po.po_id : "Search"}
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db",
                    borderRadius: "0.375rem",
                    minHeight: "38px",
                    boxShadow: "none",
                  }),
                }}
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Material Details</div>
            <div className="bg-gray-50 rounded-md p-2 overflow-auto max-h-48">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-200 text-gray-600 text-xs">
                    <th className="px-3 py-2">Material Name</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Unit Price</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2"></th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2">{r.asset_name || r.name || "-"}</td>
                      <td className="px-3 py-2">{r.uom || r.unit || "-"}</td>
                      <td className="px-3 py-2">₹{Number(r.unitPrice).toLocaleString()}</td>
                      <td className="px-3 py-2">₹{(Number(r.unitPrice || 0) * Number(r.quantity || 0)).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={r.qc} onChange={() => handleToggle(idx, "qc")} />
                       { } QC
                      </td>
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={r.receiving} onChange={() => handleToggle(idx, "receiving")} />
                     { }   Receiving Status 
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Date</label>
              <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Invoice</label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)} className="mt-1" />
              {invoiceFile && <div className="text-xs mt-1 text-blue-600">{invoiceFile.name}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload other document</label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setOtherFile(e.target.files?.[0] || null)} className="mt-1" />
              {otherFile && <div className="text-xs mt-1 text-blue-600">{otherFile.name}</div>}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-left gap-4 mt-2">
            <button onClick={handleGenerate} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Generating..." : "Generate"}
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-800 px-6 py-2 rounded hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateGrnModal;