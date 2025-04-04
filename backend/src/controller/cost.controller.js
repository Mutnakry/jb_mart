const db = require("../utile/db");

// show data cost
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM cost";
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
        FROM cost 
        WHERE cost_type_id LIKE ?
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
            SELECT cost.*, ty.type_names, acc.acc_names 
            FROM cost
            INNER JOIN cost_type as ty ON cost.cost_type_id = ty.id
            LEFT JOIN acount as acc ON cost.account_id = acc.id
            WHERE ty.type_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                cost: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
};


// Create data cost
exports.Create = (req, res) => {
    const { cost_type_id, account_id,opening_id, tax, price,payment, dob, decription, interval, interval_type, user_at } = req.body;
    const sql = "INSERT INTO cost (cost_type_id,account_id,opening_id,tax,price,payment,dob,decription,`interval`,interval_type,user_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql, [cost_type_id, account_id,opening_id, tax, price,payment, dob, decription, interval, interval_type, user_at], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};



// update data cost
exports.Update = (req, res) => {
    const { id } = req.params;
    const { cost_type_id, account_id, tax, price,payment, dob, decription, interval, interval_type, user_at } = req.body;
    const sql = "UPDATE cost set cost_type_id=?,account_id=?,tax=?,price=?,payment=?,dob=?,decription=?,`interval`=?,interval_type=?,user_update=? where id=?";
    db.query(sql, [cost_type_id, account_id, tax, price,payment, dob, decription, interval, interval_type, user_at, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// GEt Data Single cost
exports.GetSingle = (req, res) => {
    const { id } = req.params;
    const sql = ` SELECT cost.*, ty.type_names, acc.acc_names 
            FROM cost
            INNER JOIN cost_type as ty ON cost.cost_type_id = ty.id
            LEFT JOIN acount as acc ON cost.account_id = acc.id
            WHERE cost.id=?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete cost
exports.Delete = (req, res) => {
    const { id } = req.params;
    const sql = "Delete from cost  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}