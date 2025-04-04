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
            return bot.sendMessage(chatId, "❌ Error fetching product list.");
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
            return bot.sendMessage(chatId, "❌ Error fetching product data.");
        }

        if (results.length === 0 || results[0].total === null) {
            return bot.sendMessage(chatId, `⚠️ រកមិនឃើញ "${productName}".`);
        }

        const totalqty = results[0].total;
        bot.sendMessage(chatId, `ផលិតផល ${productName} មាននៅក្នុងស្តុកចំនួន: ${totalqty}`);
    });

    bot.answerCallbackQuery(query.id); // Acknowledge the button press
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


// នៅពេលលក់ Send to telegram bot auto
let lastOrderId = 0; 
const checkNewSales = () => {
    db.query(
        `SELECT 
            c.business_names, 
            c.full_names, 
            p.pro_names, 
             p.unit_names,
            SUM(o.qty) AS total_sold,
            (od.total_amount - od.balance_amount) AS amount_paid,
            od.total_amount,
            od.balance_amount,
            od.type_currency,
            od.user_at,
            od.create_at,
            od.id AS order_id
        FROM \`order\` o
        INNER JOIN order_detail od ON od.id = o.order_detail_id
        INNER JOIN v_nameproducts p ON p.id = o.product_id
        INNER JOIN customer c ON c.id = o.customer_id
        WHERE o.order_detail_id = (SELECT MAX(order_detail_id) FROM \`order\`)
        GROUP BY p.pro_names;`,
        (err, results) => {
            if (err) {
                console.error("Error fetching sales data:", err);
                return;
            }

            if (results.length > 0) {
                const orderId = results[0].order_id;

                if (orderId > lastOrderId) {
                    lastOrderId = orderId; // Update last order ID

                    const customerName = results[0].business_names || '';
                    const fullName = results[0].full_names || '';
                    const balanceAmount = results[0].balance_amount;
                    const totalAmount = results[0].total_amount;
                    const unitNames = results[0].unit_names;
                    const currency = results[0].type_currency;
                    const anountDi = totalAmount - balanceAmount;
                    const date = results[0].create_at;
                    const userAt = results[0].user_at || null;

                    // Generate product list
                    let productList = results.map(sale => `ផលិតផល: ${sale.pro_names} : ${sale.total_sold} ${unitNames}`).join("\n");

                    const message = `🛒 *របាយកាណ៍ថ្មី:*  
*លក់ដោយ:* ${userAt}             
*អតិជន:* ${customerName} ${fullName}
${productList}  
*ចំនួនទឹកប្រាក់សរុប:* ${totalAmount} ${currency} 
*ចំនួនទឹកប្រាក់ដែលបានបង:* ${balanceAmount} ${currency}  
*ចំនួនទឹកប្រាក់នៅជុំពាក់:* ${anountDi} ${currency}  
*ថ្ងៃទី:* ${date}`;

                    bot.sendMessage("1108300915", message, { parse_mode: "Markdown" })
                        .catch(err => console.error("Failed to send message:", err));
                }
            }
        }
    );
};
setInterval(checkNewSales, 5000);


// Run check every 5 seconds
setInterval(checkNewSales, 5000);


module.exports = bot;
