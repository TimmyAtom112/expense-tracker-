/* ========================================
GET HTML ELEMENTS
======================================== */

const form = document.getElementById("expense-form");

const descriptionInput =
document.getElementById("description");

const amountInput =
document.getElementById("amount");

const typeInput =
document.getElementById("type");

const categoryInput =
document.getElementById("category");

const dateInput =
document.getElementById("transaction-date");

const sourceInput =
document.getElementById("source");

const transactionList =
document.getElementById("transaction-list");

const totalIncome =
document.getElementById("total-income");

const totalExpenses =
document.getElementById("total-expenses");

const balance =
document.getElementById("balance");

const categoryBreakdown =
document.getElementById("category-breakdown");

const spendingChart =
document.getElementById("spending-chart");

/* ========================================
EDIT MODAL
======================================== */

const editModal =
document.getElementById("edit-modal");

const editForm =
document.getElementById("edit-form");

const editId =
document.getElementById("edit-id");

const editDescription =
document.getElementById("edit-description");

const editAmount =
document.getElementById("edit-amount");

const editDate =
document.getElementById("edit-date");

const editType =
document.getElementById("edit-type");

const editCategory =
document.getElementById("edit-category");

const editSource =
document.getElementById("edit-source");

const closeModal =
document.getElementById("close-modal");

const cancelEdit =
document.getElementById("cancel-edit");

/* ========================================
BUDGET
======================================== */

const budgetInput =
document.getElementById("budget-input");

const saveBudgetButton =
document.getElementById("save-budget");

const budgetAmount =
document.getElementById("budget-amount");

const budgetSpent =
document.getElementById("budget-spent");

const budgetRemaining =
document.getElementById("budget-remaining");

const budgetProgressBar =
document.getElementById("budget-progress-bar");

const budgetMessage =
document.getElementById("budget-message");

/* ========================================
DATA
======================================== */

let transactions = [];

let monthlyBudget = 0;

let categoryChart = null;

/* ========================================
TODAY'S DATE
======================================== */

function setDefaultDate() {

const today =
    new Date().toISOString().split("T")[0];

dateInput.value = today;

}

/* ========================================
ADD TRANSACTION
======================================== */

form.addEventListener("submit", function(event) {

event.preventDefault();

const description =
    descriptionInput.value.trim();

const amount =
    Number(amountInput.value);

const type =
    typeInput.value;

const category =
    categoryInput.value;

const date =
    dateInput.value;

const source =
    sourceInput.value.trim();


if (
    description === "" ||
    amount <= 0 ||
    !date
) {

    alert(
        "Please enter a valid description, amount and date."
    );

    return;

}


const transaction = {

    id: Date.now(),

    description: description,

    amount: amount,

    type: type,

    category: category,

    date: date,

    source: source

};


transactions.push(transaction);

saveTransactions();

refreshApp();

form.reset();

setDefaultDate();

});

/* ========================================
DISPLAY TRANSACTIONS
======================================== */

function displayTransactions() {

transactionList.innerHTML = "";


if (transactions.length === 0) {

    transactionList.innerHTML = `
        <p class="no-expenses">
            No transactions recorded yet.
        </p>
    `;

    return;

}


const sortedTransactions =
    [...transactions].sort(
        (a, b) => b.id - a.id
    );


sortedTransactions.forEach(function(transaction) {

    const transactionElement =
        document.createElement("div");


    transactionElement.classList.add(
        "transaction-item"
    );


    const amountClass =
        transaction.type === "income"
            ? "income"
            : "expense";


    const amountSign =
        transaction.type === "income"
            ? "+"
            : "-";


    const sourceHTML =
        transaction.source
            ? `<small>Source: ${escapeHTML(
                transaction.source
            )}</small>`
            : "";


    transactionElement.innerHTML = `

        <div class="transaction-info">

            <h3>
                ${escapeHTML(
                    transaction.description
                )}
            </h3>

            <p>
                ${escapeHTML(
                    transaction.category || "Other"
                )}

                ${
                    transaction.date
                        ? " • " +
                          escapeHTML(
                              transaction.date
                          )
                        : ""
                }
            </p>

            ${sourceHTML}

        </div>

        <div class="transaction-right">

            <span
                class="transaction-amount ${amountClass}">

                ${amountSign}
                ₦${Number(
                    transaction.amount
                ).toLocaleString()}

            </span>

            <button
                type="button"
                class="edit-btn"
                onclick="editTransaction(${transaction.id})">

                Edit

            </button>

            <button
                type="button"
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})">

                Delete

            </button>

        </div>

    `;


    transactionList.appendChild(
        transactionElement
    );

});

}

/* ========================================
DELETE TRANSACTION
======================================== */

function deleteTransaction(id) {

transactions =
    transactions.filter(
        function(transaction) {

            return transaction.id !== id;

        }
    );


saveTransactions();

refreshApp();

}

/* ========================================
EDIT TRANSACTION
======================================== */

function editTransaction(id) {

const transaction =
    transactions.find(
        function(transaction) {

            return transaction.id === id;

        }
    );


if (!transaction) {

    return;

}


editId.value =
    transaction.id;

editDescription.value =
    transaction.description;

editAmount.value =
    transaction.amount;

editDate.value =
    transaction.date || "";

editType.value =
    transaction.type;

editCategory.value =
    normalizeCategory(
        transaction.category
    );

editSource.value =
    transaction.source || "";


editModal.classList.add(
    "active"
);

}

/* ========================================
SAVE EDITED TRANSACTION
======================================== */

editForm.addEventListener(
"submit",
function(event) {

    event.preventDefault();


    const id =
        Number(editId.value);


    const transaction =
        transactions.find(
            function(transaction) {

                return transaction.id === id;

            }
        );


    if (!transaction) {

        return;

    }


    const newDescription =
        editDescription.value.trim();

    const newAmount =
        Number(editAmount.value);

    const newDate =
        editDate.value;

    const newType =
        editType.value;

    const newCategory =
        editCategory.value;

    const newSource =
        editSource.value.trim();


    if (
        newDescription === "" ||
        newAmount <= 0 ||
        !newDate
    ) {

        alert(
            "Please enter valid transaction details."
        );

        return;

    }


    transaction.description =
        newDescription;

    transaction.amount =
        newAmount;

    transaction.date =
        newDate;

    transaction.type =
        newType;

    transaction.category =
        newCategory;

    transaction.source =
        newSource;


    saveTransactions();

    refreshApp();

    editModal.classList.remove(
        "active"
    );

}

);

/* ========================================
CLOSE MODAL
======================================== */

closeModal.addEventListener(
"click",
function() {

    editModal.classList.remove(
        "active"
    );

}

);

cancelEdit.addEventListener(
"click",
function() {

    editModal.classList.remove(
        "active"
    );

}

);

/* ========================================
UPDATE SUMMARY
======================================== */

function updateSummary() {

let income = 0;

let expenses = 0;


transactions.forEach(
    function(transaction) {

        const amount =
            Number(transaction.amount) || 0;


        if (
            transaction.type === "income"
        ) {

            income += amount;

        } else {

            expenses += amount;

        }

    }
);


const currentBalance =
    income - expenses;


totalIncome.textContent =
    `₦${income.toLocaleString()}`;

totalExpenses.textContent =
    `₦${expenses.toLocaleString()}`;

balance.textContent =
    `₦${currentBalance.toLocaleString()}`;

}

/* ========================================
SAVE TRANSACTIONS
======================================== */

function saveTransactions() {

localStorage.setItem(
    "nyscTransactions",
    JSON.stringify(transactions)
);

}

/* ========================================
LOAD TRANSACTIONS
======================================== */

function loadTransactions() {

const savedTransactions =
    localStorage.getItem(
        "nyscTransactions"
    );


if (savedTransactions) {

    try {

        transactions =
            JSON.parse(savedTransactions);

        if (!Array.isArray(transactions)) {

            transactions = [];

        }

    } catch (error) {

        console.error(
            "Could not load transactions:",
            error
        );

        transactions = [];

    }

}


refreshApp();

}

/* ========================================
SAVE BUDGET
======================================== */

saveBudgetButton.addEventListener(
"click",
function() {

    const amount =
        Number(budgetInput.value);


    if (amount <= 0) {

        alert(
            "Please enter a valid budget."
        );

        return;

    }


    monthlyBudget =
        amount;


    localStorage.setItem(
        "nyscMonthlyBudget",
        monthlyBudget
    );


    updateBudget();

    budgetInput.value = "";

}

);

/* ========================================
UPDATE BUDGET
======================================== */

function updateBudget() {

let spent = 0;


transactions.forEach(
    function(transaction) {

        if (
            transaction.type === "expense"
        ) {

            spent +=
                Number(transaction.amount) || 0;

        }

    }
);


const remaining =
    monthlyBudget - spent;


budgetAmount.textContent =
    `₦${monthlyBudget.toLocaleString()}`;

budgetSpent.textContent =
    `₦${spent.toLocaleString()}`;

budgetRemaining.textContent =
    `₦${remaining.toLocaleString()}`;


if (monthlyBudget <= 0) {

    budgetProgressBar.style.width =
        "0%";

    budgetProgressBar.style.backgroundColor =
        "#22c55e";

    budgetMessage.textContent =
        "Set a budget to start tracking your spending.";

    return;

}


const percentage =
    (spent / monthlyBudget) * 100;


const progress =
    Math.min(percentage, 100);


budgetProgressBar.style.width =
    `${progress}%`;


if (percentage >= 100) {

    budgetProgressBar.style.backgroundColor =
        "#ef4444";

    budgetMessage.textContent =
        `You've exceeded your budget by ₦${Math.abs(
            remaining
        ).toLocaleString()}.`;

} else if (percentage >= 80) {

    budgetProgressBar.style.backgroundColor =
        "#f97316";

    budgetMessage.textContent =
        `Warning: you've used ${percentage.toFixed(
            0
        )}% of your budget.`;

} else if (percentage >= 60) {

    budgetProgressBar.style.backgroundColor =
        "#eab308";

    budgetMessage.textContent =
        `You've used ${percentage.toFixed(
            0
        )}% of your budget.`;

} else {

    budgetProgressBar.style.backgroundColor =
        "#22c55e";

    budgetMessage.textContent =
        `You've used ${percentage.toFixed(
            0
        )}% of your budget.`;

}

}

/* ========================================
LOAD BUDGET
======================================== */

function loadBudget() {

const savedBudget =
    localStorage.getItem(
        "nyscMonthlyBudget"
    );


if (savedBudget) {

    monthlyBudget =
        Number(savedBudget) || 0;

}


updateBudget();

}

/* ========================================
CATEGORY BREAKDOWN
======================================== */

function updateCategoryBreakdown() {

const categoryTotals = {};


transactions.forEach(
    function(transaction) {

        if (
            transaction.type !== "expense"
        ) {

            return;

        }


        const category =
            normalizeCategory(
                transaction.category
            );


        if (!categoryTotals[category]) {

            categoryTotals[category] = 0;

        }


        categoryTotals[category] +=
            Number(transaction.amount) || 0;

    }
);


categoryBreakdown.innerHTML = "";


const categories =
    Object.keys(categoryTotals);


if (categories.length === 0) {

    categoryBreakdown.innerHTML = `
        <p class="no-expenses">
            No expenses recorded yet.
        </p>
    `;

    return;

}


categories.forEach(
    function(category) {

        const categoryElement =
            document.createElement("div");


        categoryElement.classList.add(
            "category-item"
        );


        categoryElement.innerHTML = `

            <span class="category-name">
                ${escapeHTML(category)}
            </span>

            <span class="category-amount">
                ₦${categoryTotals[
                    category
                ].toLocaleString()}
            </span>

        `;


        categoryBreakdown.appendChild(
            categoryElement
        );

    }
);

}

/* ========================================
SPENDING CHART
======================================== */

function updateSpendingChart() {

const categoryTotals = {};


transactions.forEach(
    function(transaction) {

        if (
            transaction.type !== "expense"
        ) {

            return;

        }


        const category =
            normalizeCategory(
                transaction.category
            );


        if (!categoryTotals[category]) {

            categoryTotals[category] = 0;

        }


        categoryTotals[category] +=
            Number(transaction.amount) || 0;

    }
);


const categories =
    Object.keys(categoryTotals);

const amounts =
    Object.values(categoryTotals);


if (categoryChart) {

    categoryChart.destroy();

    categoryChart = null;

}


if (
    categories.length === 0 ||
    typeof Chart === "undefined"
) {

    return;

}


categoryChart =
    new Chart(
        spendingChart,
        {

            type: "doughnut",

            data: {

                labels: categories,

                datasets: [
                    {
                        data: amounts
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }
    );

}

/* ========================================
NORMALIZE OLD CATEGORY VALUES
======================================== */

function normalizeCategory(category) {

if (!category) {

    return "Other";

}


const value =
    String(category).toLowerCase();


const categoryMap = {

    food: "Food",

    transport: "Transport",

    data: "Data",

    accommodation: "Accommodation",

    betting: "Betting",

    other: "Other"

};


return categoryMap[value] || "Other";

}

/* ========================================
ESCAPE HTML
======================================== */

function escapeHTML(value) {

return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* ========================================
REFRESH EVERYTHING
======================================== */

function refreshApp() {

displayTransactions();

updateSummary();

updateBudget();

updateCategoryBreakdown();

updateSpendingChart();

}

/* ========================================
START APPLICATION
======================================== */

setDefaultDate();

loadBudget();

loadTransactions();