const db = require("../utile/db");

// // sum purchase Detail 
exports.PurchaseDetailAll = (req, res) => {
    const sqlyear =
        `SELECT 
        p.purchasedetail_id,
        p.*, su.business_names, su.full_names, pro.pro_names, pro.image, pd.amount_total, pd.amount_discount, pd.amount_pay,
        MIN(p.date_by) AS purchase_date,
        SUM(p.qty) AS total_qty,
        SUM(p.total) AS total_amount,
        SUM(p.include_tax) AS total_include_tax,
        SUM(p.cost_price) AS total_cost_price,
        SUM(p.exclude_tax) AS total_exclude_tax,
        GROUP_CONCAT(pro.pro_names SEPARATOR '<br/>') AS product_names,
         GROUP_CONCAT(p.qty SEPARATOR '<br/>') AS grou_qty,
        MAX(su.business_names) AS business_names,
        MAX(su.full_names) AS supplier_name
    FROM purchase p
    INNER JOIN supplier su ON p.supplier_id = su.id
    INNER JOIN products pro ON p.product_id = pro.id
    INNER JOIN purchase_detail pd ON pd.id = p.purchasedetail_id
   
    GROUP BY p.purchasedetail_id
    ORDER BY p.purchasedetail_id DESC`
    db.query(sqlyear, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


// // sum Supplier
exports.Supplier = (req, res) => {
    const sql = `SELECT 
        p.purchasedetail_id,
        p.*,su.business_names,su.full_names,pro.pro_names,pro.image,pd.amount_total,pd.amount_discount,pd.amount_pay,
        MIN(p.date_by) AS purchase_date,
        SUM(p.qty) AS total_qty,
         SUM(p.total) AS total_amount,
        SUM(p.include_tax) AS total_include_tax,
         SUM(p.cost_price) AS total_cost_price,
         SUM(p.exclude_tax) AS total_exclude_tax,
        GROUP_CONCAT(pro.pro_names SEPARATOR ', ') AS product_names,
        MAX(su.business_names) AS business_names,
        MAX(su.full_names) AS supplier_name
      FROM purchase p
      INNER JOIN supplier su ON p.supplier_id = su.id
      INNER JOIN products pro ON p.product_id = pro.id
      INNER JOIN purchase_detail pd ON pd.id = p.purchasedetail_id
      GROUP BY p.purchasedetail_id
      ORDER BY p.purchasedetail_id DESC`
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}



// // sum InvoiceGroupCustomer
exports.InvoiceGroupCustomer = (req, res) => {
    const sql = `SELECT 
gc.group_names,
 c.group_id,
    c.business_names,
    c.full_names,
    vp.*, 
    o.*, 
    o.discount AS pro_discount,
    SUM(o.qty) AS totalqty,
    od.discount AS totalDiscount, 
    od.*, 
    od.create_at AS date_order
FROM 
    \`order\` o
INNER JOIN 
    order_detail od ON od.id = o.order_detail_id
INNER JOIN 
    v_nameproducts vp ON vp.id = o.product_id
INNER JOIN 
    customer c ON c.id = o.customer_id
INNER JOIN 
    group_customer gc ON gc.id = c.group_id
WHERE 
    c.group_id IS NOT NULL 
GROUP BY 
    o.order_detail_id, c.business_names, c.full_names, vp.id, o.product_id, od.id, od.create_at
ORDER BY 
    o.order_detail_id DESC;`
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// // sum InvoiceStockProduct
exports.InvoiceStockProduct = (req, res) => {
    const sql = `  SELECT pro.*, cat.cat_names, u.names AS unit_names, b.brand_names 
            FROM products AS pro
            LEFT JOIN category AS cat ON pro.category_id = cat.id
            LEFT JOIN unit AS u ON pro.unit_id = u.id
            LEFT JOIN brands AS b ON pro.brand_id = b.id
			ORDER BY  pro.id DESC;`
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// // sum InvoiceQTYSale
exports.InvoiceQTYSale = (req, res) => {
    const sql = `
SELECT 
    pro.pro_names,o.*, pro.*,od.*,
    DATE(o.create_at) AS create_at,
    SUM(o.qty) AS total_qty,
  SUM(o.discount) AS total_discount
FROM \`order\` o
INNER JOIN v_nameproducts pro ON o.product_id = pro.id
INNER join order_detail od  ON od.id = o.order_detail_id
GROUP BY pro.pro_names, DATE(o.create_at)
ORDER BY pro.pro_names, o.create_at;
`
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// // sum InvoiceCost
exports.InvoiceCost = (req, res) => {
    const sql = `
SELECT c.*,ct.type_names,a.acc_names FROM  cost c
INNER JOIN cost_type ct ON ct.id = c.cost_type_id
LEFT JOIN acount a ON a.id = c.account_id;
`
    db.query(sql, (err, results) => {
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
`
    const sql = `SELECT * FROM purchase_detail`
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// ការលក់ របាយការណ៍ ទិញ & លក់
exports.OrderDetailAll = (req, res) => {
    const sql = `
        SELECT * FROM order_detail
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching purchase details:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};
exports.OrderReturn = (req, res) => {
    const sql = `
        SELECT * FROM customer_payment
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching purchase details:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};


// chart order_detail (USD,KHR,THB) in day on month
exports.SaleProduct_Dolla_InDay = (req, res) => {
    const sql = `
     SELECT SUM(o.total_amount_dola) AS total_amount, DAY(o.create_at) AS day,o.create_at
FROM order_detail o
WHERE MONTH(o.create_at) = MONTH(CURDATE()) 
GROUP BY DAY(o.create_at)  
ORDER BY DAY(o.create_at);
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching purchase details:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

/////  count  order_detail (USD,KHR,THB)
exports.SumTotalSale_USD_KHR_THB_inMonth = (req, res) => {
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
