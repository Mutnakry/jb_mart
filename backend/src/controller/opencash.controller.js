const db = require("../utile/db");

// exports.GetAllData = (req, res) => {
//     const sql = "SELECT * FROM sales_opening_report WHERE end_date IS NULL LIMIT 1";
//     db.query(sql, (err, results) => { // Use sql directly here
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.json(results);
//     });
// };

exports.GetAllData = (req, res) => {
    const sql = "SELECT * FROM sales_opening_report WHERE end_date IS NULL LIMIT 1";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err); // Log errors
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            res.json(results[0]); // Ensure you're sending back the first result as an object
        } else {
            res.status(404).send("No active shift found");
        }
    });
};

// Create data unit
exports.Create = (req, res) => {
    const { shift, opening_balance, cashier_id } = req.body;

    const checkSql = "SELECT * FROM sales_opening_report WHERE end_date IS NULL AND cashier_id = ?";
    db.query(checkSql, [cashier_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "You already have an active shift." });
        }
        const insertSql = "INSERT INTO sales_opening_report (opening_date, shift, cashier_id, opening_balance) VALUES (NOW(), ?, ?, ?)";
        db.query(insertSql, [shift, cashier_id, opening_balance], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
};


exports.Update = (req, res) => {
    const shiftId = req.params.id;
    const checkSql = "SELECT * FROM sales_opening_report WHERE id = ?";
    db.query(checkSql, [shiftId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error checking shift" });
        if (results.length === 0) return res.status(404).json({ error: "Shift not found" });

        const openingBalance = parseFloat(results[0].opening_balance) || 0;

        // Queries to fetch balances
        const cashInSql = "SELECT COALESCE(SUM(total_amount_dola), 0) AS amount_total FROM order_detail WHERE opening_id = ?";
        const cashOutSql = "SELECT COALESCE(SUM(price), 0) AS total FROM cost WHERE opening_id = ?";

        db.query(cashInSql, [shiftId], (err, cashInResults) => {
            if (err) return res.status(500).json({ error: "Error fetching cash in" });

            db.query(cashOutSql, [shiftId], (err, cashOutResults) => {
                if (err) return res.status(500).json({ error: "Error fetching cash out" });
                const cashIn = parseFloat(cashInResults[0].amount_total) || 0;
                const cashOut = parseFloat(cashOutResults[0].total) || 0;
                // Calculate Closing Balance
                let closingBalance =  + (cashIn - ( cashOut + openingBalance));
                closingBalance = parseFloat(closingBalance.toFixed(2));

                // Update record
                const updateSql = "UPDATE sales_opening_report SET end_date = NOW(),cash_in=?,cash_out=?, closing_balance = ? WHERE id = ?";
                db.query(updateSql, [cashIn, cashOut, closingBalance, shiftId], (err, updateResults) => {
                    if (err) return res.status(500).json({ success: false, message: "Error updating shift." });

                    res.json({ success: true, message: "Shift updated successfully.", data: updateResults });
                });
            });

        });

    });
};


exports.GetAllClostStockProduct = (req, res) => {
    const sql = `SELECT vp.*,o.*,o.discount as itemdiscount,od.* FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c ON c.id = o.customer_id
where od.opening_id = (SELECT MAX(id) from sales_opening_report);`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


exports.GetAllClostCost = (req, res) => {
    const sql = `SELECT * from cost c
INNER JOIN cost_type ct ON ct.id = c.cost_type_id
WHERE c.opening_id = (SELECT MAX(id) from sales_opening_report);`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.SumClostCost = (req, res) => {
    const sql = `SELECT 
    o.order_detail_id,
    MAX(od.total_amount_dola) AS total_amount_dola,
    MAX(od.balance_amount) AS balance_amount,
    MAX(od.discount) AS total_discount,
    MAX(od.type_currency) AS type_currency
FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c ON c.id = o.customer_id
WHERE od.opening_id = (SELECT MAX(id) from sales_opening_report)
GROUP BY o.order_detail_id;`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send("No active shift found");
        }
    });
};

exports.SumClostProduct = (req, res) => {
    const sql = `SELECT 
    o.order_detail_id,
    MAX(od.total_amount_dola) AS total_amount_dola,
       MAX(od.total_amount) as total_amount,
    MAX(od.balance_amount) AS balance_amount,
    MAX(od.discount) AS total_discount,
    MAX(od.type_currency) AS type_currency
FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c ON c.id = o.customer_id
WHERE od.opening_id = (SELECT MAX(id) from sales_opening_report)
GROUP BY o.order_detail_id;`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


exports.CustomerReturm = (req, res) => {
    const sql = `SELECT c.business_names,c.full_names,cp.balance,cp.balance_usd,cp.type_currency,cp.user_at FROM customer_payment cp
INNER JOIN order_detail o ON o.id = cp.order_detail_id
INNER JOIN customer c ON c.id = cp.customer_id
WHERE o.opening_id = (SELECT MAX(id) from sales_opening_report)`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.CustomerReturmProduct = (req, res) => {
    const sql = `SELECT * 
FROM order_repay_detail od
INNER JOIN order_repay o ON o.order_repay_detail_id = od.id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
WHERE DATE(od.payment_date) BETWEEN 
    (SELECT DATE(opening_date) FROM sales_opening_report ORDER BY id DESC LIMIT 1)
    AND 
    (SELECT DATE(end_date) FROM sales_opening_report ORDER BY id DESC LIMIT 1)`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.SumCustomerReturmProduct = (req, res) => {
    const sql = `SELECT *
FROM order_repay_detail od
WHERE DATE(od.payment_date) BETWEEN 
    (SELECT DATE(opening_date) FROM sales_opening_report ORDER BY id DESC LIMIT 1)
    AND 
    (SELECT DATE(end_date) FROM sales_opening_report ORDER BY id DESC LIMIT 1)`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};




exports.Clostreport = (req, res) => {
    const sql = `SELECT * FROM sales_opening_report ORDER BY id DESC LIMIT 1`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


exports.GetAll = (req, res) => {
    const sql = `SELECT * FROM sales_opening_report ORDER BY id Desc`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

///////////////////// ID ///////////
exports.GetAllClostStockProductID = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT vp.*,o.*,o.discount as itemdiscount,od.* FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c ON c.id = o.customer_id
where od.opening_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.GetAllClostCostID = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * from cost c
INNER JOIN cost_type ct ON ct.id = c.cost_type_id
WHERE c.opening_id = ?;`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


exports.SumClostCostID = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT 
    o.order_detail_id,
    MAX(od.total_amount_dola) AS total_amount_dola,
    MAX(od.balance_amount) AS balance_amount,
    MAX(od.discount) AS total_discount,
    MAX(od.type_currency) AS type_currency
FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c ON c.id = o.customer_id
WHERE od.opening_id = ?
GROUP BY o.order_detail_id;`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


exports.SumClostProductID = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT 
    o.order_detail_id,
    MAX(od.total_amount_dola) AS total_amount_dola,
       MAX(od.total_amount) as total_amount,
    MAX(od.balance_amount) AS balance_amount,
    MAX(od.discount) AS total_discount,
    MAX(od.type_currency) AS type_currency
FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c ON c.id = o.customer_id
WHERE od.opening_id = ?
GROUP BY o.order_detail_id;`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


exports.CustomerReturmID = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT c.business_names,c.full_names,cp.balance,cp.balance_usd,cp.type_currency,cp.user_at FROM customer_payment cp
INNER JOIN order_detail o ON o.id = cp.order_detail_id
INNER JOIN customer c ON c.id = cp.customer_id
WHERE o.opening_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.ClostreportID = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM sales_opening_report where id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};