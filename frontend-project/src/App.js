import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  // Authentication & Navigation State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activePage, setActivePage] = useState('product');
  const [loginError, setLoginError] = useState('');

  // Data states
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reports, setReports] = useState([]);

  // Form States
  const [productForm, setProductForm] = useState({ productcode: '', productname: '', category: '', quantityinstock: '', unitprice: '', suppliername: '', datereceived: '', warehousecode: '' });
  const [warehouseForm, setWarehouseForm] = useState({ warehousecode: '', warehousename: '', warehouselocation: '' });
  const [txForm, setTxForm] = useState({ transactioncode: '', productcode: '', warehousecode: '', quantitymoved: '', transactiontype: 'Stock In' });
  const [isEditingTx, setIsEditingTx] = useState(false);

  // Fetch initial system configurations
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get(`${API_URL}/products`);
      const whRes = await axios.get(`${API_URL}/warehouses`);
      const txRes = await axios.get(`${API_URL}/transactions`);
      const rptRes = await axios.get(`${API_URL}/reports`);
      
      setProducts(prodRes.data);
      setWarehouses(whRes.data);
      setTransactions(txRes.data);
      setReports(rptRes.data);
    } catch (err) {
      console.error("Error loading data from API", err);
    }
  };

  // Auth Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      if (res.data.success) {
        setIsLoggedIn(true);
        setLoginError('');
      }
    } catch (err) {
      setLoginError('Invalid username or password!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Submit Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, productForm);
      alert('Product created!');
      setProductForm({ productcode: '', productname: '', category: '', quantityinstock: '', unitprice: '', suppliername: '', datereceived: '', warehousecode: '' });
      fetchData();
    } catch (err) { alert('Error creating product'); }
  };

  const handleWarehouseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/warehouses`, warehouseForm);
      alert('Warehouse added!');
      setWarehouseForm({ warehousecode: '', warehousename: '', warehouselocation: '' });
      fetchData();
    } catch (err) { alert('Error creating warehouse'); }
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingTx) {
        await axios.put(`${API_URL}/transactions/${txForm.transactioncode}`, txForm);
        alert('Transaction Updated!');
      } else {
        await axios.post(`${API_URL}/transactions`, txForm);
        alert('Transaction Executed!');
      }
      setTxForm({ transactioncode: '', productcode: '', warehousecode: '', quantitymoved: '', transactiontype: 'Stock In' });
      setIsEditingTx(false);
      fetchData();
    } catch (err) { alert('Transaction error processing action'); }
  };

  const handleTxDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await axios.delete(`${API_URL}/transactions/${id}`);
      fetchData();
    }
  };

  const startTxEdit = (tx) => {
    setTxForm(tx);
    setIsEditingTx(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">SMS Portal Login</h2>
          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition">Login</button>
          <p className="text-xs text-gray-400 mt-4 text-center">Hint: admin / admin123</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Responsive Menu Navigation Bar */}
      <nav className="bg-blue-800 text-white w-full md:w-64 p-5 flex flex-col space-y-2 md:space-y-4">
        <h1 className="text-xl font-black tracking-wider mb-4 border-b border-blue-700 pb-2">SMS DASHBOARD</h1>
        <button onClick={() => setActivePage('product')} className={`text-left p-2 rounded hover:bg-blue-700 ${activePage === 'product' ? 'bg-blue-900 font-bold' : ''}`}>Products Form</button>
        <button onClick={() => setActivePage('warehouse')} className={`text-left p-2 rounded hover:bg-blue-700 ${activePage === 'warehouse' ? 'bg-blue-900 font-bold' : ''}`}>Warehouse Form</button>
        <button onClick={() => setActivePage('transactions')} className={`text-left p-2 rounded hover:bg-blue-700 ${activePage === 'transactions' ? 'bg-blue-900 font-bold' : ''}`}>Transactions (CRUD)</button>
        <button onClick={() => setActivePage('reports')} className={`text-left p-2 rounded hover:bg-blue-700 ${activePage === 'reports' ? 'bg-blue-900 font-bold' : ''}`}>Reports Module</button>
        <button onClick={handleLogout} className="text-left p-2 rounded bg-red-600 hover:bg-red-700 font-bold mt-auto">Logout</button>
      </nav>

      {/* Main UI Views Context Panels */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* PRODUCT FORM VIEW */}
        {activePage === 'product' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Product (Insert Operational Form)</h2>
            <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Product Code" value={productForm.productcode} onChange={e => setProductForm({...productForm, productcode: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Product Name" value={productForm.productname} onChange={e => setProductForm({...productForm, productname: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Category" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="border p-2 rounded" />
              <input type="number" placeholder="Initial Quantity in Stock" value={productForm.quantityinstock} onChange={e => setProductForm({...productForm, quantityinstock: e.target.value})} className="border p-2 rounded" required />
              <input type="number" step="0.01" placeholder="Unit Price" value={productForm.unitprice} onChange={e => setProductForm({...productForm, unitprice: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Supplier Name" value={productForm.suppliername} onChange={e => setProductForm({...productForm, suppliername: e.target.value})} className="border p-2 rounded" />
              <input type="date" placeholder="Date Received" value={productForm.datereceived} onChange={e => setProductForm({...productForm, datereceived: e.target.value})} className="border p-2 rounded" required />
              <select 
                  value={productForm.warehousecode} 
                  onChange={e => setProductForm({...productForm, warehousecode: e.target.value})} 
                  className="border p-2 rounded" 
                  required
                    >
                  <option value="">Select Warehouse Link</option>
                     {/* Fallback Exam Options */}
                   <option value="WH-01">Main Warehouse (WH-01)</option>
                   <option value="WH-02">Secondary Warehouse (WH-02)</option>
  
                     {/* Dynamic Database Options */}
                     {warehouses && warehouses.map(wh => (
                   <option key={wh.warehousecode} value={wh.warehousecode}>
                     {wh.warehousename}
                 </option>
                     ))}
               </select>
              <button type="submit" className="md:col-span-2 bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700">Save Product</button>
            </form>
          </div>
        )}

        {/* WAREHOUSE FORM VIEW */}
        {activePage === 'warehouse' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Warehouse Structure</h2>
            <form onSubmit={handleWarehouseSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-xl">
              <input placeholder="Warehouse Code" value={warehouseForm.warehousecode} onChange={e => setWarehouseForm({...warehouseForm, warehousecode: e.target.value})} className="w-full border p-2 rounded" required />
              <input placeholder="Warehouse Name" value={warehouseForm.warehousename} onChange={e => setWarehouseForm({...warehouseForm, warehousename: e.target.value})} className="w-full border p-2 rounded" required />
              <input placeholder="Warehouse Location" value={warehouseForm.warehouselocation} onChange={e => setWarehouseForm({...warehouseForm, warehouselocation: e.target.value})} className="w-full border p-2 rounded" required />
              <button type="submit" className="w-full bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700">Save Warehouse</button>
            </form>
          </div>
        )}

        {/* TRANSACTIONS VIEW (FULL CRUD) */}
        {activePage === 'transactions' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">{isEditingTx ? 'Modify Transaction Data' : 'Log New Stock Transaction'}</h2>
              <form onSubmit={handleTxSubmit} className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Transaction Code" value={txForm.transactioncode} onChange={e => setTxForm({...txForm, transactioncode: e.target.value})} className="border p-2 rounded" required disabled={isEditingTx} />
                <select value={txForm.productcode} onChange={e => setTxForm({...txForm, productcode: e.target.value})} className="border p-2 rounded" required>
                  <option value="">Select Target Product</option>
                  {products.map(p => <option key={p.productcode} value={p.productcode}>{p.productname} (Current: {p.quantityinstock})</option>)}
                </select>
                <select value={txForm.warehousecode} onChange={e => setTxForm({...txForm, warehousecode: e.target.value})} className="border p-2 rounded" required>
                  <option value="">Select Target Warehouse</option>
                  {warehouses.map(wh => <option key={wh.warehousecode} value={wh.warehousecode}>{wh.warehousename}</option>)}
                </select>
                <input type="number" placeholder="Quantity Moved" value={txForm.quantitymoved} onChange={e => setTxForm({...txForm, quantitymoved: e.target.value})} className="border p-2 rounded" required />
                <select value={txForm.transactiontype} onChange={e => setTxForm({...txForm, transactiontype: e.target.value})} className="border p-2 rounded">
                  <option value="Stock In">Stock In</option>
                  <option value="Stock Out">Stock Out</option>
                </select>
                <div className="md:col-span-2 flex space-x-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">{isEditingTx ? 'Update Entry' : 'Post Transaction'}</button>
                  {isEditingTx && <button type="button" onClick={() => { setIsEditingTx(false); setTxForm({ transactioncode: '', productcode: '', warehousecode: '', quantitymoved: '', transactiontype: 'Stock In' }); }} className="bg-gray-400 text-white px-4 rounded font-bold">Cancel</button>}
                </div>
              </form>
            </div>

            {/* RETRIEVE, UPDATE, DELETE RENDERING TABLE AREA */}
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-700">Transaction History Log Records</h3>
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 font-semibold text-sm">TX Code</th>
                      <th className="p-3 font-semibold text-sm">Product</th>
                      <th className="p-3 font-semibold text-sm">Warehouse</th>
                      <th className="p-3 font-semibold text-sm">Qty Moved</th>
                      <th className="p-3 font-semibold text-sm">Type</th>
                      <th className="p-3 font-semibold text-sm text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.transactioncode} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{tx.transactioncode}</td>
                        <td className="p-3 text-sm">{tx.productcode}</td>
                        <td className="p-3 text-sm">{tx.warehousecode}</td>
                        <td className="p-3 text-sm">{tx.quantitymoved}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${tx.transactiontype === 'Stock In' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tx.transactiontype}</span>
                        </td>
                        <td className="p-3 text-sm flex justify-center space-x-2">
                          <button onClick={() => startTxEdit(tx)} className="text-blue-600 hover:underline text-xs bg-blue-50 px-2 py-1 rounded">Edit</button>
                          <button onClick={() => handleTxDelete(tx.transactioncode)} className="text-red-600 hover:underline text-xs bg-red-50 px-2 py-1 rounded">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS MODULE VIEW */}
        {activePage === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Live Inventory Metrics & Reports Breakdown</h2>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-3 text-blue-800">Current On-Hand Stock Metrics</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 text-sm font-semibold">Product Name</th>
                      <th className="p-3 text-sm font-semibold">Category</th>
                      <th className="p-3 text-sm font-semibold">Stock Quantity Remaining</th>
                      <th className="p-3 text-sm font-semibold">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.productcode} className="border-b">
                        <td className="p-3 text-sm font-medium">{p.productname}</td>
                        <td className="p-3 text-sm">{p.category}</td>
                        <td className={`p-3 text-sm font-bold ${p.quantityinstock < 5 ? 'text-red-600': 'text-gray-700'}`}>{p.quantityinstock} units</td>
                        <td className="p-3 text-sm">${p.unitprice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-3 text-blue-800">Periodic Flow Activity Log (Daily, Weekly, Monthly Aggregate Tracking)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 text-sm font-semibold">Activity Date</th>
                      <th className="p-3 text-sm font-semibold text-green-700">Total Stock Inbound Flow</th>
                      <th className="p-3 text-sm font-semibold text-red-700">Total Stock Outbound Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3 text-sm font-mono">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="p-3 text-sm font-semibold text-green-600">+{r.stock_in} units</td>
                        <td className="p-3 text-sm font-semibold text-red-600">-{r.stock_out} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;