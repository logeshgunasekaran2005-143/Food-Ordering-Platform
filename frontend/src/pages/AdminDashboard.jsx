import { useEffect, useState } from 'react';
import api from '../api/axios';
import OrderStatus from '../components/OrderStatus';

const emptyForm = { name: '', description: '', price: '', category: '', image: '' };

const AdminDashboard = () => {
  const [tab, setTab] = useState('menu');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    const { data } = await api.get('/menu');
    setItems(data);
  };

  const fetchOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/menu/${editingId}`, payload);
      } else {
        await api.post('/menu', payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/menu/${id}`);
    fetchItems();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'menu' ? 'active' : ''}`}
            onClick={() => setTab('menu')}
          >
            Manage Menu
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            Orders
          </button>
        </li>
      </ul>

      {tab === 'menu' && (
        <div className="row">
          <div className="col-md-4">
            <h5>{editingId ? 'Edit Item' : 'Add New Item'}</h5>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <textarea
                className="form-control mb-2"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
              <input
                className="form-control mb-2"
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-2"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-2"
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={handleChange}
              />
              <button className="btn btn-primary me-2" type="submit">
                {editingId ? 'Update' : 'Add'} Item
              </button>
              {editingId && (
                <button className="btn btn-secondary" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="col-md-8">
            <h5>Menu Items</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h5>All Orders</h5>
          {orders.map((order) => (
            <div className="card mb-3" key={order._id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">
                    Order #{order._id.slice(-6)} — {order.user?.name} ({order.user?.email})
                  </h6>
                  <OrderStatus status={order.status} />
                </div>
                <ul className="list-unstyled mb-2">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="fw-bold">Total: ₹{order.totalAmount}</p>
                <select
                  className="form-select w-auto d-inline-block"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
