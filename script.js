
let records = JSON.parse(
    localStorage.getItem("remittanceRecords") || "[]"
);

function money(value) {
    return "₱" + Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function saveRemittance() {

    let date = document.getElementById("date").value;

    let input = Number(document.getElementById("inBags").value);
    let output = Number(document.getElementById("outBags").value);
    let left = Number(document.getElementById("leftOver").value);
    let damage = Number(document.getElementById("damage").value);

    let sales = Number(document.getElementById("sales").value);
    let expenses = Number(document.getElementById("expenses").value);
    let salary = Number(document.getElementById("salary").value);
    let actual = Number(document.getElementById("actualRemit").value);

    if (!date) {
        alert("Please select a date!");
        return;
    }

    let expected = sales - expenses - salary;
    let difference = actual - expected;

    let record = {
        date,
        input,
        output,
        left,
        damage,
        sales,
        expenses,
        salary,
        actual,
        expected,
        difference
    };

    records.push(record);

    localStorage.setItem(
        "remittanceRecords",
        JSON.stringify(records)
    );

    updateDashboard();
    resetForm();

    alert("Remittance Successfully Saved!");
}

function updateDashboard() {

    let totalIn = 0;
    let totalOut = 0;
    let totalSales = 0;
    let totalExpenses = 0;
    let totalRemit = 0;

    records.forEach(r => {
        totalIn += r.input;
        totalOut += r.output;
        totalSales += r.sales;
        totalExpenses += r.expenses;
        totalRemit += r.actual;
    });

    document.getElementById("inDisplay").innerText = totalIn;
    document.getElementById("outDisplay").innerText = totalOut;

    document.getElementById("stockDisplay").innerText =
        totalIn - totalOut;

    document.getElementById("salesDisplay").innerText =
        money(totalSales);

    document.getElementById("expenseDisplay").innerText =
        money(totalExpenses);

    document.getElementById("remitDisplay").innerText =
        money(totalRemit);

    renderHistory();
    updateSummary();
}

function updateSummary() {

    let sales = 0;
    let expenses = 0;
    let salary = 0;
    let actual = 0;

    records.forEach(r => {
        sales += r.sales;
        expenses += r.expenses;
        salary += r.salary;
        actual += r.actual;
    });

    let expected = sales - expenses - salary;
    let difference = actual - expected;

    document.getElementById("summarySales").innerText = money(sales);
    document.getElementById("summaryExpenses").innerText = money(expenses);
    document.getElementById("summarySalary").innerText = money(salary);
    document.getElementById("expectedRemit").innerText = money(expected);
    document.getElementById("actualSummary").innerText = money(actual);
    document.getElementById("difference").innerText = money(difference);
}

function renderHistory() {

    let history = document.getElementById("history");

    history.innerHTML = "";

    records.forEach(r => {

        history.innerHTML += `
        <tr>
            <td>${r.date}</td>
            <td>${r.input}</td>
            <td>${r.output}</td>
            <td>${r.left}</td>
            <td>${r.damage}</td>
            <td>${money(r.sales)}</td>
            <td>${money(r.expenses)}</td>
            <td>${money(r.salary)}</td>
            <td>${money(r.actual)}</td>
        </tr>
        `;
    });
}

function resetForm() {

    document.getElementById("inBags").value = 0;
    document.getElementById("outBags").value = 0;
    document.getElementById("leftOver").value = 0;
    document.getElementById("damage").value = 0;
    document.getElementById("sales").value = 0;
    document.getElementById("expenses").value = 0;
    document.getElementById("salary").value = 0;
    document.getElementById("actualRemit").value = 0;
}

document.getElementById("date").value =
    new Date().toLocaleDateString("en-CA");

updateDashboard();
// PRODUCT INVENTORY

let products = [
    "Harina",
    "Rice",
    "Softdrink",
    "Mantika",
    "Toyo",
    "Langgaw",
    "Ketchup",
    "Supot",
    "Tayni"
];

let inventory = JSON.parse(
    localStorage.getItem("inventory")
) || products.map(name => ({
    name: name,
    beginning: 0,
    delivered: 0,
    available: 0
}));

let deliveries = JSON.parse(
    localStorage.getItem("deliveries")
) || [];

let stockMovements = JSON.parse(
    localStorage.getItem("stockMovements")
) || [];


// SAVE DELIVERY

function saveDelivery() {

    let date = document.getElementById("deliveryDate").value;
    let supplier = document.getElementById("supplier").value.trim();
    let product = document.getElementById("deliveryProduct").value;
    let qty = Number(document.getElementById("deliveryQty").value);

    if (!date || !supplier || qty <= 0 || !Number.isInteger(qty)) {
        alert("Please complete all delivery information!");
        return;
    }

    let item = inventory.find(p => p.name === product);

    item.delivered += qty;
    item.available += qty;

    deliveries.push({
        date,
        supplier,
        product,
        qty
    });

    saveInventoryData();

    renderInventory();
    renderDeliveryHistory();

    document.getElementById("supplier").value = "";
    document.getElementById("deliveryQty").value = "";

    alert("Delivery Successfully Saved!");
}


// SAVE RICE AND SOFTDRINK STOCK MOVEMENT

function saveStockMovement() {

    let riceIn = Number(document.getElementById("riceIn").value);
    let riceOut = Number(document.getElementById("riceOut").value);

    let softIn = Number(document.getElementById("softIn").value);
    let softOut = Number(document.getElementById("softOut").value);

    let rice = inventory.find(p => p.name === "Rice");
    let soft = inventory.find(p => p.name === "Softdrink");

    let values = [riceIn, riceOut, softIn, softOut];

    if (values.some(v => !Number.isInteger(v) || v < 0)) {
        alert("Invalid stock quantity!");
        return;
    }

    if (rice.available + riceIn < riceOut) {
        alert("Not enough Rice stock!");
        return;
    }

    if (soft.available + softIn < softOut) {
        alert("Not enough Softdrink stock!");
        return;
    }

    rice.available += riceIn - riceOut;
    soft.available += softIn - softOut;

    rice.beginning += riceIn;
    soft.beginning += softIn;

    stockMovements.push({
        date: new Date().toLocaleDateString(),
        riceIn,
        riceOut,
        softIn,
        softOut
    });

    saveInventoryData();
    renderInventory();
    updateSpecialStocks();

    document.getElementById("riceIn").value = 0;
    document.getElementById("riceOut").value = 0;
    document.getElementById("softIn").value = 0;
    document.getElementById("softOut").value = 0;

    alert("Stock Movement Saved!");
}


// SAVE INVENTORY

function saveInventoryData() {

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        "deliveries",
        JSON.stringify(deliveries)
    );

    localStorage.setItem(
        "stockMovements",
        JSON.stringify(stockMovements)
    );
}


// DISPLAY INVENTORY

function renderInventory() {

    let table = document.getElementById("productInventory");

    table.innerHTML = "";

    inventory.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.beginning}</td>
                <td>${item.delivered}</td>
                <td><strong>${item.available}</strong></td>
            </tr>
        `;

    });

    updateSpecialStocks();
}


// DISPLAY RICE AND SOFTDRINK

function updateSpecialStocks() {

    let rice = inventory.find(p => p.name === "Rice");
    let soft = inventory.find(p => p.name === "Softdrink");

    document.getElementById("riceStock").innerText =
        rice.available;

    document.getElementById("softStock").innerText =
        soft.available;
}


// DELIVERY HISTORY

function renderDeliveryHistory() {

    let table = document.getElementById("deliveryHistory");

    table.innerHTML = "";

    deliveries.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.supplier}</td>
                <td>${item.product}</td>
                <td>${item.qty}</td>
            </tr>
        `;

    });
}


// INITIALIZE

document.getElementById("deliveryDate").value =
    new Date().toLocaleDateString("en-CA");

renderInventory();
renderDeliveryHistory();
// RESET ALL DATA

function resetAllData() {

    let confirmReset = confirm(
        "WARNING! Are you sure you want to delete ALL records?"
    );

    if (!confirmReset) {
        return;
    }

    let finalConfirm = confirm(
        "This will delete Sales, Remittance, Delivery History and Inventory. Continue?"
    );

    if (!finalConfirm) {
        return;
    }

    // Clear saved records
    localStorage.removeItem("remittanceRecords");
    localStorage.removeItem("inventory");
    localStorage.removeItem("deliveries");
    localStorage.removeItem("stockMovements");

    // Reset arrays
    records = [];

    inventory = products.map(name => ({
        name: name,
        beginning: 0,
        delivered: 0,
        available: 0
    }));

    deliveries = [];
    stockMovements = [];

    // Clear input fields
    resetForm();

    document.getElementById("riceIn").value = 0;
    document.getElementById("riceOut").value = 0;
    document.getElementById("softIn").value = 0;
    document.getElementById("softOut").value = 0;

    document.getElementById("supplier").value = "";
    document.getElementById("deliveryQty").value = "";

    // Update dashboard
    updateDashboard();

    renderInventory();
    renderDeliveryHistory();
    updateSpecialStocks();

    alert("ALL DATA SUCCESSFULLY RESET!");

}