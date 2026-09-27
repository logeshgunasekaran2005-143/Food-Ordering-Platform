import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">🍽️ Welcome to FoodApp</h1>
      <p className="lead mb-4">Order your favorite food online, fast and easy.</p>
      <Link to="/menu" className="btn btn-primary btn-lg">
        Browse Menu
      </Link>
    </div>
  );
};

export default Home;
