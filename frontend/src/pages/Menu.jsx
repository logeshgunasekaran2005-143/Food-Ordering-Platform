import { useEffect, useState } from 'react';
import api from '../api/axios';
import MenuCard from '../components/MenuCard';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/menu', { params });
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage(`${item.name} added to cart`);
    setTimeout(() => setMessage(''), 1500);
  };

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Menu</h2>
      {message && <div className="alert alert-success py-2">{message}</div>}

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-primary w-100" type="submit">
            Filter
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading menu...</p>
      ) : items.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <div className="row">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
