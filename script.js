// REMIT PRO BUSINESS SYSTEM

// PRODUCT INVENTORY

let inventory = {
    "Harina": 0,
    "Rice": 0,
    "Softdrink": 0,
    "Mantika": 0,
    "Toyo": 0,
    "Langgaw": 0,
    "Ketchup": 0,
    "Supot": 0,
    "Tayni": 0
};

let riceStock = 0;
let drinkStock = 0;

let records = [];
let deliveries = [];


// PESO FORMAT

function peso(amount) {

    return "₱" + amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


// DAILY BUSINESS RECORDS

document.getElementById("businessForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const date = document.getElementById("date").value;

    const cashIn = Number(document.getElementById("cashIn").value);
    const cashOut = Number(document.getElementById("cashOut").value);
    const sale = Number(document.getElementById("saleInput").value);
    const leftover = Number(document.getElementById("leftInput").value);
    const actualCash = Number(document.getElementById("actualCash").value);
    const damage = Number(document.getElementById("damageInput").value);
    const expenses = Number(document.getElementById("expenseInput").value);
    const salary = Number(document.getElementById("salaryInput").value);
    const remitted = Number(document.getElementById("remittedInput").value);

    const values = [
        cashIn, cashOut, sale, leftover,
        actualCash, damage, expenses, salary, remitted
    ];

    if (values.some(v => !Number.isFinite(v) || v < 0)) {
        alert("Please enter valid amounts.");
        return;
    }

    const available = cashIn - cashOut;

    const difference = available - actualCash;

    const short = difference > 0 ? difference : 0;

    const record = {
        date,
        cashIn,
        cashOut,
        available,
        sale,
        leftover,
        actualCash,
        short,
        difference,
        damage,
        expenses,
        salary,
        remitted
    };

    records.push(record);

    updateDashboard();
    displayRecords();

    alert("Business Record Saved!");

    this.reset();

});


// DASHBOARD COMPUTATION

function updateDashboard() {

    let totals = {
        cashIn: 0,
        cashOut: 0,
        available: 0,
        sale: 0,
        leftover: 0,
        discrepancy: 0,
        short: 0,
        damage: 0,
        expenses: 0,
        salary: 0,
        remitted: 0
    };

    records.forEach(r => {

        totals.cashIn += r.cashIn;
        totals.cashOut += r.cashOut;
        totals.available += r.available;
        totals.sale += r.sale;
        totals.leftover += r.leftover;
        totals.discrepancy += Math.abs(r.difference);
        totals.short += r.short;
        totals.damage += r.damage;
        totals.expenses += r.expenses;
        totals.salary += r.salary;
        totals.remitted += r.remitted;

    });

    document.getElementById("inTotal").innerText = peso(totals.cashIn);

    document.getElementById("outTotal").innerText = peso(totals.cashOut);

    document.getElementById("available").innerText = peso(totals.available);

    document.getElementById("sale").innerText = peso(totals.sale);

    document.getElementById("leftover").innerText = peso(totals.leftover);

    document.getElementById("discrepancy").innerText = peso(totals.discrepancy);

    document.getElementById("short").innerText = peso(totals.short);

    document.getElementById("damage").innerText = peso(totals.damage);

    document.getElementById("totalSale").innerText = peso(totals.sale);

    document.getElementById("expenses").innerText = peso(totals.expenses);

    document.getElementById("salary").innerText = peso(totals.salary);

    document.getElementById("remitted").innerText = peso(totals.remitted);

}


// DISPLAY BUSINESS HISTORY

function displayRecords() {

    const list = document.getElementById("recordList");

    list.innerHTML = "";

    records.forEach(r => {

        const row = document.createElement("tr");

        const values = [
            r.date,
            peso(r.cashIn),
            peso(r.cashOut),
            peso(r.available),
            peso(r.sale),
            peso(r.leftover),
            peso(r.short),
            peso(r.damage),
            peso(r.expenses),
            peso(r.salary),
            peso(r.remitted)
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        list.appendChild(row);

    });

}


// RICE MONITORING

document.getElementById("riceForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const riceIn = Number(document.getElementById("riceIn").value);

    const riceOut = Number(document.getElementById("riceOut").value);

    if (
        !Number.isFinite(riceIn) ||
        !Number.isFinite(riceOut) ||
        riceIn < 0 ||
        riceOut < 0 ||
        riceOut > riceStock + riceIn
    ) {

        alert("Invalid Rice Quantity!");

        return;

    }

    riceStock += riceIn - riceOut;

    inventory["Rice"] = riceStock;

    document.getElementById("riceAvailable").innerText = riceStock;

    this.reset();

    document.getElementById("riceIn").value = 0;
    document.getElementById("riceOut").value = 0;

    displayInventory();

    alert("Rice Record Saved!");

});


// SOFTDRINK MONITORING

document.getElementById("drinkForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const drinkIn = Number(document.getElementById("drinkIn").value);

    const drinkOut = Number(document.getElementById("drinkOut").value);

    if (
        !Number.isFinite(drinkIn) ||
        !Number.isFinite(drinkOut) ||
        drinkIn < 0 ||
        drinkOut < 0 ||
        drinkOut > drinkStock + drinkIn
    ) {

        alert("Invalid Softdrink Quantity!");

        return;

    }

    drinkStock += drinkIn - drinkOut;

    inventory["Softdrink"] = drinkStock;

    document.getElementById("drinkAvailable").innerText = drinkStock;

    this.reset();

    document.getElementById("drinkIn").value = 0;
    document.getElementById("drinkOut").value = 0;

    displayInventory();

    alert("Softdrink Record Saved!");

});


// DELIVERY MANAGEMENT

document.getElementById("deliveryForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const date = document.getElementById("deliveryDate").value;

    const supplier = document.getElementById("supplier").value.trim();

    const product = document.getElementById("deliveryProduct").value;

    const quantity = Number(document.getElementById("deliveryQuantity").value);

    const price = Number(document.getElementById("deliveryPrice").value);

    if (
        !supplier ||
        !product ||
        !Number.isFinite(quantity) ||
        !Number.isFinite(price) ||
        quantity <= 0 ||
        price < 0
    ) {

        alert("Invalid Delivery Information!");

        return;

    }

    const total = quantity * price;

    const delivery = {
        date,
        supplier,
        product,
        quantity,
        price,
        total
    };

    deliveries.push(delivery);

    inventory[product] += quantity;

    if (product === "Rice") {

        riceStock = inventory["Rice"];

        document.getElementById("riceAvailable").innerText = riceStock;

    }

    if (product === "Softdrink") {

        drinkStock = inventory["Softdrink"];

        document.getElementById("drinkAvailable").innerText = drinkStock;

    }

    displayDeliveries();

    displayInventory();

    this.reset();

    alert("Delivery Successfully Saved!");

});


// DISPLAY DELIVERY HISTORY

function displayDeliveries() {

    const list = document.getElementById("deliveryList");

    list.innerHTML = "";

    deliveries.forEach(d => {

        const row = document.createElement("tr");

        const values = [
            d.date,
            d.supplier,
            d.product,
            d.quantity,
            peso(d.price),
            peso(d.total)
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        list.appendChild(row);

    });

}


// PRODUCT INVENTORY

function displayInventory() {

    const list = document.getElementById("inventoryList");

    list.innerHTML = "";

    Object.entries(inventory).forEach(([product, quantity]) => {

        const row = document.createElement("tr");

        const name = document.createElement("td");

        name.textContent = product;

        const stock = document.createElement("td");

        stock.textContent = quantity;

        row.appendChild(name);

        row.appendChild(stock);

        list.appendChild(row);

    });

}


// SEARCH BUSINESS HISTORY

document.getElementById("search")
.addEventListener("input", function() {

    const search = this.value.toLowerCase();

    document.querySelectorAll("#recordList tr").forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(search)
            ? ""
            : "none";

    });

});


// INITIAL DISPLAY

// ===================================
// RESET SYSTEM
// ===================================

document.getElementById("resetButton")
.addEventListener("click", function() {

    const confirmReset = confirm(
        "WARNING!\nAre you sure you want to reset all system data?"
    );

    if (!confirmReset) {
        return;
    }

    // RESET BUSINESS RECORDS
    records = [];

    // RESET SALES RECORDS
    salesRecords = [];

    // RESET DELIVERY RECORDS
    deliveries = [];

    // RESET INVENTORY
    inventory = {
        "Harina": 0,
        "Rice": 0,
        "Softdrink": 0,
        "Mantika": 0,
        "Toyo": 0,
        "Langgaw": 0,
        "Ketchup": 0,
        "Supot": 0,
        "Tayni": 0
    };

    // RESET RICE AND SOFTDRINK
    riceStock = 0;
    drinkStock = 0;

    // CLEAR ALL FORMS
    document.querySelectorAll("form").forEach(form => {
        form.reset();
    });

    // RESET DASHBOARD
    updateDashboard();

    // RESET TABLES
    displayRecords();
    displaySales();
    displayDeliveries();
    displayInventory();

    // RESET STOCK DISPLAY
    document.getElementById("riceAvailable").innerText = 0;
    document.getElementById("drinkAvailable").innerText = 0;

    // RESET REPORTS
    updateReports();

    alert("SYSTEM SUCCESSFULLY RESET!");

});