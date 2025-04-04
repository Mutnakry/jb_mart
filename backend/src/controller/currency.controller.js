const db = require("../utile/db");

// show data Category
exports.Currency = (req, res) => {
    const sql = "SELECT * FROM currency_rates";
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });
}


exports.UpdateCurrency = (req, res) => {
    const { id } = req.params; 
    const { rate } = req.body;
    const sql = "UPDATE currency_rates SET rate = ? WHERE id = ?";

    // Execute the SQL query
    db.query(sql, [rate, id], (err, result) => {
        if (err) {
            return res.status(500).send(err); 
        }
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Currency rate updated successfully" });
        } else {
            return res.status(404).json({ message: "Currency not found" }); 
        }
    });
};
