// CustomerHeader.jsx
export default function CustomerHeader() {
    return (
      <div id="customerheader-container" className="flex items-center justify-between p-4">
        <div id="customerheader-left" className="flex flex-col">
          <span id="customer-title" className="text-3xl font-semibold">
            Customers
          </span>
          <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
            <span id="breadcrumb-home" className="text-gray-500">Home</span>
            <span id="breadcrumb-separator" className="text-gray-500">/</span>
            <span id="breadcrumb-customers" className="text-gray-500">Customers</span>
          </div>
        </div>
      </div>
    );
  }
  