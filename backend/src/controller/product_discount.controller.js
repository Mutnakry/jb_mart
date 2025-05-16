const db = require("../utile/db");

//  product discounts
exports.GetAllProductDiscount = (req, res) => {
    const sql = `SELECT pd.*, p.pro_names, pdd.detail_name,
  SUM(pd.discount_amount) AS total_discount
FROM product_discount pd
INNER JOIN products p ON pd.product_id = p.id
INNER JOIN product_discount_detail pdd ON pdd.id = pd.product_discount_detail_id
GROUP BY pdd.detail_name 
ORDER BY pdd.id DESC;`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(200).json(results);
    });
};

exports.GetAllProductDiscountSingle = (req, res) => {
    const { id } = req.params;

    const sql1 = `SELECT pd.*, p.*,p.detail_name FROM product_discount pd 
            INNER JOIN product_discount_detail p ON pd.product_discount_detail_id=p.id
            WHERE product_discount_detail_id = ?`;
    const sql = `SELECT pd.*, pdd.detail_name,p.pro_names,p.exclude_tax FROM product_discount pd 
                 INNER JOIN product_discount_detail pdd ON pd.product_discount_detail_id=pdd.id
                 INNER JOIN products p ON pd.product_id = p.id
            WHERE product_discount_detail_id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Discount not found" });
        }

        res.status(200).json(results);
    });
};

/// create success
exports.CreateProductDiscount = async (req, res) => {
    try {
        const { customerId, products } = req.body;

        // If no customerId is provided, create a new record in product_discount_detail
        let customerIdFromDB = customerId;
        if (!customerId) {
            // Insert into product_discount_detail table
            const { detail_name } = req.body; // You'll need to ensure detail_name is passed in the body
            const sqlCustomer = "INSERT INTO `product_discount_detail` (detail_name) VALUES (?)";
            const customerValues = [detail_name];
            const [customerResult] = await db.promise().query(sqlCustomer, customerValues);
            customerIdFromDB = customerResult.insertId;
        }

        // Insert products into the product_discount table
        for (const product of products) {
            const { product_id, discount_amount, date_start, date_end, user_at } = product;

            // Insert order details into the 'product_discount' table
            const sqlOrder = "INSERT INTO `product_discount` (product_discount_detail_id, product_id, discount_amount, date_start, date_end, user_at) VALUES (?, ?, ?, ?, ?, ?)";
            const orderValues = [customerIdFromDB, product_id, discount_amount, date_start, date_end, user_at];
            await db.promise().query(sqlOrder, orderValues);
        }

        // Respond with success message
        res.status(201).json({ message: 'Discount details and products created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the discount data' });
    }
};


exports.UpdateProductDiscount1 = async (req, res) => {
    try {
        const { detail_name, products } = req.body;
        let customerIdFromDB;

        // Validate inputs
        if (!detail_name || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                error: "Invalid request. Ensure detail_name and products array are provided and non-empty.",
            });
        }

        // Check if the detail_name already exists in the database
        const [existingCustomer] = await db.promise().query(
            "SELECT id FROM product_discount_detail WHERE detail_name = ?",
            [detail_name]
        );

        if (existingCustomer.length > 0) {
            // If exists, use the existing customerId
            customerIdFromDB = existingCustomer[0].id;
        } else {
            // If not exists, create a new entry and use the new customerId
            const sqlCustomer = "INSERT INTO product_discount_detail (detail_name) VALUES (?)";
            const [customerResult] = await db.promise().query(sqlCustomer, [detail_name]);
            customerIdFromDB = customerResult.insertId;
        }

        // Now handle product updates or inserts
        for (const product of products) {
            const { product_id, discount_amount, date_start, date_end, user_at } = product;

            // Validate product data
            if (!product_id || !discount_amount || !date_start || !date_end || !user_at) {
                return res.status(400).json({ error: 'Missing required fields for product discount.' });
            }

            // Ensure product exists in catalog
            const [existingProductInCatalog] = await db.promise().query(
                "SELECT 1 FROM products WHERE id = ?",
                [product_id]
            );
            if (existingProductInCatalog.length === 0) {
                return res.status(400).json({ error: `Product with id ${product_id} does not exist.` });
            }

            // Check if product already exists for the customerId
            const [existingProduct] = await db.promise().query(
                "SELECT * FROM product_discount WHERE product_discount_detail_id = ? AND product_id = ?",
                [customerIdFromDB, product_id]
            );

            if (existingProduct.length > 0) {
                // Update existing product
                const sqlUpdateProduct = `
                    UPDATE product_discount
                    SET discount_amount = ?, date_start = ?, date_end = ?, user_at = ?
                    WHERE product_discount_detail_id = ? AND product_id = ?
                `;
                const productValues = [discount_amount, date_start, date_end, user_at, customerIdFromDB, product_id];
                await db.promise().query(sqlUpdateProduct, productValues);
            } else {
                // Insert new product
                const sqlInsertProduct = `
                    INSERT INTO product_discount (product_discount_detail_id, product_id, discount_amount, date_start, date_end, user_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const productValues = [customerIdFromDB, product_id, discount_amount, date_start, date_end, user_at];
                await db.promise().query(sqlInsertProduct, productValues);
            }
        }

        res.status(200).json({ message: 'Discount details and products created/updated successfully' });

    } catch (err) {
        console.error('Error in UpdateProductDiscount:', err);
        res.status(500).json({ error: 'An error occurred while creating or updating the discount data' });
    }
};



exports.UpdateProductDiscount = async (req, res) => {
    try {
        const { detail_name, products, deletedProducts } = req.body;
        let customerIdFromDB;

        // Validate inputs
        if (!detail_name || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                error: "Invalid request. Ensure detail_name and products array are provided and non-empty.",
            });
        }

        // Step 1: Check if the `detail_name` already exists
        const [existingCustomer] = await db.promise().query(
            "SELECT id FROM product_discount_detail WHERE detail_name = ?",
            [detail_name]
        );

        if (existingCustomer.length > 0) {
            // If it exists, use the existing customerId
            customerIdFromDB = existingCustomer[0].id;
        } else {
            // If `detail_name` doesn't exist, insert a new record in `product_discount_detail`
            const sqlCustomer = "INSERT INTO product_discount_detail (detail_name) VALUES (?)";
            const [customerResult] = await db.promise().query(sqlCustomer, [detail_name]);
            customerIdFromDB = customerResult.insertId;
        }

        // Step 2: Process products
        for (const product of products) {
            const { product_id, discount_amount, date_start, date_end, user_at } = product;

            // Validate product data
            if (!product_id || !discount_amount || !date_start || !date_end || !user_at) {
                return res.status(400).json({ error: 'Missing required fields for product discount.' });
            }

            // Ensure product exists in catalog
            const [existingProductInCatalog] = await db.promise().query(
                "SELECT 1 FROM products WHERE id = ?",
                [product_id]
            );
            if (existingProductInCatalog.length === 0) {
                return res.status(400).json({ error: `Product with id ${product_id} does not exist.` });
            }

            // Check if the product already exists for the `product_discount_detail`
            const [existingProduct] = await db.promise().query(
                "SELECT * FROM product_discount WHERE product_discount_detail_id = ? AND product_id = ?",
                [customerIdFromDB, product_id]
            );

            if (existingProduct.length > 0) {
                // Update existing product
                const sqlUpdateProduct = `
                    UPDATE product_discount
                    SET discount_amount = ?, date_start = ?, date_end = ?, user_update = ?
                    WHERE product_discount_detail_id = ? AND product_id = ?
                `;
                const productValues = [discount_amount, date_start, date_end, user_at, customerIdFromDB, product_id];
                await db.promise().query(sqlUpdateProduct, productValues);
            } else {
                // Insert new product
                const sqlInsertProduct = `
                    INSERT INTO product_discount (product_discount_detail_id, product_id, discount_amount, date_start, date_end, user_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const productValues = [customerIdFromDB, product_id, discount_amount, date_start, date_end, user_at];
                await db.promise().query(sqlInsertProduct, productValues);
            }
        }

        // Step 3: Handle deleted products
        if (Array.isArray(deletedProducts) && deletedProducts.length > 0) {
            const deleteSql = "DELETE FROM product_discount WHERE product_discount_detail_id = ? AND product_id IN (?)";
            await db.promise().query(deleteSql, [customerIdFromDB, deletedProducts]);
            console.log(`Deleted products: ${deletedProducts}`);
        }

        res.status(200).json({ message: 'Discount details and products updated successfully' });

    } catch (err) {
        console.error('Error in UpdateProductDiscount:', err);
        res.status(500).json({ error: 'An error occurred while creating or updating the discount data' });
    }
};



exports.DeleteProductDiscount = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM product_discount WHERE product_discount_detail_id = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "No discount found with this ID" });
        }

        res.status(200).json({ message: "Product discount deleted successfully" });
    });
};



////  SET GLOBAL event_scheduler = ON;


// DELIMITER //

// CREATE EVENT update_product_discounts
// ON SCHEDULE EVERY 1 DAY
// STARTS CURRENT_TIMESTAMP
// DO
// BEGIN
//     -- Apply active discounts
//     UPDATE products p
//     JOIN product_discount pd ON p.id = pd.product_id
//     SET p.discount = pd.discount_amount
//     WHERE CURDATE() BETWEEN pd.date_start AND pd.date_end;

//     -- Reset expired discounts
//     UPDATE products p
//     SET p.discount = 0
//     WHERE p.id IN (SELECT product_id FROM product_discount WHERE date_end < CURDATE());
// END;
// //

// DELIMITER ;
