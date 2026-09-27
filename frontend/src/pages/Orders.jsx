import { useEffect, useState } from 'react';
import api from '../api/axios';
import OrderStatus from '../components/OrderStatus';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="card mb-3" key={order._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Order #{order._id.slice(-6)}</h6>
                <OrderStatus status={order.status} />
              </div>
              <ul className="list-unstyled mb-2">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p className="fw-bold mb-0">Total: ₹{order.totalAmount}</p>
              <small className="text-muted">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
