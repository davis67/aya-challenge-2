// BUDGET CONTROLLER
var budgetController = (function () {
  var Budget = function (id, category, value) {
    this.id = id;
    this.category = category;
    this.value = value;
    this.percentage = -1;
  };

  Budget.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Budget.prototype.getPercentage = function () {
    return this.percentage;
  };

  var calculateTotal = function () {
    var sum = 0;
    data.allItems.forEach(function (cur) {
      sum += cur.value;
    });
    data.totals = sum;
  };

  var data = {
    allItems: [],
    totals: 0,
    biodata: {
      income: 0,
      age: 0,
      malitalstatus: "",
      dependants: 0,
      gender: "",
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (category, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems.length > 0) {
        ID = data.allItems[data.allItems.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type

      newItem = new Budget(ID, category, val);

      // Push it into our data structure
      data.allItems.push(newItem);

      // Return the new element
      return newItem;
    },

    addBioData: function (obj) {
      data.biodata = obj;
      return obj;
    },

    deleteItem: function (id) {
      var ids, index;

      ids = data.allItems.map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems.splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income
      calculateTotal();

      // Calculate the budget: income - expenses
      data.budget = data.biodata.income - data.totals;

      // calculate the percentage of income that we spent
      if (data.biodata.income > 0) {
        data.percentage = Math.round((data.totals / data.biodata.income) * 100);
      } else {
        data.percentage = -1;
      }

      // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
    },

    calculatePercentages: function () {
      data.allItems.forEach(function (cur) {
        cur.calcPercentage(data.bio.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      console.log(data);
      return {
        budget: data.budget,
        totalInc: data.biodata.income,
        totalExp: data.totals,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    inputIncome: ".income__input",
    inputAge: ".age__input",
    inputMalitalStatus: ".malitalstatus__input",
    inputDependants: ".dependants__input",
    inputGender: ".gender__input",
    inputCategory: ".category__input",
    inputValue: ".value__input",
    inputCategoryBtn: ".category__btn",
    inputBioDataBtn: ".biodata__btn",
    biodataContainer: ".biodata_container__overall",
    inputCategory: ".category__input",
    inputCategory: ".category__input",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getBudgetInput: function () {
      return {
        category: document.querySelector(DOMstrings.inputCategory).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    getIncomeInput: function () {
      return {
        income: document.querySelector(DOMstrings.inputIncome).value,
        age: document.querySelector(DOMstrings.inputAge).value,
        gender: document.querySelector(DOMstrings.inputGender).value,
        malitalstatus: document.querySelector(DOMstrings.inputMalitalStatus)
          .value,
        dependants: document.querySelector(DOMstrings.inputDependants).value,
      };
    },
    addListItem: function (obj) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      element = DOMstrings.expensesContainer;

      html =
        '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.category);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    addBioDataToUI: function (obj) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      document
        .querySelector(DOMstrings.biodataContainer)
        .classList.add("hidden");
      document.querySelector(".category_overall").classList.remove("hidden");
      document.querySelector(".expenses").classList.remove("hidden");
      element = DOMstrings.incomeContainer;
      html = `<div class="budget__income clearfix">
      <div class="budget__income_item">
          <div class="budget__income--text">Income</div>
          <div class="right">
              <div class="budget__income--value">₦%income%</div>
              <div class="budget__income--percentage">&nbsp;</div>
          </div>
      </div>
      <div class="budget__income_item">
          <div class="budget__income--text">Age</div>
          <div class="right">
              <div class="budget__income--value">%age%</div>
              <div class="budget__income--percentage">&nbsp;</div>
          </div>
      </div>
      <div class="budget__income_item">
          <div class="budget__income--text">Gender</div>
          <div class="right">
              <div class="budget__income--value">%gender%</div>
              <div class="budget__income--percentage">&nbsp;</div>
          </div>
      </div>
      <div class="budget__income_item">
          <div class="budget__income--text">Marital Status</div>
          <div class="right">
              <div class="budget__income--value">%malitalstatus%</div>
              <div class="budget__income--percentage">&nbsp;</div>
          </div>
      </div>
      <div class="budget__income_item">
          <div class="budget__income--text">Number of Dependants</div>
          <div class="right">
              <div class="budget__income--value">%dependants%</div>
              <div class="budget__income--percentage">&nbsp;</div>
          </div>
      </div>
            </div>`;

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%income%", obj.income);
      newHtml = newHtml.replace("%age%", obj.age);
      newHtml = newHtml.replace("%malitalstatus%", obj.malitalstatus);
      newHtml = newHtml.replace("%gender%", obj.gender);
      newHtml = newHtml.replace("%dependants%", obj.dependants);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputCategory + ", " + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.expensesLabel).textContent =
        "₦" + obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "0%";
        }
      });
    },

    changedType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputCategory +
          "," +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();
    document
      .querySelector(DOM.inputCategoryBtn)
      .addEventListener("click", ctrlAddItem);
    document
      .querySelector(DOM.inputBioDataBtn)
      .addEventListener("click", storeBioData);
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  var storeBioData = function () {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getIncomeInput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addBioData(input);

    // 3. Add the item to the UI
    UICtrl.addBioDataToUI(newItem);
  };

  var ctrlAddItem = function () {
    var inputBudget, newItem;

    // 1. Get the field input data
    inputBudget = UICtrl.getBudgetInput();

    if (
      inputBudget.category !== "" &&
      !isNaN(inputBudget.value) &&
      inputBudget.value > 0
    ) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(inputBudget.category, inputBudget.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Lets get our hands dirty");

      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
