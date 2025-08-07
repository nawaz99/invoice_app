import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [isCounting, setIsCounting] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        API.get("/invoices")
            .then((res) => setInvoices(res.data))
            .catch((err) => console.error("Error loading invoices:", err));

    }, []);


    const updateInvoiceStatus = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;

        try {
            await API.patch(`/invoices/${id}/status`, { status: newStatus });
            //  Refresh invoice list
            setInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === id ? { ...inv, status: newStatus } : inv
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };



    return (
        <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Invoices</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border">Invoice #</th>
                            <th className="px-4 py-2 border">Client ID</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Due</th>
                            <th className="px-4 py-2 border">Total</th>
                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr
                                key={inv.id}
                                className="hover:bg-gray-50 transition-colors"
                            >

                                <td className="px-4 py-2 border text-blue-600">
                                    <Link
                                        to={`/invoices/${inv.id}`}
                                        className="hover:underline"
                                    >
                                        {inv.invoice_number}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 border">
                                    {inv.client_id}
                                </td>
                                <td className="px-4 py-2 border">
                                    {inv.invoice_date}
                                </td>
                                <td className="px-4 py-2 border">
                                    {inv.due_date}
                                </td>
                                <td className="px-4 py-2 border">
                                    ₹{Number(inv.total).toFixed(2)}
                                </td>
                                <td className="px-4 py-2 border">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${inv.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : inv.status === "overdue"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {inv.status}
                                    </span>

                                    {/* Actions */}
                                    {inv.status !== "paid" && (
                                        <button
                                            className="ml-2 text-green-600 hover:underline"
                                            onClick={() => updateInvoiceStatus(inv.id, "paid")}
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                    {inv.status !== "overdue" && (
                                        <button
                                            className="ml-2 text-red-600 hover:underline"
                                            onClick={() => updateInvoiceStatus(inv.id, "overdue")}
                                        >
                                            Mark Overdue
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center text-gray-500 py-4"
                                >
                                    No invoices found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default InvoiceList;
