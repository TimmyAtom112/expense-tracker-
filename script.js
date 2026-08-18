// ========================================
// GET HTML ELEMENTS
// ========================================

const form = document.getElementById("expense-form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

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

const dateInput = document.getElementById("date");

const sourceInput =
    document.getElementById("source");

// ========================================
// EDIT MODAL ELEMENTS
// ========================================

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

const editType =
    document.getElementById("edit-type");

const editCategory =
    document.getElementById("edit-category");

const closeModal =
    document.getElementById("close-modal");

const cancelEdit =
    document.getElementById("cancel-edit");



// ========================================
// BUDGET ELEMENTS
// ========================================

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


// ========================================
// DATA
// ========================================

let transactions = [];

let monthlyBudget = 0;


// ========================================
// ADD TRANSACTION
// ========================================

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


    // Make sure amount is valid

    if (description === "" || amount <= 0) {

        alert("Please enter a valid description and amount.");

        return;
    }


    const transaction = {

    id: Date.now(),

    description: description,

    amount: amount,

    type: type,

    category: category,

    date: dateInput.value,

    source: sourceInput.value.trim()

};


    transactions.push(transaction);


    // Save data

    saveTransactions();


    // Update everything

    displayTransactions();

    updateSummary();

    updateBudget();
    
    updateCategoryBreakdown();
    
    updateSpendingChart();


    // Clear form

    form.reset();

});


// ========================================
// DISPLAY TRANSACTIONS
// ========================================

function displayTransactions() {

    transactionList.innerHTML = "";


    transactions.forEach(function(transaction) {

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


        transactionElement.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${transaction.description}
                </h3>

                <p>
    ${transaction.category}
    ${transaction.date ? " • " + transaction.date : ""}
</p>

${transaction.source ? `
    <small>Source: ${transaction.source}</small>
` : ""}

            </div>


            <div class="transaction-right">

                <span
                    class="transaction-amount ${amountClass}">

                    ${amountSign}
                    ₦${transaction.amount.toLocaleString()}

                </span>


                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">

                    Edit

                </button>


                <button
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


// ========================================
// DELETE TRANSACTION
// ========================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(function(transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    displayTransactions();
    updateSummary();

    updateBudget();

    updateCategoryBreakdown();
    
    updateSpendingChart();

}


// ========================================
// EDIT TRANSACTION
// ========================================

function editTransaction(id) {

    const transaction =
        transactions.find(function(transaction) {

            return transaction.id === id;

        });


    if (!transaction) {

        return;

    }


    editId.value =
        transaction.id;

    editDescription.value =
        transaction.description;

    editAmount.value =
        transaction.amount;

    editType.value =
        transaction.type;

    editCategory.value =
        transaction.category;


    editModal.classList.add("active");

}


// ========================================
// SAVE EDITED TRANSACTION
// ========================================

editForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            Number(editId.value);


        const transaction =
            transactions.find(function(transaction) {

                return transaction.id === id;

            });


        if (!transaction) {

            return;

        }


        transaction.description =
            editDescription.value.trim();


        transaction.amount =
            Number(editAmount.value);


        transaction.type =
            editType.value;


        transaction.category =
            editCategory.value;


        saveTransactions();

        displayTransactions();
    updateSummary();
    
    updateBudget();
    
    updateCategoryBreakdown();
    
    updateSpendingChart();


        editModal.classList.remove(
            "active"
        );

    }
);


// ========================================
// CLOSE EDIT MODAL
// ========================================

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


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "income"
            ) {

                income += transaction.amount;

            } else {

                expenses += transaction.amount;

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


// ========================================
// SAVE TRANSACTIONS
// ========================================

function saveTransactions() {

    localStorage.setItem(
        "nyscTransactions",
        JSON.stringify(transactions)
    );

}


// ========================================
// LOAD TRANSACTIONS
// ========================================

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem(
            "nyscTransactions"
        );


    if (savedTransactions) {

        transactions =
            JSON.parse(savedTransactions);

    }


    displayTransactions();
    updateSummary();
    
    updateBudget();
    
    updateCategoryBreakdown();
    
    updateSpendingChart();

}


// ========================================
// SAVE BUDGET
// ========================================

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


        monthlyBudget = amount;


        localStorage.setItem(
            "nyscMonthlyBudget",
            monthlyBudget
        );


        updateBudget();


        budgetInput.value = "";

    }
);


// ========================================
// UPDATE BUDGET
// ========================================

function updateBudget() {

    let spent = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                spent += transaction.amount;

            }

        }
    );


    const remaining =
        monthlyBudget - spent;


    // Display amounts

    budgetAmount.textContent =
        `₦${monthlyBudget.toLocaleString()}`;


    budgetSpent.textContent =
        `₦${spent.toLocaleString()}`;


    budgetRemaining.textContent =
        `₦${remaining.toLocaleString()}`;


    // ====================================
    // PROGRESS BAR
    // ====================================

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


    // ====================================
    // PROGRESS BAR COLORS
    // ====================================

    if (percentage >= 100) {

        // RED

        budgetProgressBar.style.backgroundColor =
            "#ef4444";


        budgetMessage.textContent =
            `You've exceeded your budget by ₦${Math.abs(
                remaining
            ).toLocaleString()}.`;


    } else if (percentage >= 80) {

        // ORANGE

        budgetProgressBar.style.backgroundColor =
            "#f97316";


        budgetMessage.textContent =
            `Warning: you've used ${percentage.toFixed(
                0
            )}% of your budget.`;


    } else if (percentage >= 60) {

        // YELLOW

        budgetProgressBar.style.backgroundColor =
            "#eab308";


        budgetMessage.textContent =
            `You've used ${percentage.toFixed(
                0
            )}% of your budget.`;


    } else {

        // GREEN

        budgetProgressBar.style.backgroundColor =
            "#22c55e";


        budgetMessage.textContent =
            `You've used ${percentage.toFixed(
                0
            )}% of your budget.`;

    }

}


// ========================================
// LOAD BUDGET
// ========================================

function loadBudget() {

    const savedBudget =
        localStorage.getItem(
            "nyscMonthlyBudget"
        );


    if (savedBudget) {

        monthlyBudget =
            Number(savedBudget);

    }


    updateBudget();

}

function updateCategoryBreakdown() {

    const categoryTotals = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;

            }

            categoryTotals[transaction.category] +=
                transaction.amount;

        }

    });


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


    categories.forEach(function(category) {

        const categoryElement =
            document.createElement("div");

        categoryElement.classList.add(
            "category-item"
        );


        categoryElement.innerHTML = `

            <span class="category-name">
                ${category}
            </span>

            <span class="category-amount">
                ₦${categoryTotals[category].toLocaleString()}
            </span>

        `;


        categoryBreakdown.appendChild(
            categoryElement
        );

    });

}

let categoryChart = null;

function updateSpendingChart() {

    const categoryTotals = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;

            }

            categoryTotals[transaction.category] +=
                transaction.amount;

        }

    });


    const categories =
        Object.keys(categoryTotals);

    const amounts =
        Object.values(categoryTotals);


    // Destroy old chart before creating a new one

    if (categoryChart) {

        categoryChart.destroy();

    }


    // Don't create a chart if there are no expenses

    if (categories.length === 0) {

        return;

    }


    categoryChart = new Chart(
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

// ========================================
// START APPLICATION
// ========================================

loadBudget();

loadTransactions();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        console.log("Service Worker registered successfully!");
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}