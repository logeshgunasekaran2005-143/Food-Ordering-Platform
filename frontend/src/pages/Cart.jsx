import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const changeQty = (id, delta) => {
    const newCart = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item._id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setPlacing(true);
    try {
      const orderItems = cart.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      }));
      await api.post('/orders', { items: orderItems });
      localStorage.removeItem('cart');
      setCart([]);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => changeQty(item._id, -1)}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => changeQty(item._id, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total: ₹{total}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout} disabled={placing}>
            {placing ? 'Placing order...' : 'Checkout'}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
