// =====================================
// REMITPRO BUSINESS MANAGEMENT SYSTEM
// =====================================


// DATABASE

let remittances =
    JSON.parse(localStorage.getItem("remittances")) || [];

let deliveries =
    JSON.parse(localStorage.getItem("deliveries")) || [];


// PRODUCTS

const inventoryProducts = [
    "Harina",
    "Rice",
    "Softdrink",
    "Mantika",
    "Toyo",
    "Langgaw",
    "Ketchup",
    "Supot",
    "Tayni" ,
     "Uling",
     "Constarch",
];


// QUANTITIES

let productQuantities = {};

inventoryProducts.forEach(product => {
    productQuantities[product] = 0;
});


// HELPERS

const today = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000)
        .toISOString().slice(0, 10);
};

const money = amount =>
    "₱" + Number(amount || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


// SAVE DATABASE

function saveData() {

    localStorage.setItem(
        "remittances",
        JSON.stringify(remittances)
    );

    localStorage.setItem(
        "deliveries",
        JSON.stringify(deliveries)
    );

}


// NAVIGATION

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    const titles = {
        dashboard: "Dashboard",
        remittance: "Remittance Management",
        inventory: "Product Inventory",
        records: "Records"
    };

    document.getElementById("pageTitle").textContent = titles[page];

}


// CURRENT DATE

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

document.getElementById("rDate").value = today();
document.getElementById("deliveryDate").value = today();


// =====================================
// REMITTANCE SYSTEM
// =====================================


// CALCULATIONS

function calculate() {

    const sale = Number(document.getElementById("rSale").value) || 0;

    const expenses = Number(document.getElementById("rExpenses").value) || 0;

    const salary = Number(document.getElementById("rSalary").value) || 0;

    const short = Number(document.getElementById("rShort").value) || 0;

    const remit = Number(document.getElementById("rRemittance").value) || 0;

    const expected = sale - expenses - salary - short;

    const difference = remit - expected;

    document.getElementById("totalSale").textContent =
        money(sale);

    document.getElementById("expectedCash").textContent =
        money(expected);

    document.getElementById("cashDifference").textContent =
        money(difference);

}


[
    "rSale",
    "rExpenses",
    "rSalary",
    "rShort",
    "rRemittance"
].forEach(id => {

    document.getElementById(id).addEventListener(
        "input",
        calculate
    );

});


// SAVE REMITTANCE

document.getElementById("remittanceForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const record = {

        id: Date.now(),

        date: document.getElementById("rDate").value,

        incoming: Number(document.getElementById("rIn").value) || 0,

        outgoing: Number(document.getElementById("rOut").value) || 0,

        available: Number(document.getElementById("rAvailable").value) || 0,

        sale: Number(document.getElementById("rSale").value) || 0,

        left: Number(document.getElementById("rLeft").value) || 0,

        short: Number(document.getElementById("rShort").value) || 0,

        expenses: Number(document.getElementById("rExpenses").value) || 0,

        salary: Number(document.getElementById("rSalary").value) || 0,

        remittance: Number(document.getElementById("rRemittance").value) || 0

    };

    if (!record.date) {
        alert("Please select date.");
        return;
    }

    remittances.unshift(record);

    saveData();

    this.reset();

    document.getElementById("rDate").value = today();

    calculate();

    renderAll();

    alert("Remittance successfully saved!");

});


// CLEAR REMITTANCE FORM

function clearRemittanceForm() {

    document.getElementById("remittanceForm").reset();

    document.getElementById("rDate").value = today();

    calculate();

}


// REMITTANCE HISTORY

function renderRemittance() {

    const table = document.getElementById("remittanceTable");

    table.innerHTML = "";

    if (remittances.length === 0) {

        table.innerHTML =
            `<tr><td colspan="11" class="empty">No remittance records.</td></tr>`;

        return;
    }

    remittances.forEach(r => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${r.date}</td>
            <td>${r.incoming}</td>
            <td>${r.outgoing}</td>
            <td>${r.available}</td>
            <td>${money(r.sale)}</td>
            <td>${money(r.left)}</td>
            <td>${money(r.short)}</td>
            <td>${money(r.expenses)}</td>
            <td>${money(r.salary)}</td>
            <td>${money(r.remittance)}</td>
            <td>
                <button class="delete-btn"
                    onclick="deleteRemittance(${r.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });

}


// DELETE SELECTED REMITTANCE

function deleteRemittance(id) {

    if (!confirm("Delete this selected remittance?")) return;

    remittances = remittances.filter(r => r.id !== id);

    saveData();

    renderAll();

}


// =====================================
// PRODUCT INVENTORY SYSTEM
// =====================================


// DISPLAY PRODUCTS

function displayProductQuantities() {

    const container =
        document.getElementById("productQuantityList");

    container.innerHTML = "";

    inventoryProducts.forEach(product => {

        const row = document.createElement("div");

        row.className = "product-quantity-row";

        const name = document.createElement("b");

        name.textContent = product;

        const controls = document.createElement("div");

        controls.className = "quantity-control";

        const minus = document.createElement("button");

        minus.type = "button";
        minus.textContent = "−";

        minus.addEventListener("click", () => {
            changeQuantity(product, -1);
        });

        const number = document.createElement("span");

        number.id = "qty-" + product;
        number.textContent = productQuantities[product];

        const plus = document.createElement("button");

        plus.type = "button";
        plus.textContent = "+";

        plus.addEventListener("click", () => {
            changeQuantity(product, 1);
        });

        controls.append(minus, number, plus);

        row.append(name, controls);

        container.appendChild(row);

    });

}


// ADD / SUBTRACT QUANTITY

function changeQuantity(product, amount) {

    productQuantities[product] += amount;

    if (productQuantities[product] < 0) {
        productQuantities[product] = 0;
    }

    document.getElementById("qty-" + product).textContent =
        productQuantities[product];

}


// SAVE ALL DELIVERIES

function saveAllDeliveries() {

    const date =
        document.getElementById("deliveryDate").value;

    if (!date) {

        alert("Please select delivery date.");

        return;
    }

    const selectedProducts = inventoryProducts.filter(
        product => productQuantities[product] > 0
    );

    if (selectedProducts.length === 0) {

        alert("Please add product quantity first.");

        return;
    }

    selectedProducts.forEach(product => {

        deliveries.unshift({

            id: Date.now() + Math.random(),

            product: product,

            quantity: productQuantities[product],

            date: date

        });

        productQuantities[product] = 0;

    });

    saveData();

    displayProductQuantities();

    renderAll();

    alert("All product deliveries saved successfully!");

}


// PRODUCT SUMMARY

function renderProductSummary() {

    const table =
        document.getElementById("productSummary");

    table.innerHTML = "";

    inventoryProducts.forEach(product => {

        const total = deliveries

            .filter(d => d.product === product)

            .reduce((sum, d) => sum + Number(d.quantity), 0);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product}</td>
            <td><b>${total.toLocaleString()}</b></td>
        `;

        table.appendChild(row);

    });

}


// DELIVERY HISTORY

function renderDeliveries() {

    const table =
        document.getElementById("deliveryTable");

    table.innerHTML = "";

    if (deliveries.length === 0) {

        table.innerHTML =
            `<tr><td colspan="4" class="empty">No delivery records.</td></tr>`;

        return;
    }

    deliveries.forEach(d => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${d.date}</td>
            <td>${d.product}</td>
            <td>${d.quantity}</td>
            <td>
                <button class="delete-btn"
                    onclick="deleteDelivery(${d.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });

}


// DELETE SELECTED DELIVERY

function deleteDelivery(id) {

    if (!confirm("Delete this selected delivery?")) return;

    deliveries = deliveries.filter(d => d.id !== id);

    saveData();

    renderAll();

}


// =====================================
// DASHBOARD
// =====================================

function renderDashboard() {

    const todayRemittance = remittances

        .filter(r => r.date === today())

        .reduce((sum, r) => sum + r.remittance, 0);


    const totalSales = remittances

        .reduce((sum, r) => sum + r.sale, 0);


    const totalExpenses = remittances

        .reduce((sum, r) => sum + r.expenses + r.salary, 0);


    const totalDelivered = deliveries

        .reduce((sum, d) => sum + d.quantity, 0);


    document.getElementById("dashRemittance").textContent =
        money(todayRemittance);

    document.getElementById("dashSales").textContent =
        money(totalSales);

    document.getElementById("dashExpenses").textContent =
        money(totalExpenses);

    document.getElementById("dashDelivered").textContent =
        totalDelivered.toLocaleString();


    const recent =
        document.getElementById("recentRecords");

    recent.innerHTML = "";

    remittances.slice(0, 5).forEach(r => {

        recent.innerHTML += `
            <tr>
                <td>${r.date}</td>
                <td>${r.incoming}</td>
                <td>${r.outgoing}</td>
                <td>${money(r.sale)}</td>
                <td>${money(r.remittance)}</td>
            </tr>
        `;

    });

    if (remittances.length === 0) {

        recent.innerHTML =
            `<tr><td colspan="5" class="empty">No records yet.</td></tr>`;

    }

}


// =====================================
// RESET SYSTEM
// =====================================

function resetData(type) {

    if (type === "remittance") {

        if (!confirm(
            "Are you sure you want to reset ALL REMITTANCE records?"
        )) return;

        remittances = [];

    }

    else if (type === "inventory") {

        if (!confirm(
            "Are you sure you want to reset ALL INVENTORY delivery records?"
        )) return;

        deliveries = [];

        inventoryProducts.forEach(product => {
            productQuantities[product] = 0;
        });

        displayProductQuantities();

    }

    saveData();

    renderAll();

    alert("Selected records have been reset.");

}


// =====================================
// RECORD COUNTS
// =====================================

function renderRecords() {

    document.getElementById(
        "recordRemittanceCount"
    ).textContent = remittances.length + " records";


    document.getElementById(
        "recordInventoryCount"
    ).textContent = deliveries.length + " deliveries";

}


// =====================================
// BACKUP SYSTEM
// =====================================

function exportBackup() {

    const data = {

        remittances: remittances,

        deliveries: deliveries,

        backupDate: new Date().toISOString()

    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "REMITPRO-BACKUP.json";

    link.click();

    URL.revokeObjectURL(url);

}


// =====================================
// REFRESH ALL SYSTEM
// =====================================

function renderAll() {

    renderRemittance();

    renderDeliveries();

    renderProductSummary();

    renderDashboard();

    renderRecords();

}


// INITIALIZE SYSTEM

displayProductQuantities();

renderAll();

calculate();