const statusColors = {
  pending: 'warning',
  preparing: 'info',
  delivered: 'success',
};

const OrderStatus = ({ status }) => {
  return (
    <span className={`badge bg-${statusColors[status] || 'secondary'} text-capitalize`}>
      {status}
    </span>
  );
};

export default OrderStatus;
