const db = require("../utile/db");

// show data payment_type
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM payment_type";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// get data to frontend ->  in backend
exports.GetAllData = (req, res) => {
    const page = parseInt(req.query.page, 25) || 1;
    const limit = parseInt(req.query.limit, 25) || 25;
    const searchQuery = req.query.search_query || "";
    const offset = (page - 1) * limit;
  
    // Query to get the total number of items that match the search query
    const countQuery = `
        SELECT COUNT(*) AS total 
        FROM payment_type 
        WHERE pay_manes LIKE ?
    `;
    db.query(countQuery, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Error fetching count:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
  
        const totalCategory = results[0].total;
        const totalPages = Math.ceil(totalCategory / limit);
  
        // Query to get the paginated and filtered data
        const selectQuery = `
            SELECT * 
            FROM payment_type 
            WHERE pay_manes LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                payment_type:results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
  };
  

// Create data payment_type
exports.Create = (req, res) => {
    const { pay_manes } = req.body;
    const checkSql = "SELECT * FROM payment_type WHERE pay_manes = ?";
    db.query(checkSql, [pay_manes], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "payment_type name already exists." });
        }
        const sql = "INSERT INTO payment_type (pay_manes) VALUES (?)";
        db.query(sql, [pay_manes], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ success: true, message: "payment_type created successfully.", data: results });
        });
    });
};



// update data payment_type
exports.Update = (req, res) => {
    const { id } = req.params;
    const { pay_manes } = req.body;
    const checkSql = "SELECT * FROM payment_type WHERE pay_manes = ? AND id != ?";
    db.query(checkSql, [pay_manes, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: " already " });
        }
        const sql = "UPDATE payment_type SET pay_manes = ? WHERE id = ?";
        db.query(sql, [pay_manes, id], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "payment_type not found." });
            }
            res.json({ message: "successfully", data: results });
        });
    });
};


// GEt Data Single payment_type
exports.GetSingle = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * From payment_type  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete payment_type
exports.Delete = (req, res) => {
    const {id} = req.params;
    const sql = "Delete from payment_type  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}