const db = require("../utile/db");

// show data bank
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM bank";
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
        FROM bank 
        WHERE bank_names LIKE ?
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
            FROM bank 
            WHERE bank_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                bank:results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
  };
  

// Create data bank
exports.Create = (req, res) => {
    const { bank_names } = req.body;
    const checkSql = "SELECT * FROM bank WHERE bank_names = ?";
    db.query(checkSql, [bank_names], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Bank name already exists." });
        }
        const sql = "INSERT INTO bank (bank_names) VALUES (?)";
        db.query(sql, [bank_names], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ success: true, message: "Bank created successfully.", data: results });
        });
    });
};



// update data bank
exports.Update = (req, res) => {
    const { id } = req.params;
    const { bank_names } = req.body;
    const checkSql = "SELECT * FROM bank WHERE bank_names = ? AND id != ?";
    db.query(checkSql, [bank_names, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: " already " });
        }
        const sql = "UPDATE bank SET bank_names = ? WHERE id = ?";
        db.query(sql, [bank_names, id], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Bank not found." });
            }
            res.json({ message: "successfully", data: results });
        });
    });
};


// GEt Data Single bank
exports.GetSingle = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * From bank  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete bank
exports.Delete = (req, res) => {
    const {id} = req.params;
    const sql = "Delete from bank  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}