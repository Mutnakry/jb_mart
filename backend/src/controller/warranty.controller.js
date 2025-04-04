const db = require("../utile/db");

// show data GetAllWarranty
exports.GetAllWarranty = (req, res) => {
    const sql = `SELECT w.id,w.duration,w.type,w.description,w.product_id,w.create_at,p.pro_names FROM warranty w
INNER JOIN products p ON p.id = w.product_id`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

exports.CreateWarranty = (req, res) => {
    const { product_id, duration, type, description } = req.body;
    const sql = "INSERT INTO warranty (product_id, duration, type, description) VALUES (?, ?, ?, ?)";

    db.query(sql, [product_id, duration, type, description], (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(201).json({ message: "Warranty created successfully", data: results });
    });
};


exports.UpdateWarranty = (req, res) => {
    const { id } = req.params;
    const {product_id, duration, type, description } = req.body;

    // SQL query to update warranty by ID
    const sql = "UPDATE warranty SET product_id = ?, duration = ?, type = ?, description = ? WHERE id = ?";

    db.query(sql, [product_id, duration, type, description, id], (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Warranty not found" });
        }
        res.status(200).json({ message: "Warranty updated successfully", data: results });
    });
};

exports.DeleteWarranty = (req, res) => {
    const { id } = req.params;  // Get the warranty ID from the URL parameter

    const sql = "DELETE FROM warranty WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Warranty not found" });
        }
        res.status(200).json({ message: "Warranty deleted successfully", data: results });
    });
};
