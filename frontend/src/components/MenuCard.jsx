const MenuCard = ({ item, onAddToCart }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={item.image || 'https://via.placeholder.com/300x180?text=Food+Item'}
          className="card-img-top"
          alt={item.name}
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text text-muted small">{item.description}</p>
          <p className="card-text fw-bold">₹{item.price}</p>
          <button
            className="btn btn-primary mt-auto"
            disabled={!item.available}
            onClick={() => onAddToCart(item)}
          >
            {item.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
