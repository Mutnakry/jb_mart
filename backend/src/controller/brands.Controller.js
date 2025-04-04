const db = require("../utile/db");

// show data brands
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM brands";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


// get data to frontend ->  in backend
exports.GetAllBrands = (req, res) => {
    const page = parseInt(req.query.page, 25) || 1;
    const limit = parseInt(req.query.limit, 25) || 25;
    const searchQuery = req.query.search_query || "";
    const offset = (page - 1) * limit;
  
    // Query to get the total number of items that match the search query
    const countQuery = `
        SELECT COUNT(*) AS total 
        FROM brands 
        WHERE brand_names LIKE ?
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
            FROM brands 
            WHERE brand_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                brands: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
  };
  

// update data Category
exports.Update = (req, res) => {
    const { id } = req.params;
    const { brand_names, description } = req.body;
    const checkSql = "SELECT * FROM brands WHERE brand_names = ? AND id != ?";
    db.query(checkSql, [brand_names, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: " already " });
        }
        const sql = "UPDATE brands SET brand_names = ?, description = ? WHERE id = ?";
        db.query(sql, [brand_names, description, id], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Brand not found." });
            }

            res.json({ message: "successfully", data: results });
        });
    });
};


// create data brands
exports.Create = (req, res) => {
    const { brand_names, description } = req.body;
    const checkSql = "SELECT * FROM brands WHERE brand_names = ?";
    db.query(checkSql, [brand_names], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: " already " });
        }
        const sql = "INSERT INTO brands (brand_names, description) VALUES (?, ?)";
        db.query(sql, [brand_names, description], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ message: "successfully", data: results });
        });
    });
};


// GEt Data Single brands
exports.GetSingle = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * From brands  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete brands
exports.Delete = (req, res) => {
    const {id} = req.params;
    const sql = "Delete from brands  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}