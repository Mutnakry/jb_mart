const db = require("../utile/db");

// show data supplier
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM supplier";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// get data to frontend ->  in backend
exports.GetAllsupplier = (req, res) => {
    const page = parseInt(req.query.page, 25) || 1;
    const limit = parseInt(req.query.limit, 25) || 25;
    const searchQuery = req.query.search_query || "";
    const offset = (page - 1) * limit;
  
    // Query to get the total number of items that match the search query
    const countQuery = `
        SELECT COUNT(*) AS total 
        FROM supplier 
        WHERE full_names LIKE ? OR business_names LIKE ?
    `;
    db.query(countQuery, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Error fetching count:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        const totalCategory = results[0].total;
        const totalPages = Math.ceil(totalCategory / limit);
  
        // Query to get the paginated and filtered data
        const selectQuery = `
            SELECT *
            FROM supplier 
            WHERE full_names LIKE ? OR business_names LIKE ?
            ORDER BY supplier.id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                supplier: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
};

// Create data Category
// exports.Create = (req, res) => {
//     const {contect_type,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at}=req.body;
//     const sql = "INSERT INTO supplier (contect_type,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at) VALUES (?,?,?,?,?,?,?,?,?)";
//     db.query(sql,[contect_type,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at], (err, results) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(results);
//     });
// }

exports.Create = (req, res) => {
    const { contect_type, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at } = req.body;

    // Check if email, contect_phone, or mobile_phone already exist
    const checkSql = "SELECT * FROM supplier WHERE email = ? OR contect_phone = ? OR mobile_phone = ?";
    db.query(checkSql, [email, contect_phone, mobile_phone], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "អ៊ីមែល ឬលេខទូរស័ព្ទបានប្រើរួចហើយសម្រាប់អ្នកផ្គត់ផ្គង់ផ្សេងទៀត​។" });
        }

        // Insert new record if email and phone numbers are not found
        const insertSql = "INSERT INTO supplier (contect_type, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at) VALUES (?,?,?,?,?,?,?,?,?)";
        db.query(insertSql, [contect_type, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err });
            }
            res.status(201).json({ message: "Supplier created successfully", data: results });
        });
    });
};

// Update supplier data
exports.Update = (req, res) => {
    const { id } = req.params;
    const { contect_type, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at } = req.body;

    // Check if email, contect_phone, or mobile_phone already exist for another supplier
    const checkSql = "SELECT * FROM supplier WHERE (email = ? OR contect_phone = ? OR mobile_phone = ?) AND id != ?";
    db.query(checkSql, [email, contect_phone, mobile_phone, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "អ៊ីមែល ឬលេខទូរស័ព្ទបានប្រើរួចហើយសម្រាប់អ្នកផ្គត់ផ្គង់ផ្សេងទៀត។" });
        }

        // If no duplicate found, update the supplier
        const updateSql = "UPDATE supplier SET contect_type=?, contect_phone=?, mobile_phone=?, business_names=?, full_names=?, half_names=?, description=?, email=?, user_update=? WHERE id=?";
        db.query(updateSql, [contect_type, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err });
            }
            res.status(200).json({ message: "Supplier updated successfully", data: results });
        });
    });
};


// GEt Data Single supplier
exports.GetSingle = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * From supplier  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete supplier
exports.Delete = (req, res) => {
    const {id} = req.params;
    const sql = "Delete from supplier  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}