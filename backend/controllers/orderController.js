const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { items, shippingInfo, total } = req.body;
        const userId = req.user.id;

        const order = await Order.create({
            user: userId,
            items,
            shippingInfo,
            total
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).populate('items.product');
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Server error' });
    }
};