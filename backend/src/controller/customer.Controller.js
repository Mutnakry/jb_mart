const db = require("../utile/db");

// show data customer
exports.GetAll = (req, res) => {
    const sql =` SELECT vc.*,vd.total_amount_difference_sum,vd.type_currency from V_totalamount_di_customer vd
RIGHT JOIN V_customer_group vc ON vc.id = vd.customer_id;`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// get data to frontend ->  in backend
exports.GetAllcustomer = (req, res) => {
    const page = parseInt(req.query.page, 25) || 1;
    const limit = parseInt(req.query.limit, 25) || 25;
    const searchQuery = req.query.search_query || "";
    const offset = (page - 1) * limit;
  
    // Query to get the total number of items that match the search query
    const countQuery = `
        SELECT COUNT(*) AS total 
        FROM customer 
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
            SELECT customer.*, gp.group_names,gp.discount
            FROM customer 
            LEFT JOIN group_customer AS gp ON gp.id = customer.group_id
            WHERE customer.full_names LIKE ? OR customer.business_names LIKE ?
            ORDER BY customer.id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                customer: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
};

// Create data Category
// exports.Create = (req, res) => {
//     const {contect_type,group_id,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at}=req.body;
//     const sql = "INSERT INTO customer (contect_type,group_id,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at) VALUES (?,?,?,?,?,?,?,?,?,?)";
//     db.query(sql,[contect_type,group_id,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at], (err, results) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(results);
//     });
// }

// Create customer
exports.Create = (req, res) => {
    const { contect_type, group_id, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at } = req.body;

    // Check if the email, contact_phone, or mobile_phone already exist
    const checkSql = "SELECT * FROM customer WHERE email = ? OR contect_phone = ? OR mobile_phone = ?";
    db.query(checkSql, [email, contect_phone, mobile_phone], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            // If a duplicate is found, return an error message
            return res.status(400).json({ message: "អ៊ីមែល ឬលេខទូរស័ព្ទបានប្រើរួចហើយសម្រាប់អ្នកអតិថជនផ្សេងទៀត។" });
        }

        // If no duplicates, proceed with the insert
        const sql = "INSERT INTO customer (contect_type, group_id, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at) VALUES (?,?,?,?,?,?,?,?,?,?)";
        db.query(sql, [contect_type, group_id, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
};


// update data customer
// exports.Update = (req, res) => {
//     const {id} = req.params;
//     const {contect_type,group_id,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at}=req.body;
//     const sql = "UPDATE customer set contect_type=?,group_id=?,contect_phone=?,mobile_phone=?,business_names=?,full_names=?,half_names=?,description=?,email=?,user_update=? where id=?";
//     db.query(sql,[contect_type,group_id,contect_phone,mobile_phone,business_names,full_names,half_names,description,email,user_at,id], (err, results) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(results);
//     });
// }

// Update customer
exports.Update = (req, res) => {
    const { id } = req.params;
    const { contect_type, group_id, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at } = req.body;

    // Check if the email, contact_phone, or mobile_phone already exist (excluding the current customer's record)
    const checkSql = "SELECT * FROM customer WHERE (email = ? OR contect_phone = ? OR mobile_phone = ?) AND id != ?";
    db.query(checkSql, [email, contect_phone, mobile_phone, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            // If a duplicate is found, return an error message
            return res.status(400).json({ message: "អ៊ីមែល ឬលេខទូរស័ព្ទបានប្រើរួចហើយសម្រាប់អ្នកអតិថជនផ្សេងទៀត។" });
        }

        // If no duplicates, proceed with the update
        const sql = "UPDATE customer SET contect_type = ?, group_id = ?, contect_phone = ?, mobile_phone = ?, business_names = ?, full_names = ?, half_names = ?, description = ?, email = ?, user_update = ? WHERE id = ?";
        db.query(sql, [contect_type, group_id, contect_phone, mobile_phone, business_names, full_names, half_names, description, email, user_at, id], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
};



// GEt Data Single customer
exports.GetSingle = (req, res) => {
    const {id} = req.params;
    const sql = "SELECT * From customer  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete customer
exports.Delete = (req, res) => {
    const {id} = req.params;
    const sql = "Delete from customer  where id=?";
    db.query(sql,[id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}