const db = require("../utile/db");

// show data order
exports.GetAllOrder = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT c.business_names,c.full_names,vp.*,o.*,o.discount as pro_discount,od.discount as totalDiscount,od.*,od.create_at as date_order FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER  JOIN v_nameproducts vp ON vp.id = o.product_id
INNER JOIN customer c on c.id = o.customer_id
WHERE o.order_detail_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


// show data All data order
exports.GetOrder = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT 
    c.business_names,
    c.full_names,
    vp.*, 
    o.*,
    o.discount as pro_discount,
     SUM(o.qty) as totalqty,
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
GROUP BY 
    o.order_detail_id
    ORDER BY o.order_detail_id DESC;`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}


//// cate order repay ment from customer
exports.CreateOrderRepay = async (req, res) => {
    try {
        const { customerId, products } = req.body;
        let customerIdFromDB = customerId;

        // If customerId is not provided, create a new order repayment detail record
        if (!customerId) {
            const { customer_id,order_detail_id, account_id, payment_date, total_amount, discount_amount, balance_payment,type_currency, user_at } = req.body;

            const sqlCustomer = `
                INSERT INTO order_repay_detail 
                (customer_id,order_detail_id, account_id, payment_date, total_amount, discount_amount, balance_payment, user_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?,?)`;

            const customerValues = [customer_id,order_detail_id, account_id, payment_date, total_amount, discount_amount, balance_payment,type_currency, user_at];
            const [customerResult] = await db.promise().query(sqlCustomer, customerValues);

            customerIdFromDB = customerResult.insertId;  // Store the newly created customer ID
        }

        // Insert order repayment details for each product
        for (const product of products) {
            const { product_id, qty, price, discount, total, description } = product;

            const sqlOrder = `
                INSERT INTO order_repay 
                (product_id, order_repay_detail_id, qty, price, discount, total, description) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const orderValues = [product_id, customerIdFromDB, qty, price, discount, total, description];
            await db.promise().query(sqlOrder, orderValues);
        }

        // Respond with success message
        res.status(201).json({ message: 'Order created successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the order' });
    }
};











// DELIMITER $$

// CREATE TRIGGER update_product_qty
// AFTER INSERT ON `order`
// FOR EACH ROW
// BEGIN
//     -- Check if the product's stock is enabled
//     IF (SELECT mg_stock FROM products WHERE id = NEW.product_id) = 'enable' THEN
//         -- Update the quantity in the products table only if mg_stock is 'enable'
//         UPDATE products
//         SET qty = qty - NEW.qty
//         WHERE id = NEW.product_id;
//     END IF;
// END $$

// DELIMITER ;
