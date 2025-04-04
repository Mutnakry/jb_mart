const db = require("../utile/db");


exports.GetAllPuchase = (req, res) => {
  const page = parseInt(req.query.page, 25) || 1;
  const limit = parseInt(req.query.limit, 25) || 25;
  const searchQuery = req.query.search_query || "";
  const offset = (page - 1) * limit;

  // Query to get the total number of items that match the search query
  const countQuery = `
  SELECT COUNT(*) AS total 
  FROM supplier AS su
  INNER JOIN purchase AS pu ON su.id = pu.supplier_id
  INNER JOIN products AS pro ON pu.product_id = pro.id
  WHERE pro.pro_names LIKE ?
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
        SELECT pu.*,su.business_names,su.full_names,pro.pro_names,pro.image FROM purchase as pu
        INNER JOIN supplier as su ON pu.supplier_id = su.id
        INNER JOIN products as pro ON pu.product_id = pro.id
          WHERE pro.pro_names LIKE ?
          ORDER BY id DESC
          LIMIT ? OFFSET ?
      `;
    db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({
        purchase: results,
        totalPages,
        currentPage: page,
        totalCategory,
      });
    });
  });
};


exports.GetAllPuchase1 = (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const searchQuery = req.query.search_query || "";
  const offset = (page - 1) * limit;

  // Query to get the total count of grouped purchases
  const countQuery = `
    SELECT COUNT(DISTINCT pu.purchasedetail_id) AS total 
    FROM purchase AS pu
    INNER JOIN supplier AS su ON su.id = pu.supplier_id
    INNER JOIN products AS pro ON pu.product_id = pro.id
    WHERE pro.pro_names LIKE ?
  `;

  db.query(countQuery, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error('Error fetching count:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    const totalCategory = results[0].total;
    const totalPages = Math.ceil(totalCategory / limit);

    // Query to get grouped purchase data with pagination
    const selectQuery = `
      SELECT 
        p.purchasedetail_id,
        p.*,su.business_names,su.full_names,pro.pro_names,pro.image,
        MIN(p.date_by) AS purchase_date,
        SUM(p.qty) AS total_qty,
        SUM(p.total) AS total_amount,
        GROUP_CONCAT(pro.pro_names SEPARATOR ', ') AS product_names,
        MAX(su.business_names) AS business_names,
        MAX(su.full_names) AS supplier_name
      FROM purchase p
      INNER JOIN supplier su ON p.supplier_id = su.id
      INNER JOIN products pro ON p.product_id = pro.id
      WHERE pro.pro_names LIKE ?
      GROUP BY p.purchasedetail_id
      ORDER BY p.purchasedetail_id DESC
      LIMIT ? OFFSET ?;
    `;

    db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      res.json({
        purchase: results,
        totalPages,
        currentPage: page,
        totalCategory,
      });
    });
  });
};



exports.GetAllDetailPurchase2 = (req, res) => {

  const selectQuery = `
    SELECT 
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
      ORDER BY p.purchasedetail_id DESC
    `;

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });

};

exports.GetAllDetailPurchase = (req, res) => {
  const page = parseInt(req.query.page, 25) || 1;
  const limit = parseInt(req.query.limit, 25) || 25;
  const searchQuery = req.query.search_query || "";
  const offset = (page - 1) * limit;

  // Query to get the paginated and filtered data
  const selectQuery = `
    SELECT 
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
    WHERE 
        su.business_names LIKE ? OR 
        su.full_names LIKE ? OR 
        pro.pro_names LIKE ?
    GROUP BY p.purchasedetail_id
    ORDER BY p.purchasedetail_id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(selectQuery, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    // Query to get the total number of items
    const countQuery = `
      SELECT COUNT(DISTINCT p.purchasedetail_id) AS total
      FROM purchase p
      INNER JOIN supplier su ON p.supplier_id = su.id
      INNER JOIN products pro ON p.product_id = pro.id
      INNER JOIN purchase_detail pd ON pd.id = p.purchasedetail_id
      WHERE 
          su.business_names LIKE ? OR 
          su.full_names LIKE ? OR 
          pro.pro_names LIKE ?
    `;

    db.query(countQuery, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`], (err, countResults) => {
      if (err) {
        console.error("Error fetching count:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      const totalCategory = countResults[0].total;
      const totalPages = Math.ceil(totalCategory / limit);

      res.json({
        purchase: results,
        totalPages,
        currentPage: page,
        totalCategory,
      });
    });
  });
};




exports.CreatePurchase = async (req, res) => {
  try {
    const { customerId, products } = req.body;

    let customerIdFromDB = customerId;
    if (!customerId) {
      const { paymenttype_id, account_id, amount_total, amount_discount, amount_pay, pay_date } = req.body;
      const sqlCustomer = "INSERT INTO `purchase_detail` (paymenttype_id,account_id,amount_total,amount_discount,amount_pay,pay_date) VALUES (?,?,?,?,?,?)";
      const customerValues = [paymenttype_id, account_id, amount_total, amount_discount, amount_pay, pay_date];
      const [customerResult] = await db.promise().query(sqlCustomer, customerValues);
      customerIdFromDB = customerResult.insertId;
    }

    // Calculate total and insert orders
    for (const product of products) {
      const { supplier_id, product_id, date_by, qty, discount, cost_price, included_tax, excluded_tax, total, status, user_at } = product;

      // Insert order details into the 'order' table
      const sqlOrder = "INSERT INTO `purchase` (supplier_id,product_id,purchasedetail_id,date_by,qty,discount,cost_price,include_tax,exclude_tax,total,status,user_at) VALUES (?, ?, ?, ?,? ,?, ?, ?, ?, ?,?,?)";
      const orderValues = [supplier_id, product_id, customerIdFromDB, date_by, qty, discount, cost_price, included_tax, excluded_tax, total, status, user_at];
      await db.promise().query(sqlOrder, orderValues);
    }

    // Respond with success message
    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
};



/// get data  update purchase
exports.UpdatePurchase1 = async (req, res) => {
  try {
    const {
      customerId,
      products,
      paymenttype_id,
      account_id,
      amount_total,
      amount_discount,
      amount_pay,
      pay_date,
    } = req.body;

    // Validation
    if (!customerId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Invalid request. Ensure customerId and products array are provided and non-empty.",
      });
    }

    // Update `purchase_detail` table
    const sqlUpdateCustomer = `
      UPDATE purchase_detail
      SET
        paymenttype_id = ?,
        account_id = ?,
        amount_total = ?,
        amount_discount = ?,
        amount_pay = ?,
        pay_date = ?
      WHERE id = ?
    `;
    const customerValues = [
      paymenttype_id,
      account_id,
      amount_total,
      amount_discount,
      amount_pay,
      pay_date,
      customerId,
    ];
    const [customerUpdateResult] = await db.promise().query(sqlUpdateCustomer, customerValues);

    if (customerUpdateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found or no changes made." });
    }

    console.log(`Updated purchase_detail for customerId: ${customerId}`);

    // Iterate through products and update `purchase` table
    const productResults = [];
    for (const product of products) {
      const {
        supplier_id,
        product_id,
        date_by,
        qty,
        discount,
        cost_price,
        included_tax,
        excluded_tax,
        total,
        status,
        user_at,
      } = product;

      // Check if product exists in `purchase` table
      const [existingProduct] = await db
        .promise()
        .query("SELECT 1 FROM purchase WHERE purchasedetail_id = ? AND product_id = ?", [
          customerId,
          product_id,
        ]);

      if (existingProduct.length > 0) {
        // Update existing product record
        const sqlUpdateProduct = `
          UPDATE purchase
          SET
            supplier_id = ?,
            date_by = ?,
            qty = ?,
            discount = ?,
            cost_price = ?,
            include_tax = ?,
            exclude_tax = ?,
            total = ?,
            status = ?,
            user_update = ?
          WHERE purchasedetail_id = ? AND product_id = ?
        `;
        const productValues = [
          supplier_id,
          date_by,
          qty,
          discount,
          cost_price,
          included_tax,
          excluded_tax,
          total,
          status,
          user_at,
          customerId,
          product_id,
        ];
        const [updateResult] = await db.promise().query(sqlUpdateProduct, productValues);
        productResults.push({ product_id, action: "updated", affectedRows: updateResult.affectedRows });
      } else {
        // Insert new product record if not found
        const sqlInsertProduct = `
          INSERT INTO purchase
          (supplier_id, product_id, purchasedetail_id, date_by, qty, discount, cost_price, include_tax, exclude_tax, total, status, user_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const productValues = [
          supplier_id,
          product_id,
          customerId,
          date_by,
          qty,
          discount,
          cost_price,
          included_tax,
          excluded_tax,
          total,
          status,
          user_at,
        ];
        const [insertResult] = await db.promise().query(sqlInsertProduct, productValues);
        productResults.push({ product_id, action: "inserted", affectedRows: insertResult.affectedRows });
      }
    }

    res.status(200).json({
      message: "Purchase updated successfully.",
      productResults,
    });
  } catch (err) {
    console.error("Error in UpdatePurchase:", err);
    res.status(500).json({ error: "An error occurred while updating the purchase." });
  }
};


/// get data  update purchase​ success 
exports.UpdatePurchase = async (req, res) => {
  try {
    const {
      customerId,
      products,
      paymenttype_id,
      account_id,
      amount_total,
      amount_discount,
      amount_pay,
      pay_date,
      deletedProducts, // Added deletedProducts to handle deletion
    } = req.body;

    // Validation
    if (!customerId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Invalid request. Ensure customerId and products array are provided and non-empty.",
      });
    }

    // Update `purchase_detail` table
    const sqlUpdateCustomer = `
      UPDATE purchase_detail
      SET
        paymenttype_id = ?,
        account_id = ?,
        amount_total = ?,
        amount_discount = ?,
        amount_pay = ?,
        pay_date = ?
      WHERE id = ?
    `;
    const customerValues = [
      paymenttype_id,
      account_id,
      amount_total,
      amount_discount,
      amount_pay,
      pay_date,
      customerId,
    ];
    const [customerUpdateResult] = await db.promise().query(sqlUpdateCustomer, customerValues);

    if (customerUpdateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found or no changes made." });
    }

    console.log(`Updated purchase_detail for customerId: ${customerId}`);

    // Step 1: Delete the products that were marked for deletion
    if (Array.isArray(deletedProducts) && deletedProducts.length > 0) {
      const deleteSql = "DELETE FROM purchase WHERE purchasedetail_id = ? AND product_id IN (?)";
      await db.promise().query(deleteSql, [customerId, deletedProducts]);
      console.log(`Deleted products: ${deletedProducts}`);
    }

    // Step 2: Update or insert the new products as before
    const productResults = [];
    for (const product of products) {
      const {
        supplier_id,
        product_id,
        date_by,
        qty,
        discount,
        cost_price,
        included_tax,
        excluded_tax,
        total,
        status,
        user_at,
      } = product;

      // Check if product exists in `purchase` table
      const [existingProduct] = await db
        .promise()
        .query("SELECT 1 FROM purchase WHERE purchasedetail_id = ? AND product_id = ?", [
          customerId,
          product_id,
        ]);

      if (existingProduct.length > 0) {
        // Update existing product record
        const sqlUpdateProduct = `
          UPDATE purchase
          SET
            supplier_id = ?,
            date_by = ?,
            qty = ?,
            discount = ?,
            cost_price = ?,
            include_tax = ?,
            exclude_tax = ?,
            total = ?,
            status = ?,
            user_update = ?
          WHERE purchasedetail_id = ? AND product_id = ?
        `;
        const productValues = [
          supplier_id,
          date_by,
          qty,
          discount,
          cost_price,
          included_tax,
          excluded_tax,
          total,
          status,
          user_at,
          customerId,
          product_id,
        ];
        const [updateResult] = await db.promise().query(sqlUpdateProduct, productValues);
        productResults.push({ product_id, action: "updated", affectedRows: updateResult.affectedRows });
      } else {
        // Insert new product record if not found
        const sqlInsertProduct = `
          INSERT INTO purchase
          (supplier_id, product_id, purchasedetail_id, date_by, qty, discount, cost_price, include_tax, exclude_tax, total, status, user_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const productValues = [
          supplier_id,
          product_id,
          customerId,
          date_by,
          qty,
          discount,
          cost_price,
          included_tax,
          excluded_tax,
          total,
          status,
          user_at,
        ];
        const [insertResult] = await db.promise().query(sqlInsertProduct, productValues);
        productResults.push({ product_id, action: "inserted", affectedRows: insertResult.affectedRows });
      }
    }

    res.status(200).json({
      message: "Purchase updated successfully.",
      productResults,
    });
  } catch (err) {
    console.error("Error in UpdatePurchase:", err);
    res.status(500).json({ error: "An error occurred while updating the purchase." });
  }
};



exports.DeletePurchase = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM purchase WHERE id = $1";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
}




/// get data  update and print purchase by id
exports.GetSinglePuchase = (req, res) => {
  const { id } = req.params; // Assume `id` is for category or unit ID
  const sql1 = `SELECT p.*,d.*,pro.pro_names FROM purchase as p 
INNER JOIN purchase_detail as d on p.purchasedetail_id = d.id 
inner JOIN products pro ON pro.id = p.product_id
WHERE p.purchasedetail_id = ?`;

  const sql = `SELECT p.*,d.*,s.*,pro.* FROM purchase as p 
INNER JOIN purchase_detail as d on p.purchasedetail_id = d.id 
inner JOIN V_Nameproducts pro ON pro.id = p.product_id
INNER JOIN supplier s On s.id = p.supplier_id
WHERE p.purchasedetail_id = ?`;
  db.query(sql, [id], (err, results) => { // Provide `id` for both parameters
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};



exports.GetSingle = (req, res) => {
  const { id } = req.params; // Assume `id` is for `purchasedetail_id`

  // First, query to fetch the main purchase details
  const purchaseQuery = `
    SELECT * FROM purchase_detail WHERE id = ?
  `;

  db.query(purchaseQuery, [id], (err, purchaseResults) => {
    if (err) {
      return res.status(500).send({ error: "Error fetching purchase details", details: err });
    }

    if (purchaseResults.length === 0) {
      return res.status(404).json({ error: "Purchase detail not found" });
    }

    // Extract the customerId from the purchase results
    const customerId = purchaseResults[0].customer_id;

    // Next, fetch the products associated with this purchase
    const productsQuery = `
    SELECT 
    pu.supplier_id, 
    pu.product_id, 
    pu.date_by, 
    pu.qty, 
    pu.discount, 
    pu.cost_price, 
    pu.included_tax, 
    pu.excluded_tax, 
    pu.total, 
    pu.status, 
    pu.user_at,
    pro.pro_names AS product_name,
    pd.amount_total
    FROM purchase pu
    INNER JOIN products pro ON pu.product_id = pro.id
    INNER JOIN purchase_detail pd ON pu.purchasedetail_id = pd.id
    WHERE pu.purchasedetail_id = ?
    `;

    db.query(productsQuery, [id], (err, productResults) => {
      if (err) {
        return res.status(500).send({ error: "Error fetching product details", details: err });
      }

      if (productResults.length === 0) {
        return res.status(404).json({ error: "No products found for this purchase detail" });
      }

      // Construct the JSON response with the customer and product data
      const response = {
        customerId: customerId,
        products: productResults.map(product => ({
          supplier_id: product.supplier_id,
          product_id: product.product_id,
          date_by: product.date_by,
          qty: product.qty,
          discount: product.discount,
          cost_price: product.cost_price,
          included_tax: product.included_tax,
          excluded_tax: product.excluded_tax,
          total: product.total,
          status: product.status,
          user_at: product.user_at,
          product_name: product.product_name
        })),
        paymenttype_id: purchaseResults[0].paymenttype_id,
        account_id: purchaseResults[0].account_id,
        amount_total: purchaseResults[0].amount_total,
        amount_discount: purchaseResults[0].amount_discount,
        amount_pay: purchaseResults[0].amount_pay,
        pay_date: purchaseResults[0].pay_date
      };

      // Return the formatted JSON response
      res.json(response);
    });
  });
};

/// get data  update purchase status
exports.UpdatePurchaseStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updateSql = "UPDATE purchase SET status=? WHERE purchasedetail_id=?";
  db.query(updateSql, [status, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: "successfully", data: results });
  });

};



exports.GetPurchaseUpdateByID = async (req, res) => {
  try {
    const { id } = req.params; // purchaseId from URL parameter
    const { purchasedetail_id } = req.query; // customerId from query parameters

    // Ensure both customerId and purchaseId are provided
    if (!purchasedetail_id || !id) {
      return res.status(400).json({ error: 'customerId and purchaseId are required' });
    }

    // Fetch the purchase details for the given purchaseId and customerId
    const [purchaseRows] = await db.promise().query(
      "SELECT * FROM purchase WHERE id = ? AND purchasedetail_id = ?",
      [id, purchasedetail_id]
    );

    if (purchaseRows.length === 0) {
      return res.status(404).json({ error: 'Purchase record not found' });
    }

    // Fetch the associated products based on the purchaseId
    const [productRows] = await db.promise().query(
      "SELECT * FROM purchase_detail WHERE id = ?",
      [id]
    );

    // Respond with purchase details and related products
    res.status(200).json({
      message: 'Purchase record retrieved successfully',
      purchase: purchaseRows[0],  // Assuming there is only one matching record
      products: productRows,      // Array of related products
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the purchase record' });
  }
};

exports.GetAllPuchaseDetail = (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const searchQuery = req.query.search_query || "";
  const offset = (page - 1) * limit;

  // Query to get the total number of items that match the search query
  const countQuery = `
      SELECT COUNT(*) AS total 
      FROM purchase_detail 
      WHERE account_id LIKE ?
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
          FROM purchase_detail 
          WHERE account_id LIKE ?
          ORDER BY id DESC
          LIMIT ? OFFSET ?
      `;
    db.query(selectQuery, [`%${searchQuery}%`, limit, offset], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({
        purchase: results,
        totalPages,
        currentPage: page,
        totalCategory,
      });
    });
  });
};


// in table puchase\

// SELECT
//     p.purchasedetail_id,
//     MIN(p.date_by) AS purchase_date,
//     SUM(p.qty) AS total_qty,
//     SUM(p.total) AS total_amount,
//     MAX(p.purchasedetail_id) AS supplier_name
// FROM purchase p
// GROUP BY p.purchasedetail_id
// ORDER BY p.purchasedetail_id;