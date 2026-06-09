import React, { useRef } from "react";
import { X, Printer, Download, Receipt, ArrowLeftRight } from "lucide-react";
import { ORDER_STATUS } from "../utils/constants";
import { ApiURL } from "../Variable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import logo from "../assets/logo1.png";

const InvoiceModal = ({ isOpen, onClose, order, isCreditNote = false }) => {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;

    // Create a hidden iframe for isolated print context
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Copy all style tags and link stylesheets from parent document
    let stylesHTML = "";
    document.querySelectorAll("style").forEach((styleTag) => {
      stylesHTML += styleTag.outerHTML;
    });
    document.querySelectorAll("link[rel='stylesheet']").forEach((linkTag) => {
      stylesHTML += linkTag.outerHTML;
    });

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${isCreditNote ? "CreditNote" : "Invoice"}-${order.orderId}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          ${stylesHTML}
          <style>
            @media print {
              body {
                background: white !important;
                color: black !important;
                padding: 16px !important;
                font-family: 'Inter', sans-serif !important;
              }
              .no-print {
                display: none !important;
              }
              /* Force colored background rendering, borders, and text details */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
            body {
              padding: 24px;
              font-family: 'Inter', sans-serif;
              background: white;
            }
          </style>
        </head>
        <body>
          <div class="print-shadow-none">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.parent.document.body.removeChild(window.frameElement);
                }, 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;

    try {
      // Capture the DOM node with high fidelity using html2canvas-pro's native oklch parsing
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024, // standard fixed viewport width for clean alignment
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("invoice-capture-area");
          if (clonedElement) {
            clonedElement.style.maxHeight = "none";
            clonedElement.style.overflow = "visible";
            clonedElement.style.height = "auto";
          }
        }
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Scale image width to fit page width, keeping the exact aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save(`${isCreditNote ? "CreditNote" : "Invoice"}-${order.orderId}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const subTotal = order.totalPrice || order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = order.shippingCharge || 0;
  const total = order.grandTotal || (subTotal + shipping);

  // Generate a mock invoice or credit note number
  const documentPrefix = isCreditNote ? "CN" : "INV";
  const documentNumber = `${documentPrefix}-${new Date(order.createdAt).getFullYear()}-${order.orderId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Controls Bar (Always Visible, Non-printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {isCreditNote ? (
              <div className="p-1.5 text-[#1C2F2F] rounded-lg">
                <ArrowLeftRight size={18} />
              </div>
            ) : (
              <div className="p-1.5 text-[#1C2F2F] rounded-lg">
                <Receipt size={18} />
              </div>
            )}
            <span className="font-bold text-gray-800">
              {isCreditNote ? "View Credit Note" : "View Tax Invoice"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:text-black transition cursor-pointer shadow-sm"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white border rounded-lg transition cursor-pointer shadow-sm ${isCreditNote
                ? "bg-[#1C2F2F] border-[#1C2F2F] hover:bg-[#152121] hover:border-[#152121]"
                : "bg-[#1C2F2F] border-[#1C2F2F] hover:bg-[#152121] hover:border-[#152121]"
                }`}
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable invoice container */}
        <div id="invoice-capture-area" className="max-h-[80vh] overflow-y-auto p-6" ref={invoiceRef}>
          <div className="print-shadow-none bg-white font-inter text-gray-800">

            {/* Invoice Header Branding */}
            <div className="flex flex-row justify-between items-center gap-6 border-b-2 border-gray-100 pb-8 mb-8">
              <div>
                <div>
                  <img src={logo} alt="Logo" className="w-24 h-auto" />
                </div>
                <div className="text-xs text-gray-500 mt-3 space-y-0.5">
                  <p>Kundrat Lifestyle Private Limited</p>
                  <p>123 Fashion Street, Sector 5</p>
                  <p>Mumbai, Maharashtra - 400001</p>
                  <p>GSTIN: 27AAAAA1111A1Z1</p>
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${isCreditNote ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  }`}>
                  {isCreditNote ? "Credit Note" : "Tax Invoice"}
                </div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Document No</h2>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{documentNumber}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-semibold">Date:</span> {formattedDate(order.createdAt)}
                </p>
                {isCreditNote && (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold">Original Invoice:</span> INV-{new Date(order.createdAt).getFullYear()}-{order.orderId}
                  </p>
                )}
              </div>
            </div>

            {/* Billing & Shipping Address grid */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Billed To</h3>
                <p className="font-semibold text-gray-900 text-base">
                  {order.address?.name || `${order.address?.first_name || ""} ${order.address?.last_name || ""}`.trim() || "Valued Customer"}
                </p>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  {order.address?.fullAddress ? (
                    <p>{order.address.fullAddress}</p>
                  ) : (
                    <>
                      <p>{order.address?.address}</p>
                      {order.address?.apartment && <p>{order.address.apartment}</p>}
                      <p>
                        {order.address?.city && `${order.address.city}, `}
                        {order.address?.state}
                        {order.address?.zip_code && ` - ${order.address.zip_code}`}
                      </p>
                    </>
                  )}
                  <p className="pt-2 font-medium">Phone: <span className="text-gray-900">{order.address?.phone || order.address?.phone_number || "N/A"}</span></p>
                  {order.address?.email && order.address.email !== "N/A" && (
                    <p className="font-medium">Email: <span className="text-gray-900">{order.address.email}</span></p>
                  )}
                </div>
              </div>

              <div className="border-l border-gray-100 pl-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Order Number:</span>
                    <span className="font-bold text-gray-900">#{order.orderId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Order Date:</span>
                    <span className="font-bold text-gray-900">{formattedDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">Payment Status:</span>
                    <span className="font-bold text-gray-900 capitalize">{order.paymentStatus || "Paid"}</span>
                  </div>
                  {isCreditNote && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Reason:</span>
                      <span className="font-bold text-rose-600">{order.status === ORDER_STATUS.CANCELLED ? "Order Cancellation" : "Order Returned"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                    <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Qty</th>
                    <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Price</th>
                    <th className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.orderItems?.map((item) => (
                    <tr key={item.orderItemId} className="align-top">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-gray-900 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          Color: {item.color_name || "N/A"} {item.size && ` | Size: ${item.size}`}
                        </p>
                      </td>
                      <td className="py-4 text-center text-sm font-semibold text-gray-900">{item.quantity}</td>
                      <td className="py-4 text-right text-sm font-semibold text-gray-900">₹{Math.round(item.price || (item.totalAmount / item.quantity))}</td>
                      <td className="py-4 text-right text-sm font-bold text-gray-900">₹{Math.round(item.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Financial summary calculation */}
            <div className="flex flex-row justify-between items-start gap-8 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 max-w-sm">
                <p className="font-bold text-gray-700 uppercase tracking-wider mb-2">Terms & Notes</p>
                {isCreditNote ? (
                  <p>This is a Credit Note processed for cancellation/refund corresponding to the mentioned order. The amount has been credited back to your original source payment method or processed as store credits.</p>
                ) : (
                  <p>This is a computer-generated tax invoice. All items are inclusive of applicable IGST/CGST/SGST. Subject to Mumbai Jurisdiction.</p>
                )}
              </div>

              <div className="w-80 space-y-3 font-semibold text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{Math.round(subTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping & Handling</span>
                  <span className="text-gray-900">₹{Math.round(shipping)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base font-semibold border-gray-200 text-[#004534]">
                  <span>{isCreditNote ? "Total Refunded Amount" : "Grand Total"}</span>
                  <span className="text-lg font-bold">₹{Math.round(total)}</span>
                </div>
              </div>
            </div>

            {/* Signature Area (Useful when printing / PDF saving) */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <div>
                <p>Support Team: support@kundrat.com</p>
                <p>Website: www.kundrat.com</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-700 mb-6">Authorized Signatory</p>
                <div className="h-0.5 w-32 bg-gray-300 ml-auto"></div>
                <p className="mt-1 text-gray-400">Kundrat Lifestyle Pvt Ltd</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
