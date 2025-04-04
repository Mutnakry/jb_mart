const db = require("../utile/db");

// show data cost_type
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM cost_type";
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
        FROM cost_type 
        WHERE type_names LIKE ?
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
            FROM cost_type 
            WHERE type_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                cost_type: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
  };
  

// Create data cost_type
exports.Create = (req, res) => {
    const {type_names}=req.body;
    const sql = "INSERT INTO cost_type (type_names) VALUES (?)";
    db.query(sql,[type_names], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


// update data cost_type
exports.Update = (req, res) => {
    const {id} = req.params;
    const {type_names}=req.body;
    const sql = "UPDATE cost_type set type_names=? where id=?";
    db.query(sql,[type_names,id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// GEt Data Single cost_type
exports.GetSingle = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * From cost_type  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete cost_type
exports.Delete = (req, res) => {
    const {id} = req.params;
    const sql = "Delete from cost_type  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}