require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const db = require("../utile/db");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

/// 1 menu product names
bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;

    const query = "SELECT DISTINCT pro_names FROM products";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return bot.sendMessage(chatId, " Error fetching product list.");
        }

        if (results.length === 0) {
            return bot.sendMessage(chatId, "⚠️ No products available for sale.");
        }
        // Generate inline keyboard buttons with product names
        const buttons = results.map((row) => [{ text: row.pro_names, callback_data: row.pro_names }]);

        bot.sendMessage(chatId, "🛒 ឈ្មោះផលិតផល:", {
            reply_markup: {
                inline_keyboard: buttons,
            },
        });
    });
});


//// 1 onclick prodct show ✅ Total sales qty for "Cambodia 2": 51
bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const productName = query.data; // The product name from button click

    const queryText = "SELECT SUM(qty) AS total FROM products WHERE pro_names = ?";
    db.query(queryText, [productName], (err, results) => {
        if (err) {
            console.error("Error fetching product qty:", err);
            return bot.sendMessage(chatId, " Error fetching product data.");
        }
        if (results.length === 0 || results[0].total === null) {
            return bot.sendMessage(chatId, `រកមិនឃើញ "${productName}".`);
        }
        const totalqty = results[0].total;
        bot.sendMessage(chatId, `ផលិតផល ${productName} មាននៅក្នុងស្តុកចំនួន: ${totalqty}`);
    });
    bot.answerCallbackQuery(query.id);
});


/// 2 រកមើលថាថ្ងៃនេះលក់បានផលិតផលធ្វីខ្លះ
////// check today insert sale product name
bot.onText(/\/today/, (msg) => {
    const chatId = msg.chat.id;

    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split("T")[0];
    const query = `SELECT p.pro_names, SUM(o.qty) AS total 
                   FROM \`order\` o
                   INNER JOIN products p ON p.id = o.product_id
                   WHERE DATE(o.create_at) = ?
                   GROUP BY p.pro_names;`;

    db.query(query, [todayDate], (err, results) => {
        if (err) {
            console.error("Error fetching today's sales:", err);
            return bot.sendMessage(chatId, "❌ Error fetching today's sales.");
        }

        if (results.length === 0) {
            return bot.sendMessage(chatId, "គ្មានការកត់ត្រាការលក់នៅថ្ងៃនេះទេ។.");
        }

        // Create a formatted sales summary
        let salesSummary = "📅 **ថ្ងៃនេះលក់បាន:**\n\n";
        results.forEach((row) => {
            salesSummary += ` **${row.pro_names}** - ${row.total}\n`;
        });

        bot.sendMessage(chatId, salesSummary, { parse_mode: "Markdown" });
    });
});

/// 3 រកមើលថាថ្ងៃនេះលក់សរុបសំនួនក្នុង ១ week
bot.onText(/\/totalsales/, (msg) => {
    const chatId = msg.chat.id;

    const query = `
     SELECT 
            SUM(CASE WHEN create_at = CURDATE() THEN qty ELSE 0 END) AS today_total,
            SUM(CASE WHEN create_at = CURDATE() - INTERVAL 1 DAY THEN qty ELSE 0 END) AS yesterday_total,
            SUM(CASE WHEN create_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) THEN qty ELSE 0 END) AS this_week_total
        FROM \`order\`
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching sales data:", err);
            return bot.sendMessage(chatId, "❌ Error fetching sales totals.");
        }

        if (results.length === 0) {
            return bot.sendMessage(chatId, "⚠️ No sales data available.");
        }

        const { today_total, yesterday_total, this_week_total } = results[0];

        let salesSummary = ` **សរុបការលក់ក្នុងសប្តាហ៍នេះ:**\n\n`;
        salesSummary += ` **ថ្ងៃនេះលក់បានចំនួន**: ${today_total || 0} ផលិតផល\n`;
        salesSummary += ` **ម្សិលមិញលក់បានចំនួន**: ${yesterday_total || 0} ​ផលិតផល\n`;
        salesSummary += `**សប្តាហ៍នេះលក់បានចំនួន**: ${this_week_total || 0} ផលិតផល\n`;

        bot.sendMessage(chatId, salesSummary, { parse_mode: "Markdown" });
    });
});


/// 4 បូកសរុបទឹកប្រាកការលក់
bot.onText(/\/sumtotal/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "សូមជ្រើសរើសរយៈពេលមួយ:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "📅 ការលក់នៅថ្ងៃនេះ", callback_data: "total_today" }],
                [{ text: "📆 ការលក់នៅម្សិលមិញ", callback_data: "total_yesterday" }],
                [{ text: "📆 ការលក់នៅសប្តាហ៍នេះ", callback_data: "total_week" }],
                [{ text: "📆 ការលក់នៅសប្តាហ៍មុន", callback_data: "total_last_week" }],
                [{ text: "📅 ការលក់នៅខែនេះ", callback_data: "total_this_month" }],
                [{ text: "📆 ការលក់នៅខែមុន", callback_data: "total_last_month" }],
                [{ text: "📆 ការលក់នៅឆ្នាំនេះ", callback_data: "total_this_year" }],
                [{ text: "📆 ការលក់នៅឆ្នាំមុន", callback_data: "total_last_year" }]
            ]
        }
    });
});

bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const selection = query.data;

    let queryText = "";
    let timeLabel = "";

    // Handle different selections
    if (selection === "total_today") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE DATE(od.create_at) = CURDATE();
        `;
        timeLabel = "សរុបការលក់នៅថ្ងៃនេះ";
    } else if (selection === "total_yesterday") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE DATE(od.create_at) = CURDATE() - INTERVAL 1 DAY;
        `;
        timeLabel = "សរុបការលក់កាលពីម្សិលមិញ";
    } else if (selection === "total_week") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE DATE(od.create_at) >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        `;
        timeLabel = "សរុបការលក់កាលនៅក្នុងសប្តាហ៍មុន";
    } else if (selection === "total_last_week") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE DATE(od.create_at) >= DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE()) + 7) DAY)
            AND DATE(od.create_at) < DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        `;
        timeLabel = "សរុបការលក់កាលពីសប្តាហ៍មុន";
    } else if (selection === "total_this_month") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE MONTH(od.create_at) = MONTH(CURDATE()) 
            AND YEAR(od.create_at) = YEAR(CURDATE());
        `;
        timeLabel = "📅 សរុបការលក់កាលនៅក្នុងខែមុន";
    } else if (selection === "total_last_month") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE MONTH(od.create_at) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
            AND YEAR(od.create_at) = YEAR(CURDATE() - INTERVAL 1 MONTH);
        `;
        timeLabel = "សរុបការលក់កាលពីខែមុន";
    } else if (selection === "total_this_year") {
        queryText = `
            SELECT 
                SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
                SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
                SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
            FROM order_detail od
            WHERE YEAR(od.create_at) = YEAR(CURDATE());
        `;
        timeLabel = "សរុបការលក់កាលឆ្នាំនេះ";
    } else if (selection === "total_last_year") {
        queryText = `
        SELECT 
            SUM(CASE WHEN od.type_currency = 'usd' THEN od.total_amount ELSE 0 END) AS TotalAmountUSD,
            SUM(CASE WHEN od.type_currency = 'khr' THEN od.total_amount ELSE 0 END) AS TotalAmountKHR,
            SUM(CASE WHEN od.type_currency = 'thb' THEN od.total_amount ELSE 0 END) AS TotalAmountTHB
        FROM order_detail od
        WHERE YEAR(od.create_at) = YEAR(CURDATE()) - 1;
        `;
        timeLabel = "សរុបការលក់កាលពីឆ្នាំមុន";
    } else {
        return bot.sendMessage(chatId, "❌ Invalid selection.");
    }

    db.query(queryText, (err, results) => {
        if (err) {
            console.error("Error fetching order_detail data:", err);
            return bot.sendMessage(chatId, "❌ Error fetching order_detail totals.");
        }

        if (!results || results.length === 0 || !results[0].TotalAmountUSD) {
            return bot.sendMessage(chatId, `⚠️ គ្មានការកត់ត្រាការលក់ !`);
        }

        // Create the response message with totals
        let response = `${timeLabel}:\n\n`;
        response += `💵 **USD**: ${results[0].TotalAmountUSD || 0} ដុល្លា\n`;
        response += `💰 **KHR**: ${results[0].TotalAmountKHR || 0} រៀល\n`;
        response += `💵 **THB**: ${results[0].TotalAmountTHB || 0} បាត\n`;

        bot.sendMessage(chatId, response);
    });

    bot.answerCallbackQuery(query.id); // Acknowledge button click
});



// //// នៅពេលលក់ Send to telegram bot auto success
// let lastOrderId = 0;
// const checkNewSales = () => {
//     db.query(
//         `SELECT od.id,
//             c.business_names, 
//             c.full_names, 
//             p.pro_names, 
//             SUM(o.qty) AS total_sold,
// 			o.price,
// 			o.discount,
// 			((o.price * o.qty) - o.discount) AS total,
//             (od.total_amount - od.balance_amount) AS amount_paid,
//             od.total_amount,
//             od.balance_amount,
//             od.type_currency,
//             od.user_at,
//             od.create_at,
//             od.id AS order_id
//         FROM \`order\` o
//         INNER JOIN order_detail od ON od.id = o.order_detail_id
//         INNER JOIN products p ON p.id = o.product_id
//         INNER JOIN customer c ON c.id = o.customer_id
//         WHERE o.order_detail_id = (SELECT MAX(order_detail_id) FROM \`order\`)
//         GROUP BY p.pro_names;`,
//         (err, results) => {
//             if (err) {
//                 console.error("Error fetching sales data:", err);
//                 return;
//             }

//             if (results.length > 0) {
//                 const orderId = results[0].order_id;

//                 if (orderId > lastOrderId) {
//                     lastOrderId = orderId; // Update last order ID

//                     const customerName = results[0].business_names || '';
//                     const fullName = results[0].full_names || '';
//                     const balanceAmount = results[0].balance_amount;
//                     const totalAmount = results[0].total_amount;
//                     const currency = results[0].type_currency;
//                     const anountDi = totalAmount - balanceAmount;
//                     const date = results[0].create_at;
//                     const userAt = results[0].user_at || null;
//                     const id = results[0].id;

//                     // Generate product list
//                     let productList = results.map(sale => `  ${sale.pro_names}      ${sale.total_sold}      $${sale.price}       $${sale.discount}      $${sale.total}`).join("\n");

//                     const message = `🛒 *របាយកាណ៍ថ្មី:*  
// *លក់ដោយ:* ${userAt}             
// *អតិជន:* ${customerName} ${fullName}
// *លេខវិក្កយបត្រ:*000-${id} 
// *ថ្ងៃទី:* ${date}
//      ឈ្មោះ​​​        ចំនួន       តម្លែ          បញ្ចុះតម្លៃ          សរុប
// -----------------------------------------------------------
// ${productList}  
// -----------------------------------------------------------
//                             *ចំនួនទឹកប្រាក់សរុប:*          ${totalAmount} ${currency} 
//                             *ចំនួនទឹកប្រាក់ដែលបានបង:*   ${balanceAmount} ${currency}  
//                             *ចំនួនទឹកប្រាក់នៅជុំពាក់:*      ${anountDi} ${currency}  
// `;

//                     bot.sendMessage("1108300915", message, { parse_mode: "Markdown" })
//                         .catch(err => console.error("Failed to send message:", err));
//                 }
//             }
//         }
//     );
// };
// setInterval(checkNewSales, 5000);



/// 5 បញ្ជីផលិតផលផុតកំណត់:
bot.onText(/\/productexpiry/, (msg) => {
    const chatId = msg.chat.id;

    // SQL query to get expired products
    const query = `SELECT pro_names, expiry FROM products WHERE expiry <= CURDATE();`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching expired products:", err);
            return bot.sendMessage(chatId, "❌ Error fetching expired products.");
        }

        if (results.length === 0) {
            return bot.sendMessage(chatId, "✅ គ្មានផលិតផលណាផុតកំណត់នៅឡើយទេ។");
        }

        // Create a formatted expired product summary
        let expirySummary = "⚠️ **បញ្ជីផលិតផលផុតកំណត់:**\n\n";
        results.forEach((row) => {
            expirySummary += ` **${row.pro_names}**\n`;
        });

        bot.sendMessage(chatId, expirySummary, { parse_mode: "Markdown" });
    });
});

/// 6 ស្វែងរកអតិថិជនដែលជំពាក់ប្រាក់:
bot.onText(/\/customerAmountDi/, (msg) => {
    const chatId = msg.chat.id;

    // SQL query to get customers with outstanding balances
    const query = `SELECT c.mobile_phone, c.business_names, c.full_names, 
       od.total_amount, od.balance_amount ,od.type_currency ,
(od.total_amount - od.balance_amount) as amountDi
FROM \`order\` o
INNER JOIN order_detail od ON od.id = o.order_detail_id
INNER JOIN customer c ON c.id = o.customer_id 
WHERE (od.total_amount - od.balance_amount) > 0;;`; // Only show customers with remaining balance

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching customers with outstanding balances:", err);
            return bot.sendMessage(chatId, "❌ Error fetching customers with outstanding balances.");
        }

        if (results.length === 0) {
            return bot.sendMessage(chatId, "✅ គ្មានអតិថិជនណាដែលជំពាក់ប្រាក់នៅឡើយទេ។");
        }

        // Create a formatted summary
        let balanceSummary = "⚠️ **បញ្ជីអតិថិជនដែលជំពាក់ប្រាក់:**\n\n";
        results.forEach((row) => {
            balanceSummary += `📞 ទូរស័ព្ទ: ${row.mobile_phone || "N/A"}\n👤 អតិថិជន: ${row.full_names} ${row.business_names}\n       សរុប: ${row.total_amount} ${row.type_currency}\n       បានបង់ចំនូន: ${row.balance_amount} ${row.type_currency}\n       នៅជុំពាក់: ${row.amountDi} ${row.type_currency}\n\n`;
        });

        bot.sendMessage(chatId, balanceSummary, { parse_mode: "Markdown" });
    });
});

/// 7 ស្វែងរកអ្នកផ្គត់ផ្គងដែលបានដែលបានជុំពាក់:
bot.onText(/\/supplierAmountDi/, (msg) => {
    const chatId = msg.chat.id;

    const query = `SELECT  
    s.full_names, 
    s.business_names, 
    s.mobile_phone, 
    SUM(pd.amount_total) AS amount_total, 
    SUM(pd.amount_pay) AS amount_pay, 
    SUM(pd.amount_discount) AS amount_discount, 
    SUM((pd.amount_total + pd.amount_discount) - pd.amount_pay) AS amountDi  
FROM purchase p  
INNER JOIN purchase_detail pd ON pd.id = p.purchasedetail_id  
INNER JOIN supplier s ON s.id = p.supplier_id  
WHERE (pd.amount_pay - (pd.amount_total + pd.amount_discount)) < 0  
GROUP BY s.full_names, s.business_names, s.mobile_phone  
ORDER BY s.business_names, s.full_names;`; // Only show customers with remaining balance

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching customers with outstanding balances:", err);
            return bot.sendMessage(chatId, "❌ Error fetching customers with outstanding balances.");
        }
        if (results.length === 0) {
            return bot.sendMessage(chatId, "គ្មានអ្នកផ្គត់ផ្គងណាដែលជំពាក់ប្រាក់នៅឡើយទេ។");
        }

        // Create a formatted summary
        let balanceSummary = "⚠️ **បញ្ជីម្ចាស់ផលិតផលដែលជំពាក់ប្រាក់:**\n\n";
        results.forEach((row) => {
            balanceSummary += `📞 ទូរស័ព្ទ: ${row.mobile_phone || "N/A"}\n👤 អ្នកផ្គត់ផ្គង: ${row.full_names} ${row.business_names}\n       លេខវិក្កយបត្រ: ${row.purchasedetail_id}\n       សរុប: ${row.amount_total} $\n       បានបង់ចំនូន: ${row.amount_pay} $\n       នៅជុំពាក់: ${row.amountDi} $\n\n`;
        });

        bot.sendMessage(chatId, balanceSummary, { parse_mode: "Markdown" });
    });
});




// // //// នៅពេល បើក បិទ លក់ Send to telegram bot auto success
// let lastOpeningReportID = 0;
// let lastClosingReportID = 0;
// const checkNewSaleStatus = () => {
//     db.query(
//         `SELECT s.id, s.opening_date, s.end_date, s.shift, 
//                 s.opening_balance, s.closing_balance, 
//                 ua.user_names AS user_namesAdd, 
//                 COALESCE(up.user_names, 'N/A') AS user_namesClost 
//          FROM sales_opening_report s
//          INNER JOIN users ua ON ua.id = s.cashier_id
//          LEFT JOIN users up ON up.id = s.user_update
//          ORDER BY s.id DESC LIMIT 1;`,
//         (err, results) => {
//             if (err) {
//                 console.error("❌ Error fetching sales data:", err);
//                 return;
//             }

//             if (results.length > 0) {
//                 const latestReport = results[0];

//                 // 🔹 Notify when a new sale is opened
//                 if (latestReport.id !== lastOpeningReportID) {
//                     lastOpeningReportID = latestReport.id;

//                     const openMessage = `👤 *បើកការលក់ : ${latestReport.user_namesAdd}*
//  *ចាប់ផ្ដើមពេល:* ${latestReport.opening_date} ${latestReport.shift}
//  *សមតុល្យបើក: * $${parseFloat(latestReport.opening_balance || 0).toFixed(2)}`;

//                     bot.sendMessage("1108300915", openMessage, { parse_mode: "Markdown" });
//                 }

//                 // 🔹 Notify when a sale is closed
//                 if (latestReport.id !== lastClosingReportID && latestReport.end_date) {
//                     lastClosingReportID = latestReport.id;
//                     const closeMessage = `👤 *បិទការលក់ ${latestReport.user_namesClost}*
// 👤 *បើកការលក់:* ${latestReport.user_namesAdd}         
//  *ចាប់ផ្ដើមពេល:* ${latestReport.opening_date}
//  *សមតុល្យបើក:* ${latestReport.end_date}
//  *សមតុល្យបិទ: * $${parseFloat(latestReport.opening_balance || 0).toFixed(2)}
//  *សរុបចំ​នួនទឹកប្រាក់លក់បាន: * $${parseFloat(latestReport.cash_in || 0).toFixed(2)}
//   *សរុបចំនួនទឹកប្រាក់ចំណាយ: * $${parseFloat(latestReport.cash_out || 0).toFixed(2)}
//  *សមតុល្យបិទ:* $${parseFloat(latestReport.closing_balance || 0).toFixed(2)}`;
//                     bot.sendMessage("1108300915", closeMessage, { parse_mode: "Markdown" });
//                 }
//             }
//         }
//     );
// };
// setInterval(checkNewSaleStatus, 5000);

// //////////////  ////////////
// // //// នៅពេល បើក បិទ លក់ Send to telegram bot auto success

// let lastOpeningReportID = 0;
// let lastClosingReportID = 0;

// const checkNewSaleStatus = () => {
//     db.query(
//         `SELECT s.id, s.opening_date, s.end_date, s.shift, 
//                 s.opening_balance, s.closing_balance, 
//                 s.cash_in, s.cash_out,
//                 ua.user_names AS user_namesAdd, 
//                 COALESCE(up.user_names, 'N/A') AS user_namesClost 
//          FROM sales_opening_report s
//          INNER JOIN users ua ON ua.id = s.cashier_id
//          LEFT JOIN users up ON up.id = s.user_update
//          ORDER BY s.id DESC LIMIT 1;`,
//         (err, results) => {
//             if (err) {
//                 console.error("❌ Error fetching sales data:", err);
//                 return;
//             }

//             if (results.length > 0) {
//                 const latestReport = results[0];

//                 // 🔹 Notify when a new sale is opened
//                 if (latestReport.id !== lastOpeningReportID) {
//                     lastOpeningReportID = latestReport.id;

//                     const openMessage = `👤 *បើកការលក់ : ${latestReport.user_namesAdd}*
// 📅 *ចាប់ផ្ដើមពេល:* ${latestReport.opening_date} ${latestReport.shift}
// 💵 *សមតុល្យបើក:* $${parseFloat(latestReport.opening_balance || 0).toFixed(2)}`;
//                     bot.sendMessage("1108300915", openMessage, { parse_mode: "Markdown" });
//                 }

//                 if (latestReport.id !== lastClosingReportID && latestReport.end_date) {
//                     lastClosingReportID = latestReport.id;

//                     // Fetch product sales for the current opening ID
//                     db.query(
//                         `SELECT vp.pro_names, o.qty as total_sold, o.price, o.discount as itemdiscount, o.total 
//      FROM \`order\` o
//      INNER JOIN order_detail od ON od.id = o.order_detail_id
//      INNER JOIN v_nameproducts vp ON vp.id = o.product_id
//      WHERE od.opening_id = ?`,
//                         [latestReport.id],
//                         (err, productResults) => {
//                             if (err) {
//                                 console.error("❌ Error fetching product sales:", err);
//                                 return;
//                             }

//                             let productList = "ឈ្មោះ​​​        ចំនួន       តម្លៃ          បញ្ចុះតម្លៃ          សរុប\n";
//                             productList += "-----------------------------------------------------------\n";

//                             if (productResults.length > 0) {
//                                 productList += productResults.map(sale =>
//                                     `${sale.pro_names.padEnd(10)} ${sale.total_sold.toString().padEnd(8)} $${sale.price.padEnd(10)} $${sale.itemdiscount.padEnd(10)} $${sale.total}
// `
//                                 ).join("\n");
//                             } else {
//                                 productList += "មិនមានទិន្នន័យលក់\n";
//                             }

//                             // Fetch additional cost details
//                             db.query(
//                                 `SELECT * from cost c
// INNER JOIN cost_type ct ON ct.id = c.cost_type_id
// WHERE c.opening_id = ?`,
//                                 [latestReport.id],
//                                 (err, costResults) => {
//                                     if (err) {
//                                         console.error("❌ Error fetching cost details:", err);
//                                         return;
//                                     }

//                                     let constList = "ឈ្មោះ​​​              តម្លៃ          ពន្ធ          បានបង់សរុប\n";
//                                     constList += "-----------------------------------------------------------\n";

//                                     if (costResults.length > 0) {
//                                         constList += costResults.map(sale =>
//                                             `${sale.type_names.padEnd(10)} $${sale.price.toFixed(2).padEnd(8)} $${sale.tax.toFixed(2).padEnd(10)} $${sale.payment.toFixed(2)}`
//                                         ).join("\n");
//                                     } else {
//                                         constList += "មិនមានទិន្នន័យ\n";
//                                     }

//                                     const closeMessage = `👤 *បិទការលក់: ${latestReport.user_namesClost}*
// 👤 *បើកការលក់:* ${latestReport.user_namesAdd}         
// 📅 *ចាប់ផ្ដើមពេល:* ${latestReport.opening_date}
// 📅 *កាលបរិច្ឆេទបិទ:* ${latestReport.end_date}
// 💵 *សមតុល្យបើក:* $${parseFloat(latestReport.opening_balance || 0).toFixed(2)}
// 💰 *សរុបចំ​នួនទឹកប្រាក់លក់បាន:* $${parseFloat(latestReport.cash_in || 0).toFixed(2)}
// 📤 *សរុបចំនួនទឹកប្រាក់ចំណាយ:* $${parseFloat(latestReport.cash_out || 0).toFixed(2)}
// 🏦 *សមតុល្យបិទ:* $${parseFloat(latestReport.closing_balance || 0).toFixed(2)}

// ${productList}

// ${constList}`;

//                                     bot.sendMessage("1108300915", closeMessage, { parse_mode: "Markdown" });
//                                 }
//                             );
//                         }
//                     );
//                 }
//             }
//         }
//     );
// };
// // Run the function every 5 seconds
// setInterval(checkNewSaleStatus, 5000);



module.exports = bot;



