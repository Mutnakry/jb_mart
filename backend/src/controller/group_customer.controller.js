const db = require("../utile/db");

// show data group_customer
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM group_customer";
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
        FROM group_customer 
        WHERE group_names LIKE ?
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
            FROM group_customer
            WHERE group_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                group_customer: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
};


// Create data group_customer
exports.Create = (req, res) => {
    const { group_names, discount, detail, user_at } = req.body;
    const checkSql = "SELECT * FROM group_customer WHERE group_names = ?";
    db.query(checkSql, [group_names], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "ឈ្មោះក្រុមមានរួចហើយ" });
        }
        const sql = "INSERT INTO group_customer (group_names, discount, detail, user_at) VALUES (?,?,?,?)";
        db.query(sql, [group_names, discount, detail, user_at], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
};




// update data group_customer
exports.Update = (req, res) => {
    const { id } = req.params;
    const { group_names, discount, detail, user_at } = req.body;
    const checkSql = "SELECT * FROM group_customer WHERE group_names = ? AND id != ?";
    db.query(checkSql, [group_names, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "ឈ្មោះក្រុមមានរួចហើយ" });
        }

        const sql = "UPDATE group_customer set group_names=?, discount=?, detail=?, user_update=? where id=?";
        db.query(sql, [group_names, discount, detail, user_at, id], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
};


// GEt Data Single group_customer
exports.GetSingle = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * From group_customer  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete group_customer
exports.Delete = (req, res) => {
    const { id } = req.params;
    const sql = "Delete from group_customer  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}