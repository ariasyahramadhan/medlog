// OrderHeader.jsx
export default function OrderHeader() {
    return (
      <div id="orderheader-container" className="flex items-center justify-between p-4">
        <div id="orderheader-left" className="flex flex-col">
          <span id="order-title" className="text-3xl font-semibold">
            Orders
          </span>
          <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2">
            <span id="breadcrumb-home" className="text-gray-500">Home</span>
            <span id="breadcrumb-separator" className="text-gray-500">/</span>
            <span id="breadcrumb-orders" className="text-gray-500">Orders</span>
          </div>
        </div>
        {/* Optional: You can add buttons like "Add Order" or any action */}
      </div>
    );
  }
  