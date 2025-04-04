const db = require("../utile/db");

// Create all customer payment
exports.GetPayCustomerment = (req, res) => {
  const sql = "SELECT * FROM customer_payment";
  db.query(sql, (err, data) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(data);
  });
}



exports.GetPayCustomermentBYID = (req, res) => {
  const sql = "SELECT * FROM customer_payment";
  db.query(sql, (err, data) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(data);
  });
}


// Create customer payment
exports.CreatecustomerPay = (req, res) => {
  const { customer_id, order_detail_id,account_id, balance,balance_usd, cash_change, type_currency, description, user_at } = req.body;
  const sql = "INSERT INTO customer_payment (customer_id, order_detail_id,account_id, balance, balance_usd, cash_change, type_currency, description, user_at) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?)";
  const values = [customer_id, order_detail_id,account_id, balance, balance_usd, cash_change, type_currency, description, user_at];
  
  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    res.status(201).json({
      message: "Customer payment created successfully",
      payment_id: results.insertId, 
    });
  });
};

// Update customer payment
exports.UpdateCustomerPay = (req, res) => {
  const { id } = req.params; // Get ID from request parameters
  const { customer_id, order_detail_id, balance, cash_change, type_currency, description, user_at } = req.body;

  const sql = `
    UPDATE customer_payment 
    SET customer_id = ?, 
        order_detail_id = ?, 
        balance = ?, 
        cash_change = ?, 
        type_currency = ?, 
        description = ?, 
        user_update = ?, 
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`;

  const values = [customer_id, order_detail_id, balance, cash_change, type_currency, description, user_at, id];

  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Customer payment not found" });
    }

    res.json({
      message: "Customer payment updated successfully",
      updated_id: id,
    });
  });
};

// Delete customer payment
exports.DeleteCustomerPay = (req, res) => {
  const { id } = req.params; // Get ID from request parameters

  const sql = "DELETE FROM customer_payment WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Customer payment not found" });
    }

    res.json({
      message: "Customer payment deleted successfully",
      deleted_id: id,
    });
  });
};