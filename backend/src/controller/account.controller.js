const db = require("../utile/db");

// show data acount
exports.GetAll = (req, res) => {
    const sql = "SELECT * FROM acount";
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
        FROM acount 
        WHERE acc_names LIKE ?
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
            SELECT acc.* ,bk.bank_names
            FROM acount as acc inner join bank as bk on acc.bank_id = bk.id
            WHERE acc.acc_names LIKE ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;
        db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({
                account: results,
                totalPages,
                currentPage: page,
                totalCategory,
            });
        });
    });
};


// Create data acount
exports.Create = (req, res) => {
    const { acc_names, bank_id, acc_num, balance, description, user_at } = req.body;
    const sql = "INSERT INTO acount (acc_names,bank_id,acc_num,balance,description,user_at) VALUES (?,?,?,?,?,?)";
    db.query(sql, [acc_names, bank_id, acc_num, balance, description, user_at], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}



// update data acount
exports.Update = (req, res) => {
    const { id } = req.params;
    const { acc_names, bank_id, acc_num, balance, description, user_at } = req.body;
    const sql = "UPDATE acount set acc_names=?,bank_id=?,acc_num=?,balance=?,description=?,user_update=? where id=?";
    db.query(sql, [acc_names, bank_id, acc_num, balance, description, user_at, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// update data Update_Status
exports.Update_Status = (req, res) => {
    const { id } = req.params;
    const { status, user_at } = req.body;
    const sql = "UPDATE acount set user_update=?,status=? where id=?";
    db.query(sql, [user_at, status, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// GEt Data Single acount
exports.GetSingle = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * From acount  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// DElete acount
exports.Delete = (req, res) => {
    const { id } = req.params;
    const sql = "Delete from acount  where id=?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}





// Create data acount
exports.CreateAccDetail = (req, res) => {
    const { account_in, account_out, detail_balance, description } = req.body;
    const sql = "INSERT INTO account_detail (account_in, account_out, detail_balance, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [account_in, account_out, detail_balance, description], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create payment detail' });
        }
        res.status(201).json({ message: 'Payment detail created successfully', data: results });
    });
};


// Create data acount
exports.InputMoneyAccDetail = (req, res) => {
    const { account_in, account_out, detail_balance, description } = req.body;
    const sql = "INSERT INTO account_detail (account_in, account_out, detail_balance, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [account_in, account_out, detail_balance, description], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create payment detail' });
        }
        res.status(201).json({ message: 'Payment detail created successfully', data: results });
    });
};


///  /// មើលលំអិត acc pay to  by ID 
exports.getPaymentDetail = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT acin.acc_names as acc_nameIn,acin.acc_num as acc_numIn,acout.acc_num as acc_numOut,acout.acc_names acc_nameOut,ad.detail_balance,ad.created_at,ad.description FROM account_detail ad
LEFT JOIN acount acin On acin.id = ad.account_in
LEFT JOIN acount acout On acout.id = ad.account_out where ad.account_out=?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


// ///  /// មើលលំអិត acc pay to  ALL 
exports.getPaymentDetailAll = (req, res) => {
    const sql = `SELECT acin.acc_names as acc_nameIn,acin.acc_num as acc_numIn,acout.acc_num as acc_numOut,acout.acc_names acc_nameOut,ad.detail_balance,ad.created_at,ad.description FROM account_detail ad
LEFT JOIN acount acin On acin.id = ad.account_in
LEFT JOIN acount acout On acout.id = ad.account_out `;
    const sql1 = 'SELECT * from acount';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


