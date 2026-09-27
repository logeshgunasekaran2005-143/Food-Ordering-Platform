const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @route POST /api/orders
// body: { items: [{ menuItem: id, quantity: n }] }
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const entry of items) {
      const menuItem = await MenuItem.findById(entry.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${entry.menuItem} not found` });
      }
      const quantity = entry.quantity || 1;
      totalAmount += menuItem.price * quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/orders/:id/status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
