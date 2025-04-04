const db = require("../utile/db");

// show data Category
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM category";
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
        FROM category 
        WHERE cat_names LIKE ?
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
            FROM category 
            WHERE cat_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                categories: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
};

exports.Create = (req, res) => {
    const { cat_names, detail } = req.body;
    const checkSql = "SELECT * FROM category WHERE cat_names = ?";
    db.query(checkSql, [cat_names], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "already" });
        }
        const insertSql = "INSERT INTO category (cat_names, detail) VALUES (?,?)";
        db.query(insertSql, [cat_names, detail], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ message: "successfully", data: results });
        });
    });
};
// update data Category
exports.Update = (req, res) => {
    const { id } = req.params;
    const { cat_names, detail } = req.body;
    const checkSql = "SELECT * FROM category WHERE cat_names = ? AND id != ?";
    db.query(checkSql, [cat_names, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ message: " already " });
        }
        const updateSql = "UPDATE category SET cat_names=?, detail=? WHERE id=?";
        db.query(updateSql, [cat_names, detail, id], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ message: "successfully", data: results });
        });
    });
};


// GEt Data Single Category
exports.GetSingle = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * From category  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete Category
exports.Delete = (req, res) => {
    const { id } = req.params;
    const sql = "Delete from category  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}