
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utile/db');


// Users
exports.Users = (req, res) => {
  const sql = "SELECT * From users";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
}


// GEt Data Single acount
exports.GetUserID = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * From users  where id=?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results[0]);
  });
}

exports.checkUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const sql = "SELECT user_pass FROM users WHERE id=?";
  db.query(sql, [id], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.user_pass);

    if (isMatch) {
      res.json({ success: true, message: "Password is correct" });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password" });
    }
  });
};





// Register user
exports.register = async (req, res) => {
  try {
    const { names, email, pass, rol } = req.body;

    // Check if email already exists
    const emailCheckQuery = 'SELECT user_email FROM users WHERE user_email = ?';
    db.query(emailCheckQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).send('Error checking email');
      }
      if (results.length > 0) {
        return res.status(400).send('Email already in use');
      }
      const hashedPassword = await bcrypt.hash(pass, 8);
      const insertQuery = 'INSERT INTO users (user_names, user_email, user_pass, user_rol) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [names, email, hashedPassword, rol], (err, result) => {
        if (err) {
          return res.status(500).send('Error registering user');
        }
        res.status(201).send('User registered successfully');
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
};

// Login user
exports.login = (req, res) => {
  const { email, pass } = req.body;

  const query = 'SELECT * FROM users WHERE user_email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error logging in');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(pass, user.user_pass);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, rol: user.user_rol },
      'your_jwt_secret',
      { expiresIn: 86400 }
    );
    res.status(200).send({
      auth: true,
      token,
      user_id: user.id,
      user_rol: user.user_rol,
      user_names: user.user_names,
      user_email: user.user_email,
    });
  });
};



// Update user
// exports.updateUser = async (req, res) => {
//   try {
//     const { id, names, email, pass, rol } = req.body;

//     // Check if user exists
//     const userCheckQuery = 'SELECT * FROM users WHERE id = ?';

//     // Execute the query
//     const userResults = await db.query(userCheckQuery, [id]);

//     // Assuming userResults is an array of results
//     if (userResults.length === 0) {
//       return res.status(404).send('User not found');
//     }

//     // Prepare the update query
//     let updateFields = [];
//     let updateValues = [];

//     if (names) {
//       updateFields.push('user_names = ?');
//       updateValues.push(names);
//     }
//     if (email) {
//       updateFields.push('user_email = ?');
//       updateValues.push(email);
//     }
//     if (pass) {
//       const hashedPassword = await bcrypt.hash(pass, 8);
//       updateFields.push('user_pass = ?');
//       updateValues.push(hashedPassword);
//     }
//     if (rol) {
//       updateFields.push('user_rol = ?');
//       updateValues.push(rol);
//     }

//     // If no fields to update, return a response
//     if (updateFields.length === 0) {
//       return res.status(400).send('No fields to update');
//     }

//     // Combine the fields and values
//     const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
//     updateValues.push(id);

//     // Execute the update query
//     await db.query(updateQuery, updateValues);

//     res.status(200).send('User updated successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error updating user');
//   }
// };


exports.updateUser1 = async (req, res) => {
  const { id } = req.params;
  const { names, email, pass, rol } = req.body;

  try {
    let sql = "UPDATE users SET user_names=?, user_email=?, user_rol=? WHERE id=?";
    let values = [names, email, rol, id];
    const emailCheckQuery = 'SELECT user_email FROM users WHERE user_email = ?';
    // If a new password is provided, hash and update it
    if (pass) {
      const hashedPassword = await bcrypt.hash(pass, 10);
      sql = "UPDATE users SET user_names=?, user_email=?, user_rol=?, user_pass=? WHERE id=?";
      values = [names, email, rol, hashedPassword, id];
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }
      res.json({ success: true, message: "User updated successfully" });
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { names, email, pass, rol } = req.body;

  try {
    // 1. Check if the email is already used by another user
    const emailCheckQuery = 'SELECT id FROM users WHERE user_email = ? AND id != ?';
    db.query(emailCheckQuery, [email, id], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Email already in use by another user!" });
      }

      // 2. Proceed with the update if email is unique
      let sql = "UPDATE users SET user_names=?, user_email=?, user_rol=? WHERE id=?";
      let values = [names, email, rol, id];

      // 3. If a new password is provided, hash and update it
      if (pass) {
        const hashedPassword = await bcrypt.hash(pass, 10);
        sql = "UPDATE users SET user_names=?, user_email=?, user_rol=?, user_pass=? WHERE id=?";
        values = [names, email, rol, hashedPassword, id];
      }

      db.query(sql, values, (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Database error", details: err });
        }
        res.json({ success: true, message: "User updated successfully" });
      });
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
