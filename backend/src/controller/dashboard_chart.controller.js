const db = require("../utile/db");

// // sum purchase Detail in year
exports.PurchaseDetailAll = (req, res) => {
    const sqlyear = `
    SELECT 
    p.amount_total,
    p.amount_discount,
    p.amount_pay,
    (p.amount_total - p.amount_pay) AS amoun_di,
    p.pay_date,
    p.create_at
FROM purchase_detail p 
`
    db.query(sqlyear, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });

}

// // sum purchase Detail in one year
exports.Sum_PurchaseDetail = (req, res) => {
    const sqlyear = `SELECT 
    SUM(p.amount_total) AS SumAmountTotal,
    SUM(p.amount_discount) AS SumAmountDiscount,
    SUM(p.amount_pay) AS SumAmountPay,
    SUM(p.amount_total - p.amount_pay) AS SumAmountDue,
    p.pay_date,
    p.create_at
FROM purchase_detail p
WHERE YEAR(p.pay_date) = YEAR(CURDATE());
`
    db.query(sqlyear, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// chart purchase sum sale in year
exports.PurchaseSale = (req, res) => {
    const sql = `
        SELECT SUM(p.total) AS total_amount, MONTH(p.create_at) AS month 
        FROM purchase p 
        WHERE YEAR(p.create_at) = YEAR(CURDATE()) 
        GROUP BY MONTH(p.create_at)
        ORDER BY MONTH(p.create_at);
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching purchase details:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};


// chart order_detail (USD,KHR,THB) in day on month លុយដែលមិនទាន់ជុំពាក់

exports.SaleProduct_Dolla_InDay = (req, res) => {
    const sql = `
        SELECT
    DAY(od.create_at) AS day,
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
FROM order_detail od
WHERE MONTH(od.create_at) = MONTH(CURDATE())
GROUP BY DAY(od.create_at) 
ORDER BY DAY(od.create_at); 
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};
/////  count  order_detail (USD,KHR,THB)លុយដែលទទូឡបាន
exports.SumTotalSale_USD_KHR_THB_inMonth = (req, res) => {
    const sql = `
        SELECT
    DAY(od.create_at) AS day,
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END) AS TotalAmountUSD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END) AS TotalAmountKHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END) AS TotalAmountTHB
FROM order_detail od
WHERE MONTH(od.create_at) = MONTH(CURDATE())
GROUP BY DAY(od.create_at) 
ORDER BY DAY(od.create_at); 
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};



// sum purchase product in year
exports.PurchaseProduct = (req, res) => {
    const sql_month = `SELECT 
    pro.pro_names, 
    SUM(p.qty) AS total_quantity
FROM purchase p
INNER JOIN products pro ON p.product_id = pro.id
WHERE MONTH(p.date_by) = MONTH(CURDATE()) 
AND YEAR(p.date_by) = YEAR(CURDATE())  -- Ensure it's the current year
GROUP BY pro.pro_names;
`;

    const sqlyear = `SELECT 
    pro.pro_names, 
    SUM(p.qty) AS total_quantity,
    p.date_by
FROM purchase p
INNER JOIN products pro ON p.product_id = pro.id
WHERE YEAR(p.date_by) = YEAR(CURDATE())
GROUP BY pro.pro_names;
`;

    db.query(sql_month, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};



// CostPrice
exports.CostPrice = (req, res) => {

    const sql = `SELECT 
  SUM(c.price) AS amount_price,
  SUM(c.payment) AS amount_payment
FROM 
  cost c
WHERE 
  YEAR(c.dob) = YEAR(CURDATE());
`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};



// count product CountProduct
exports.CountProduct = (req, res) => {

    const sql = `
    SELECT 
  count(p.pro_names) as count_total
FROM 
  products p
`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};



// TotalAmountUSD
// TotalAmountKHR
// TotalAmountTHB
// AmountDi_USD
// AmountDi_KHR
// AmountDi_THB
// ResultTotal_DiUSD
// ResultTotal_DiKHR
// ResultTotal_DiTHB

exports.OrderSum = (req, res) => {
    const sql1 = `
    SELECT 
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB,
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END) AS AmountDi_USD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END) AS AmountDi_KHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END) AS AmountDi_THB,
    (SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiUSD,
    (SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiKHR,
    (SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiTHB,
     od.create_at
    FROM order_detail od
`;

    const sql = `   SELECT 
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR1,
        SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount_dola ELSE 0 END) AS TotalAmountKHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB1,
      SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount_dola ELSE 0 END) AS TotalAmountTHB,
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END) AS AmountDi_USD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END) AS AmountDi_KHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END) AS AmountDi_THB,
    (SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiUSD,
    (SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiKHR,
    (SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiTHB,
       DATE(od.create_at) AS Date
FROM order_detail od
GROUP BY DATE(od.create_at) 
ORDER BY Date;  
`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.OrderSumAll = (req, res) => {
    const sql = `
    SELECT 
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB,
    SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END) AS AmountDi_USD,
    SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END) AS AmountDi_KHR,
    SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END) AS AmountDi_THB,
    (SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'usd' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiUSD,
    (SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'khr' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiKHR,
    (SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) - 
     SUM(CASE WHEN od.type_currency = 'thb' THEN od.balance_amount ELSE 0 END)) AS ResultTotal_DiTHB,
     od.create_at
    FROM order_detail od
`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

// count customer CountProduct
exports.CountCustomer = (req, res) => {

    const sql = `
    SELECT 
  count(c.contect_type) as count_total
FROM 
  customer c
`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

/////  count  order_detail (USD,KHR,THB)
exports.SumTotalSale1 = (req, res) => {
    const sql = `
        SELECT
            SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) as TotalAmountUSD,
            SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) as TotalAmountKHR,
            SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) as TotalAmountTHB
        FROM order_detail od
        WHERE YEAR(od.create_at) = YEAR(CURDATE());
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ error: 'An error occurred while fetching data' });
        }

        // Ensure results always have the required fields, even if they are null
        const data = results[0] || {
            TotalAmountUSD: 0,
            TotalAmountKHR: 0,
            TotalAmountTHB: 0,
        };

        res.json(data);
    });
};


exports.SumTotalSale_Dolla_INYear = (req, res) => {
    const sql = `
        SELECT
            MONTH(od.create_at) AS month,
            SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
            SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
            SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
        FROM order_detail od
        WHERE YEAR(od.create_at) = YEAR(CURDATE())
        GROUP BY MONTH(od.create_at)
        ORDER BY MONTH(od.create_at);
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};


exports.ProductPopular = (req, res) => {
    const sql = `
       SELECT pro.pro_names, SUM(o.qty) as total_qty,pro.unit_names
FROM \`order\` o  
INNER JOIN v_nameproducts as pro ON pro.id = o.product_id
GROUP BY o.product_id 
ORDER BY total_qty DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};

/////  count  product qty sale  in day  a

exports.CountProductQTYSale = (req, res) => {
    const sql = `
        SELECT 
            pro.pro_names, 
            SUM(o.qty) AS total_quantity,
               pro.unit_names
        FROM \`order\` o
        INNER JOIN v_nameproducts pro ON o.product_id = pro.id
        WHERE DATE(o.create_at) = CURDATE()  
        GROUP BY pro.pro_names
        ORDER BY total_quantity DESC;  
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};

/////  count  product qty sale  in day

exports.CountProductQTYSale = (req, res) => {
    const sql = `
        SELECT 
            pro.pro_names, 
            SUM(o.qty) AS total_quantity,
               pro.unit_names
        FROM \`order\` o
        INNER JOIN v_nameproducts pro ON o.product_id = pro.id
        WHERE DATE(o.create_at) = CURDATE()  
        GROUP BY pro.pro_names
        ORDER BY total_quantity DESC;  -- Fixed "DESC"
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};


//// check stock in table product stock_in and stock_out
exports.StockProduct = (req, res) => {
    const sql1 = `
      SELECT 
    p.pro_names,
    SUM(p.qty) AS stock_IN,
    SUM(p.stock) AS stock_total ,
    (SUM(p.stock) - SUM(p.qty)) AS stock_OUT
FROM products p
GROUP BY p.pro_names;
    `;

    const sql = `
   SELECT 
    p.pro_names,
    SUM(p.qty) AS stock_IN,
    SUM(p.stock) AS stock_total ,
    (SUM(p.stock) - SUM(p.qty)) AS stock_OUT,
    u.names as unit_names
FROM products p
INNER JOIN unit u ON u.id = p.unit_id
GROUP BY p.pro_names;
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};




//// check MG_stock qty <= not-qty
exports.Check_NoteQTY = (req, res) => {
    const sql = `
   SELECT p.pro_names, p.qty as stock_IN,
    u.names as unit_names
FROM products p
INNER JOIN unit u ON u.id = p.unit_id
WHERE p.qty <= p.note_qty AND p.mg_stock = 'enable'
ORDER BY p.qty ASC;
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};



exports.ReportOpensale = (req, res) => {
    const sql = `SELECT s.opening_date,s.end_date,s.opening_balance,s.closing_balance FROM sales_opening_report s`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching data" });
        }

        res.json(results);
    });
};

exports.ReportIcomCale = (req, res) => {
    const sql = `
SELECT 
    DATE_FORMAT(od.create_at, '%Y-%m') AS month, 
    SUM(od.total_amount_dola) AS total_income, 
     SUM(od.balance_amount) AS total_incomePay,
FROM order_detail od 
GROUP BY month 
ORDER BY month ASC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching income data" });
        }

        res.json(results); // Returns an array of { date: 'YYYY-MM-DD', income: number }
    });
};



exports.ReportExpent = (req, res) => {
    const sql = `
SELECT 
    DATE_FORMAT(pu.pay_date, '%Y-%m') AS month, 
    SUM(pu.amount_total) AS total_expent
FROM purchase_detail pu
GROUP BY month 
ORDER BY month ASC;`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching income data" });
        }

        res.json(results); // Returns an array of { date: 'YYYY-MM-DD', income: number }
    });
};


exports.ReportProfit = (req, res) => {
    const sql = `
        SELECT 
            COALESCE(income.month, expense.month) AS month, 
            COALESCE(income.total_income, 0) AS total_income,
            COALESCE(expense.total_expent, 0) AS total_expent,
            COALESCE(income.total_income, 0) - COALESCE(expense.total_expent, 0) AS profit
        FROM (
            SELECT 
                DATE_FORMAT(od.create_at, '%Y-%m') AS month, 
                SUM(od.total_amount_dola) AS total_income
            FROM order_detail od 
            GROUP BY month
        ) AS income
        LEFT JOIN (
            SELECT 
                DATE_FORMAT(pu.pay_date, '%Y-%m') AS month, 
                SUM(pu.amount_total) AS total_expent
            FROM purchase_detail pu
            GROUP BY month
        ) AS expense
        ON income.month = expense.month

        UNION

        SELECT 
            COALESCE(income.month, expense.month) AS month, 
            COALESCE(income.total_income, 0) AS total_income,
            COALESCE(expense.total_expent, 0) AS total_expent,
            COALESCE(income.total_income, 0) - COALESCE(expense.total_expent, 0) AS profit
        FROM (
            SELECT 
                DATE_FORMAT(od.create_at, '%Y-%m') AS month, 
                SUM(od.total_amount_dola) AS total_income
            FROM order_detail od 
            GROUP BY month
        ) AS income
        RIGHT JOIN (
            SELECT 
                DATE_FORMAT(pu.pay_date, '%Y-%m') AS month, 
                SUM(pu.amount_total) AS total_expent
            FROM purchase_detail pu
            GROUP BY month
        ) AS expense
        ON income.month = expense.month

        ORDER BY month ASC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send({ error: "An error occurred while fetching income data" });
        }

        res.json(results); // Now returns total_income, total_expent, and profit
    });
};


////////////////////
// SELECT p.id, SUM(p.total) AS total_amount, MONTH(p.create_at) AS month
//         FROM purchase p
//         WHERE YEAR(p.create_at) = YEAR(CURDATE())
//         GROUP BY MONTH(p.create_at)
//         ORDER BY MONTH(p.create_at);

//   SELECT o.id ,SUM(o.total_amount_dola) AS total_amount, MONTH(o.create_at) AS month
// FROM order_detail o
// WHERE MONTH(o.create_at) = MONTH(CURDATE())
// GROUP BY DAY(o.create_at)
// ORDER BY DAY(o.create_at);

// SELECT
// c.id,
//     SUM(c.price) AS total_amount,
//     MONTH(c.dob) AS month
// FROM cost c
// WHERE YEAR(c.dob) = YEAR(CURDATE())
// GROUP BY MONTH(c.dob)
// ORDER BY MONTH





///////////view


// CREATE VIEW monthly_summary AS
// SELECT
//     months.month,
//     COALESCE(p.total_amount, 0) AS purchase_total,
//     COALESCE(o.total_amount, 0) AS order_total,
//     COALESCE(c.total_amount, 0) AS cost_total
// FROM
//     (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
//      SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION
//      SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS months
// LEFT JOIN
//     (SELECT MONTH(p.create_at) AS month, SUM(p.total) AS total_amount
//      FROM purchase p
//      WHERE YEAR(p.create_at) = YEAR(CURDATE())
//      GROUP BY MONTH(p.create_at)) p ON months.month = p.month
// LEFT JOIN
//     (SELECT MONTH(o.create_at) AS month, SUM(o.total_amount_dola) AS total_amount
//      FROM order_detail o
//      WHERE YEAR(o.create_at) = YEAR(CURDATE())
//      GROUP BY MONTH(o.create_at)) o ON months.month = o.month
// LEFT JOIN
//     (SELECT MONTH(c.dob) AS month, SUM(c.price) AS total_amount
//      FROM cost c
//      WHERE YEAR(c.dob) = YEAR(CURDATE())
//      GROUP BY MONTH(c.dob)) c ON months.month = c.month
// ORDER BY months.month;


//////////////

// CREATE VIEW monthly_summary AS
// SELECT
//     months.month,
//     COALESCE(p.total_amount, 0) AS purchase_total,
//     COALESCE(o.total_amount, 0) AS order_total,
//     COALESCE(c.total_amount, 0) AS cost_total
// FROM
//     (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
//      SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION
//      SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS months
// LEFT JOIN
//     (SELECT MONTH(p.create_at) AS month, SUM(p.amount_total) AS total_amount
//      FROM purchase_detail p
//      WHERE YEAR(p.create_at) = YEAR(CURDATE())
//      GROUP BY MONTH(p.create_at)) p ON months.month = p.month
// LEFT JOIN
//     (SELECT MONTH(o.create_at) AS month, SUM(o.total_amount_dola) AS total_amount
//      FROM order_detail o
//      WHERE YEAR(o.create_at) = YEAR(CURDATE())
//      GROUP BY MONTH(o.create_at)) o ON months.month = o.month
// LEFT JOIN
//     (SELECT MONTH(c.dob) AS month, SUM(c.price) AS total_amount
//      FROM cost c
//      WHERE YEAR(c.dob) = YEAR(CURDATE())
//      GROUP BY MONTH(c.dob)) c ON months.month = c.month
// ORDER BY months.month;
