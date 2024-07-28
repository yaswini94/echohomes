const SupplierDashboard = () => {
  return (
    <div>
      {/* Render different content based on selectedKey */}
      {selectedKey === "home" && <p>Home</p>}
      {selectedKey === "orders" && <p>Orders</p>}
      {selectedKey === "invoices" && <p>Invoices</p>}
      {/* {selectedKey === 'orders' && <ChoicesConfiguration />} */}
    </div>
  );
};
export default SupplierDashboard;
