const express = require('express');
const cors = require('cors');
const db = require('./src/utile/db'); // Your database utility file
const app = express();
const port = 6700;
const path = require('path');
require("./src/bot/bot"); // ✅ Start the Telegram bot

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to handle CORS

// Connect to the database
// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the MySQL database.');
// });
// Import and use the authentication routes
const authRoutes = require('./src/route/authRoute');
app.use('/api/auth', authRoutes);

// Import and use the category routes
const categoryRoutes = require('./src/route/category.route');
app.use('/categories', categoryRoutes); 

// Import and use the brandsRoutes routes
const brandsRoutes = require('./src/route/brands.router');
app.use('/api/brands', brandsRoutes); 

// Import and use the unit routes
const UnitRoutes = require('./src/route/unit.router');
app.use('/api/unit', UnitRoutes); 

// Import and use the BankAount routes
const BankRoutes = require('./src/route/bank.router');
app.use('/api/bank', BankRoutes); 

// Import and use the account routes
const AccountRoutes = require('./src/route/account.router');
app.use('/api/account', AccountRoutes); 

// Import and use the cost routes
const CostRoutes = require('./src/route/cost.router');
app.use('/api/cost', CostRoutes); 
// Import and use the costtype routes
const CostTypeRoutes = require('./src/route/costtype.router');
app.use('/api/cost_type', CostTypeRoutes); 


// Import and use the group_customer routes
const Group_Customer_Routes = require('./src/route/group_customer.router');
app.use('/api/group_customer', Group_Customer_Routes); 

// Import and use the customer routes
const Customer_Routes = require('./src/route/customer.router');
app.use('/api/customer', Customer_Routes); 

// Import and use the BankAount routes
const Supplier_Routes = require('./src/route/supplier.router');
app.use('/api/supplier', Supplier_Routes); 

// Import and use the payment_type routes
const Pamenttype_Routes = require('./src/route/payment_type.router');
app.use('/api/payment_type', Pamenttype_Routes); 


// Import and use the currency routes
const Currency_Routes = require('./src/route/currency.route');
app.use('/api/currency', Currency_Routes); 


// Import and use the payment_type routes
const Purchase_Routes = require('./src/route/purchase.router');
app.use('/api/purchase', Purchase_Routes);

// Import and use the payment_type routes
const Warranty_Routes = require('./src/route/warranty.router');
app.use('/api/warranty', Warranty_Routes); 


// Import and use  order cart product
const Order_Routes = require('./src/route/order.router');
app.use('/api/order', Order_Routes); 

// Import and use customer_payment
const customer_payment = require('./src/route/customer_payment.router');
app.use('/api/cus_payment', customer_payment); 

// Import and use customer_payment
const Product_Discount = require('./src/route/product_discount.router');
app.use('/api/product_discount', Product_Discount); 

// Import and use  dasboard_chart
const Dasboard_chart_Routes = require('./src/route/dasboard_chart.router');
app.use('/api/dashbord', Dasboard_chart_Routes); 

// Import and use  Payment_repay_Routes
const Invoice_Routes = require('./src/route/invoice.router');
app.use('/api/invoice', Invoice_Routes); 

// Import and use  Payment_repay_Routes
const Payment_repay_Routes = require('./src/route/order_repay.router');
app.use('/api/repay', Payment_repay_Routes); 

// Import and use the OpencashRoutes routes
const OpencashRoutes = require('./src/route/opencash.router');
app.use('/api/opencash', OpencashRoutes); 

// Import and use the product routes
const Product_Routes = require('./src/route/product.router');
app.use('/api/product', Product_Routes); 
// get image static files show in front end
app.use('/image', express.static(path.join(__dirname, './src/public/image')));


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
