const db = require("../utile/db");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

//// use ing in page warrenty 
exports.GetAll = (req, res) => {
    const sql1 = `SELECT * from products`;
    const sql = ` SELECT pro.*, cat.cat_names, u.names AS unit_names, b.brand_names 
            FROM products AS pro
            LEFT JOIN category AS cat ON pro.category_id = cat.id
            LEFT JOIN unit AS u ON pro.unit_id = u.id
            LEFT JOIN brands AS b ON pro.brand_id = b.id`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
}

// exports.GetAllProduct = async (req, res) => {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const searchQuery = req.query.search_query || "";
//     const offset = (page - 1) * limit;

//     try {
//         // Get total count
//         const [countResults] = await db.promise().query(`
//             SELECT COUNT(*) AS total 
//             FROM products 
//             WHERE pro_names LIKE ?
//         `, [`%${searchQuery}%`]);
//         const totalCategory = countResults[0].total;
//         const totalPages = Math.ceil(totalCategory / limit);

//         // Get paginated data
//         const [results] = await db.promise().query(`
//             SELECT pro.*, cat.cat_names, u.names AS unit_names, b.brand_names 
//             FROM products AS pro 
//             LEFT JOIN category AS cat ON pro.category_id = cat.id
//             INNER JOIN unit AS u ON pro.unit_id = u.id
//             LEFT JOIN brands AS b ON pro.brand_id = b.id
//             WHERE pro.pro_names LIKE ?
//             ORDER BY pro.id DESC
//             LIMIT ? OFFSET ?
//         `, [`%${searchQuery}%`, limit, offset]);

//         res.json({
//             product: results,
//             totalPages,
//             currentPage: page,
//             totalCategory,
//         });
//     } catch (err) {
//         console.error('Database query error:', err);
//         res.status(500).json({ error: 'Database query error' });
//     }
// };


exports.GetAllProduct = async (req, res) => {
    const page = parseInt(req.query.page, 25) || 1;  // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 25) || 25;  // Default to 10 results per page
    const searchQuery = req.query.search_query || '';  // Default to empty search query
    const categoryId = req.query.category_id || '';  // Optional filter for category
    const brandId = req.query.brand_id || '';  // Optional filter for brand
    const offset = (page - 1) * limit;  // Calculate offset for pagination

    try {
        // Get total count of products with search and optional filters
        let countQuery = `SELECT COUNT(*) AS total FROM products WHERE pro_names LIKE ?`;
        let countParams = [`%${searchQuery}%`];

        // Add category filter if provided
        if (categoryId) {
            countQuery += ` AND category_id = ?`;
            countParams.push(categoryId);
        }

        // Add brand filter if provided
        if (brandId) {
            countQuery += ` AND brand_id = ?`;
            countParams.push(brandId);
        }

        const [countResults] = await db.promise().query(countQuery, countParams);
        const totalCategory = countResults[0].total;
        const totalPages = Math.ceil(totalCategory / limit);

        // Get paginated product data with search and optional filters
        let dataQuery = `
            SELECT pro.*, cat.cat_names, u.names AS unit_names, b.brand_names 
            FROM products AS pro
            LEFT JOIN category AS cat ON pro.category_id = cat.id
            LEFT JOIN unit AS u ON pro.unit_id = u.id
            LEFT JOIN brands AS b ON pro.brand_id = b.id
            WHERE pro.pro_names LIKE ?
        `;
        let dataParams = [`%${searchQuery}%`];

        // Apply category filter if provided
        if (categoryId) {
            dataQuery += ` AND pro.category_id = ?`;
            dataParams.push(categoryId);
        }

        // Apply brand filter if provided
        if (brandId) {
            dataQuery += ` AND pro.brand_id = ?`;
            dataParams.push(brandId);
        }

        // Apply pagination
        dataQuery += ` ORDER BY pro.id DESC LIMIT ? OFFSET ?`;
        dataParams.push(limit, offset);

        const [results] = await db.promise().query(dataQuery, dataParams);

        // Return paginated products with additional metadata
        res.json({
            product: results,
            totalPages,
            currentPage: page,
            totalCategory,
        });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database query error' });
    }
};


//// use ing in page viewproduct POS
exports.GetAllProductAll = (req, res) => {
    const { category_id, brand_id } = req.query;

    // Start building the SQL query
    let sql = `
      SELECT pro.*, pro.brand_id, cat.cat_names, pro.category_id, u.names AS unit_names, b.brand_names 
      FROM products AS pro
      LEFT JOIN category AS cat ON pro.category_id = cat.id
      LEFT JOIN unit AS u ON pro.unit_id = u.id
      LEFT JOIN brands AS b ON pro.brand_id = b.id
    `;

    let conditions = [];
    let values = [];

    conditions.push("pro.status = 'active'");

    if (category_id) {
        conditions.push(`pro.category_id = ?`);
        values.push(category_id);
    }

    if (brand_id) {
        conditions.push(`pro.brand_id = ?`);
        values.push(brand_id);
    }

    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }

    // Order by product ID in descending order
    sql += ` ORDER BY pro.id DESC`;

    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};



//// use ing in page viewproduct POS test
exports.GetAllProductAll1 = (req, res) => {
    const { category_id, brand_id } = req.query;

    // Start building the SQL query
    let sql = `
      SELECT pro.*, pro.brand_id, cat.cat_names, pro.category_id, u.names AS unit_names, b.brand_names 
      FROM products AS pro
      LEFT JOIN category AS cat ON pro.category_id = cat.id
      LEFT JOIN unit AS u ON pro.unit_id = u.id
      LEFT JOIN brands AS b ON pro.brand_id = b.id
    `;

    let sql1 = `
    SELECT pro.*, pro.brand_id, cat.cat_names, pro.category_id, u.names AS unit_names, b.brand_names 
    FROM products AS pro
    LEFT JOIN category AS cat ON pro.category_id = cat.id
    LEFT JOIN unit AS u ON pro.unit_id = u.id
    LEFT JOIN brands AS b ON pro.brand_id = b.id where pro.status = 'active'
  `;

    let conditions = [];
    let values = [];

    if (category_id) {
        conditions.push(`pro.category_id = ?`);
        values.push(category_id);
    }

    if (brand_id) {
        conditions.push(`pro.brand_id = ?`);
        values.push(brand_id);
    }

    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY pro.id DESC`;

    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};


// Create data products
exports.Createproduct = (req, res) => {
    const { pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, description, user_at } = req.body;
    const image = req.file ? req.file.filename : null;
    const checkQuery = 'SELECT * FROM products WHERE pro_names = ?';
    db.query(checkQuery, [pro_names], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error checking for existing product');
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Product with this name already exists.' });
        }
        const query = 'INSERT INTO products (pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit,expiry, type_of_tax,product_type, image, description, user_at) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, image, description, user_at], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating product');
            }
            res.status(201).json(result);
        });
    });
};






// Create data CreateproductBa
exports.CreateproductBa = (req, res) => {
    const { pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, description, user_at, barcode_type } = req.body;
    const uniqueNumber = uuidv4().replace(/-/g, '').slice(0, 11);
    const numericOnly = uniqueNumber.replace(/\D/g, '');
    const paddedNumber = numericOnly.padStart(11, '0');
    const barcode_value = `${paddedNumber}`;
    const image = req.file ? req.file.filename : null;
    const checkQuery = 'SELECT * FROM products WHERE pro_names = ?';
    db.query(checkQuery, [pro_names], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error checking for existing product');
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Product with this name already exists.' });
        }
        const query = 'INSERT INTO products (pro_names, category_id, brand_id, unit_id, note_qty,mg_stock, cost_price, include_tax, exclude_tax, profit,expiry, type_of_tax,product_type, image,barcode, description, user_at,barcode_type) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?, ?,?, ?)';
        db.query(query, [pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, image, barcode_value, description, user_at, barcode_type], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating product');
            }
            res.status(201).json(result);
        });
    });
};



// Update product
// exports.Updateproduct = (req, res) => {
//     const { id } = req.params;
//     const { pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, description, user_at } = req.body;
//     let newImage = req.file ? req.file.filename : null;

//     // Check if another product with the same pro_names exists, excluding the current product
//     const checkQuery = 'SELECT * FROM products WHERE pro_names = ? AND id != ?';
//     db.query(checkQuery, [pro_names, id], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error checking for existing product');
//         }
//         if (results.length > 0) {
//             return res.status(400).json({ message: ' name already exists.' });
//         }

//         db.query('SELECT image FROM products WHERE id = ?', [id], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Error fetching old image');
//             }

//             if (result.length === 0) {
//                 return res.status(404).send('Product not found');
//             }

//             const oldImage = result[0].image;
//             if (newImage) {
//                 if (oldImage) {
//                     fs.unlink(path.join(__dirname, '../public/image', oldImage), (err) => {
//                         if (err) console.log('Failed to delete old image:', err);
//                     });
//                 }
//             } else {
//                 newImage = oldImage;
//             }
//             db.query(
//                 'UPDATE products SET pro_names=?, category_id=?, brand_id=?, unit_id=?, note_qty=?, cost_price=?, include_tax=?, exclude_tax=?, profit=?, expiry=?, type_of_tax=?, product_type=?, image=?, description=?, user_update=? WHERE id=?',
//                 [pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, newImage, description, user_at, id],
//                 (err, result) => {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).send('Error updating product');
//                     }
//                     res.json({ message: 'Product updated successfully', result });
//                 }
//             );
//         });
//     });
// };



// exports.Updateproduct = (req, res) => {
//     const { id } = req.params;
//     const { pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit, status, type_of_tax, product_type, description, user_at } = req.body;
//     let newImage = req.file ? req.file.filename : null;

//     // Check if another product with the same pro_names exists, excluding the current product
//     const checkQuery = 'SELECT * FROM products WHERE pro_names = ? AND id != ?';
//     db.query(checkQuery, [pro_names, id], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error checking for existing product');
//         }
//         if (results.length > 0) {
//             return res.status(400).json({ message: ' name already exists.' });
//         }

//         db.query('SELECT image FROM products WHERE id = ?', [id], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Error fetching old image');
//             }

//             if (result.length === 0) {
//                 return res.status(404).send('Product not found');
//             }

//             const oldImage = result[0].image;
//             if (newImage) {
//                 if (oldImage) {
//                     fs.unlink(path.join(__dirname, '../public/image', oldImage), (err) => {
//                         if (err) console.log('Failed to delete old image:', err);
//                     });
//                 }
//             } else {
//                 newImage = oldImage;
//             }
//             db.query(
//                 `UPDATE products 
//                  SET pro_names=?, 
//                      category_id=?, 
//                      brand_id=?, 
//                      unit_id=?, 
//                      note_qty=?, 
//                      cost_price=?, 
//                      include_tax=?, 
//                      exclude_tax=?, 
//                      profit=?, 
//                      status=?, 
//                      type_of_tax=?, 
//                      product_type=?, 
//                      image=?, 
//                      description=?, 
//                      user_update=? 
//                       WHERE id=?`,
//                 [pro_names, category_id, brand_id, unit_id, note_qty, cost_price, include_tax, exclude_tax, profit, status, type_of_tax, product_type, newImage, description, user_at, id],
//                 (err, result) => {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).send('Error updating product');
//                     }
//                     res.json({ message: 'Product updated successfully', result });
//                 }
//             );

//         });
//     });
// };


exports.Updateproduct = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Log the status received for debugging purposes
    console.log("Received status:", status);

    // Check if status is provided
    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }

    const sql = "UPDATE products SET `status` = ? WHERE id = ?";

    // Execute the update query
    db.query(sql, [status, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        // Check if any rows were affected, meaning an update occurred
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Product with ID ${id} not found.` });
        }

        // Send a success response
        res.json({ message: "Product status updated successfully", data: results });
    });
};




//// update product status use ing in page product lsit
exports.UpdateproductStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }
    const sql = "UPDATE products SET `status` = ? WHERE id = ?";

    db.query(sql, [status, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Product with ID ${id} not found.` });
        }
        res.json({ message: "Product status updated successfully", data: results });
    });
};

/// useing  page updateproduct page
// exports.UpdateproductBa = (req, res) => {
//     const { id } = req.params;
//     const { pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, description, user_at, barcode_type } = req.body;
//     const image = req.file ? req.file.filename : null;

//     const sql = "UPDATE products SET pro_names=?, category_id=?, brand_id=?, unit_id=?, note_qty=?,mg_stock=?, cost_price=?, include_tax=?, exclude_tax=?, profit=?,expiry=?, type_of_tax=?,product_type=?, image=?, description=?, user_update=?,barcode_type=? WHERE id = ?";

//     db.query(sql, [pro_names, category_id, brand_id, unit_id, note_qty,mg_stock, cost_price, include_tax, exclude_tax, profit,expiry, type_of_tax,product_type, image, description, user_at,barcode_type, id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err });
//         }

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: `Product with ID ${id} not found.` });
//         }

//         // Send a success response
//         res.json({ message: "Product status updated successfully", data: results });
//     });
// };


exports.UpdateproductBa1 = (req, res) => {
    const { id } = req.params;
    const { pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, description, user_at, barcode_type } = req.body;
    const image = req.file ? req.file.filename : null;

    const checkQuery = 'SELECT * FROM products WHERE pro_names = ? AND id != ?';
    db.query(checkQuery, [pro_names, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: `Product with name ${pro_names} already exists.` });
        }
        const sql = "UPDATE products SET pro_names=?, category_id=?, brand_id=?, unit_id=?, note_qty=?, mg_stock=?, cost_price=?, include_tax=?, exclude_tax=?, profit=?, expiry=?, type_of_tax=?, product_type=?, image=?, description=?, user_update=?, barcode_type=? WHERE id = ?";
        db.query(sql, [pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, image, description, user_at, barcode_type, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Product with ID ${id} not found.` });
            }

            res.json({ message: "Product status updated successfully", data: results });
        });
    });
};


exports.UpdateproductBa = (req, res) => {
    const { id } = req.params;
    const { pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, description, user_at, barcode_type } = req.body;
    let newImage = req.file ? req.file.filename : null;

    // Check if another product with the same pro_names exists, excluding the current product
    const checkQuery = 'SELECT * FROM products WHERE pro_names = ? AND id != ?';
    db.query(checkQuery, [pro_names, id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error checking for existing product');
        }
        if (results.length > 0) {
            return res.status(400).json({ message: ' name already exists.' });
        }

        db.query('SELECT image FROM products WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching old image');
            }

            if (result.length === 0) {
                return res.status(404).send('Product not found');
            }

            const oldImage = result[0].image;
            if (newImage) {
                if (oldImage) {
                    fs.unlink(path.join(__dirname, '../public/image', oldImage), (err) => {
                        if (err) console.log('Failed to delete old image:', err);
                    });
                }
            } else {
                newImage = oldImage;
            }
            db.query(
                `UPDATE products 
                 SET pro_names=?, category_id=?, brand_id=?, unit_id=?, note_qty=?, mg_stock=?, cost_price=?, include_tax=?, exclude_tax=?, profit=?, expiry=?, type_of_tax=?, product_type=?, image=?, description=?, user_update=?, barcode_type=? WHERE id=?`,
                [pro_names, category_id, brand_id, unit_id, note_qty, mg_stock, cost_price, include_tax, exclude_tax, profit, expiry, type_of_tax, product_type, newImage, description, user_at, barcode_type, id],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error updating product');
                    }
                    res.json({ message: 'Product updated successfully', result });
                }
            );

        });
    });
};



exports.GetSingle = (req, res) => {
    const { id } = req.params; // Assume `id` is for category or unit ID
    const sql = `SELECT pro.*, cat.cat_names, u.names as unit_names, b.brand_names
                FROM products as pro
                LEFT JOIN category as cat ON pro.category_id = cat.id
                INNER JOIN unit as u ON pro.unit_id = u.id
                LEFT JOIN brands as b ON pro.brand_id = b.id
                WHERE cat.id = ? OR b.id = ?`;

    db.query(sql, [id, id], (err, results) => { // Provide `id` for both parameters
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};




/// useing price product update and print page
exports.GetProductID = (req, res) => {
    const { id } = req.params; // Assume `id` is for category or unit ID
    const sql = `SELECT pro.*, cat.cat_names, u.names as unit_names, b.brand_names
                FROM products as pro
                LEFT JOIN category as cat ON pro.category_id = cat.id
                INNER JOIN unit as u ON pro.unit_id = u.id
                LEFT JOIN brands as b ON pro.brand_id = b.id
                WHERE pro.id  = ?`;

    db.query(sql, [id, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.Deleteproduct = (req, res) => {
    const { id } = req.params;

    db.query('SELECT image FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Error fetching image');
        const image = result[0].image;
        if (image) {
            fs.unlink(path.join(__dirname, '../public/image', image), err => {
                if (err) console.log('Failed to delete image:', err);
            });
        }
    });

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).send('Error deleting product');
        }
        res.json(result);
    });

};
