const db = require("../utile/db");

// Get the latest invoice (order with the highest order_detail_id)
exports.GetInvoice = (req, res) => {
  const sql = `
    SELECT 
      p.pro_names, 
      o.qty, 
      o.price, 
      o.total, 
      o.order_detail_id, 
      od.*, 
      c.business_names,
      c.full_names, 
      c.mobile_phone
    FROM \`order\` o
    INNER JOIN order_detail od ON od.id = o.order_detail_id
    INNER JOIN products p ON p.id = o.product_id
    INNER JOIN customer c ON c.id = o.customer_id
    WHERE o.order_detail_id = (SELECT MAX(order_detail_id) FROM \`order\`)`;

  db.query(sql, (err, results) => {  // Removed [id]
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(results);
  });
};


exports.OrderProduct = async (req, res) => {
  try {
    const { customerId, products } = req.body;

    let OrderIdFromDB = customerId;
    if (!customerId) {
      const { account_id,	paymenttype_id,	total_amount,total_amount_dola,balance_amount,changes,balance_amount_usd,amount_discount,type_currency,user_at,description,opening_id } = req.body;
      const sqlCustomer = "INSERT INTO `order_detail` (account_id,paymenttype_id,	total_amount,total_amount_dola,balance_amount,changes,balance_amount_usd,discount,type_currency,user_at,description,opening_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
      const customerValues = [account_id,	paymenttype_id,	total_amount,total_amount_dola,balance_amount,changes,balance_amount_usd,amount_discount,type_currency,user_at,description,opening_id];
      const [customerResult] = await db.promise().query(sqlCustomer, customerValues);
      OrderIdFromDB = customerResult.insertId;
    }
    // Calculate total and insert orders
    for (const product of products) {
      const {customer_id,product_id,qty,price,discount,total,user_at} = product;

      // Insert order details into the 'order' table
      const sqlOrder = "INSERT INTO `order` (customer_id,order_detail_id,product_id,qty,price,discount,total,user_at) VALUES (?, ?, ?, ?,?, ?, ?, ?)";
      const orderValues = [customer_id,OrderIdFromDB,product_id,qty,price,discount,total,user_at];
      await db.promise().query(sqlOrder, orderValues);
    }

    // Respond with success message
    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
};

