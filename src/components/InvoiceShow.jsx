import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const InvoiceShow = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoiceRes, companyRes] = await Promise.all([
                    API.get(`/invoices/${id}`),
                    API.get("/company-settings/me"),
                ]);
                setInvoice(invoiceRes.data);
                setCompany(companyRes.data);
            } catch {
                alert("Invoice or Company data not found");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const sendEmail = async () => {
        try {
            await API.get(`/invoices/${id}/email`);
            alert("✅ Invoice email sent!");
        } catch (err) {
            alert("❌ Failed to send email");
            console.error(err);
        }
    };
    const download = async () => {
        try {
            const response = await API.get(`/invoices/${id}/download`, {
                responseType: 'blob', // Important for binary data
            });

            const file = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;

            // Optional: dynamic filename from Laravel
            const contentDisposition = response.headers['content-disposition'];
            let filename = `invoice_${id}.pdf`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            alert("✅ Download started!");
        } catch (err) {
            alert("❌ Failed to download invoice");
            console.error(err);
        }
    };

    if (loading)
        return <p className="text-center mt-6 text-gray-500">Loading...</p>;
    if (!invoice)
        return (
            <p className="text-center mt-6 text-red-600">Invoice not found.</p>
        );

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded">
            {/* Company Header */}
            {company && (
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{company.company_name}</h1>
                        <p className="text-sm text-gray-600">{company.phone}</p>
                        <p className="text-sm text-gray-600">{company.address}</p>
                    </div>
                    {company.logo_url && (
                        <img
                            src={company.logo_url}
                            alt="Company Logo"
                            className="h-12 w-auto object-contain"
                        />
                    )}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Invoice #{invoice.invoice_number}
                </h2>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="space-y-2 text-gray-700 mb-6">
                <p><strong>Client ID:</strong> {invoice.client_id}</p>
                <p><strong>Invoice Date:</strong> {invoice.invoice_date}</p>
                <p><strong>Due Date:</strong> {invoice.due_date}</p>
                <p>
                    <strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded
                        ${invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {invoice.status}
                    </span>
                </p>
            </div>

            <h4 className="text-lg font-semibold mb-2">Items</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border">Description</th>
                            <th className="px-4 py-2 border">Qty</th>
                            <th className="px-4 py-2 border">Unit ₹</th>
                            <th className="px-4 py-2 border">Total ₹</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{item.description}</td>
                                <td className="px-4 py-2 border">{item.quantity}</td>
                                <td className="px-4 py-2 border">₹{Number(item.unit_price).toFixed(2)}</td>
                                <td className="px-4 py-2 border">₹{Number(item.total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-right mt-6 space-y-1 text-gray-700">
                <p><strong>Subtotal:</strong> ₹{Number(invoice.subtotal).toFixed(2)}</p>
                <p><strong>Tax (18%):</strong> ₹{Number(invoice.tax).toFixed(2)}</p>
                <p className="text-xl font-bold"><strong>Total:</strong> ₹{Number(invoice.total).toFixed(2)}</p>
            </div>

            <div className="mt-6 text-right">
                <button
                    onClick={download}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Download
                </button>
            </div>

            <div className="mt-6 text-right">
                <button
                    onClick={sendEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    📧 Send Invoice Email
                </button>
            </div>
        </div>
    );
};

export default InvoiceShow;
