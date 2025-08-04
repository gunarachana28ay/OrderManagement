import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

const stitchingOptions = ['Simple', 'Fancy', 'Deluxe'];
const workOptions = ['Embroidery', 'Print', 'Plain'];

const getMonthStrings = () => {
  const months = ['August 2025','September 2025','October 2025','November 2025','December 2025'];
  return months;

};

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(getMonthStrings()[0]);
  
  const fixedCharge = 100;
  const profitMargin = 50;
const [categoryFilter, setCategoryFilter] = useState();

  const [newOrder, setNewOrder] = useState({
  customer: '',
  blouse_no: '',
  stitching: '',
  work: '',
  work_charge: 0,
  advance: 0,
  category: '', // default category
});


  const sellingPrice = fixedCharge + Number(newOrder.work_charge) + profitMargin;
  const due = sellingPrice - Number(newOrder.advance);
  const profit = sellingPrice - fixedCharge - Number(newOrder.work_charge);

  // Fetch all orders, no filtering on server-side
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);

    if (error) {
      console.error('Fetch error:', error.message);
      alert('Failed to load orders.');
    } else {
      setOrders(data);
    }
  };

  // Add new order (no month in DB)
  const handleAddOrder = async () => {
    const trimmedCustomer = newOrder.customer.trim();
    if (!trimmedCustomer) {
      alert('Customer name is required.');
      return;
    }

    setAdding(true);
    const { error } = await supabase.from('orders').insert([
      {
        customer: trimmedCustomer,
        blouse_no: newOrder.blouse_no,
        stitching: newOrder.stitching,
        work: newOrder.work,
        work_charge: Number(newOrder.work_charge),
        fixed_charge: fixedCharge,
        selling_price: sellingPrice,
        advance: Number(newOrder.advance),
        due: due,
        profit: profit,
        category: newOrder.category,
        // no month saved
      },
    ]);
    setAdding(false);

    if (error) {
      console.error('Insert error:', error.message);
      alert('Failed to add order.');
    } else {
      setNewOrder({
        customer: '',
        blouse_no: '',
        stitching: stitchingOptions[0],
        work: workOptions[0],
        work_charge: 0,
        advance: 0,
      });
      fetchOrders();
    }
  };

  // Update status (optional, remove if not needed)
  const handleUpdateStatus = async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status }) // if you keep status column, otherwise remove this
      .eq('id', id);

    if (error) {
      console.error('Update error:', error.message);
      alert('Failed to update order status.');
    } else {
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders client-side by month selected
  const filteredOrders = orders.filter((order) => {
    if (!order.created_at) return false; // skip if no date

    const orderDate = new Date(order.created_at);
    const orderMonthYear = orderDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    return orderMonthYear === selectedMonth;
  });

  const months = getMonthStrings();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Order Dashboard</h2>

      {/* Month selector buttons */}
      <div style={{ marginBottom: '15px' }}>
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            style={{
              marginRight: '8px',
              padding: '6px 12px',
              backgroundColor: month === selectedMonth ? '#007bff' : '#f0f0f0',
              color: month === selectedMonth ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {month}
          </button>
        ))}
      </div>
<div style={{ marginBottom: '20px' }}>
  <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Category:</label>
  {[ 'Blouse', 'Crop-top', 'Chudidar', 'Gown'].map((cat) => (
    <button
      key={cat}
      onClick={() => setCategoryFilter(cat)}
      style={{
        marginRight: '8px',
        backgroundColor: categoryFilter === cat ? '#007bff' : '#eee',
        color: categoryFilter === cat ? 'white' : 'black',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
        borderRadius: '4px',
      }}
    >
      {cat}
    </button>
  ))}
</div>

      {/* Add Order Section */}
      <h3>Add Order</h3>
<div style={{ marginBottom: '10px' }}>
  <div style={{ marginBottom: '8px' }}>
    <label htmlFor="customer" style={{ marginRight: '8px' }}>Customer Name:</label>
    <input
      id="customer"
      placeholder="Customer Name"
      value={newOrder.customer}
      onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
      style={{ marginRight: '10px' }}
    />
  </div>

  <div style={{ marginBottom: '8px' }}>
    <label htmlFor="blouseNo" style={{ marginRight: '8px' }}>Blouse No.:</label>
    <input
      id="blouseNo"
      placeholder="Blouse No."
      value={newOrder.blouse_no}
      onChange={(e) => setNewOrder({ ...newOrder, blouse_no: e.target.value })}
      style={{ marginRight: '10px' }}
    />
  </div>

<div style={{ marginBottom: '10px' }}>
  <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Category:</label>
  <select
    value={newOrder.category}
    onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value })}
  >
    <option value="Blouse">Blouse</option>
    <option value="Crop-top">Crop-top</option>
    <option value="Chudidar">Chudidar</option>
    <option value="Gown">Gown</option>
  </select>
</div>



  <div style={{ marginBottom: '8px' }}>
    <label htmlFor="stitching" style={{ marginRight: '8px' }}>Stitching:</label>
    <select
      id="stitching"
      value={newOrder.stitching}
      onChange={(e) => setNewOrder({ ...newOrder, stitching: e.target.value })}
      style={{ marginRight: '10px' }}
    >
      {stitchingOptions.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>

  <div style={{ marginBottom: '8px' }}>
    <label htmlFor="work" style={{ marginRight: '8px' }}>Work:</label>
    <select
      id="work"
      value={newOrder.work}
      onChange={(e) => setNewOrder({ ...newOrder, work: e.target.value })}
      style={{ marginRight: '10px' }}
    >
      {workOptions.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>

  <div style={{ marginBottom: '8px' }}>
    <label htmlFor="workCharge" style={{ marginRight: '8px' }}>Work Charge:</label>
    <input
      id="workCharge"
      type="number"
      placeholder="Work Charge"
      value={newOrder.work_charge}
      onChange={(e) =>
        setNewOrder({ ...newOrder, work_charge: parseFloat(e.target.value) || 0 })
      }
      style={{ marginRight: '10px', width: '90px' }}
    />
  </div>

  <div style={{ marginBottom: '8px' }}>
    <label htmlFor="advance" style={{ marginRight: '8px' }}>Advance:</label>
    <input
      id="advance"
      type="number"
      placeholder="Advance"
      value={newOrder.advance}
      onChange={(e) =>
        setNewOrder({ ...newOrder, advance: parseFloat(e.target.value) || 0 })
      }
      style={{ marginRight: '10px', width: '90px' }}
    />
  </div>

  <button
    onClick={handleAddOrder}
    disabled={!newOrder.customer.trim() || adding}
  >
    {adding ? 'Adding...' : 'Add Order'}
  </button>
</div>


      {/* Show calculated fields */}
      <div style={{ marginBottom: '20px' }}>
        <b>Selling Price:</b> Rs.{sellingPrice} &nbsp;&nbsp;
        <b>Due:</b> Rs.{due} &nbsp;&nbsp;
        <b>Profit:</b> Rs.{profit}
      </div>

      {/* Orders Table */}
      <h3>Orders ({selectedMonth})</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found for this month.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Blouse No.</th>
              <th>Stitching</th>
              <th>Work</th>
              <th>Work Charge</th>
              <th>Selling Price</th>
              <th>Advance</th>
              <th>Due</th>
              <th>Profit</th>
              {/* If you want to keep status and change, add those columns here */}
            </tr>
          </thead>
          
          <tbody>
  {orders
    .filter(order => categoryFilter === 'All' || order.category === categoryFilter)
    .map((order) => (
      <tr key={order.id}>
        <td>{order.customer}</td>
        <td>{order.blouse_no}</td>
        <td>{order.stitching}</td>
        <td>{order.work}</td>
                <td>Rs.{order.work_charge}</td>
                <td>Rs.{order.selling_price}</td>
                <td>Rs.{order.advance}</td>
                <td>Rs.{order.due}</td>
                <td>Rs.{order.profit}</td>
        {/* ... other columns */}
      </tr>
    ))}
</tbody>

        </table>
      )}
    </div>
  );
}

export default Dashboard;
