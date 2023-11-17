const ingredientXPath =
  "//h1[contains(text(), 'Ingredients')] | //h2[contains(text(), 'Ingredients')] | //h3[contains(text(), 'Ingredients')] | //h4[contains(text(), 'Ingredients')] | //h5[contains(text(), 'Ingredients')] | //h6[contains(text(), 'Ingredients')] | //div[contains(text(), 'Ingredients')]";

const avoidedIngredients = [
  "Caffeine",
  "Yeast Extract",
  "Cocoa Mass",
  "Cocoa Solids",
  "Cheese",
  "Parmesan",
  "Mozzarella",
  "Cheddar",
  "Maltodextrin",
  "MSG",
  "Modified Potato Starch",
  "Modified Maize Starch",
  "Wheat",
  "Barley",
  "Spelt",
  "Chocolate",
  "Flavour Enhancers",
  "Flavour Enhancer",
  "Sweetener",
  "Stevia",
  "Aspartame",
  "Acesulfame",
  "Isomalt",
  "Sucralose",
  "Rapeseed",
  "Modified Starch",
];

let ingredients = getIngredients();
checkForIngredients();

const observer = new MutationObserver(() => {
  const newIngredients = getIngredients();

  if (ingredients !== newIngredients) {
    removeToast();
    ingredients = newIngredients;
    checkForIngredients();
  }
});

observer.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});

/**
 * Gets the ingredients listed on the page
 * @returns {string} A string of ingredients
 */
function getIngredients() {
  const ingredientsElement = document.evaluate(
    ingredientXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue?.nextElementSibling;

  return ingredientsElement ? ingredientsElement.textContent.toLowerCase() : "";
}

/**
 * Checks for unwanted ingredients and displays a toast if any are found
 * @returns {void} No object is returned
 */
function checkForIngredients() {
  const matchedIngredients = avoidedIngredients.filter((x) =>
    ingredients.includes(x.toLowerCase())
  );

  if (matchedIngredients.length > 0) {
    createToast(matchedIngredients);
  }
}

/**
 * Creates a toast at the top of the page
 * @param {string[]} matchedIngredients - List of matched ingredients
 * @returns {void} No object is returned
 */
function createToast(matchedIngredients) {
  const toast = document.createElement("div");
  toast.id = "allergy-toast";
  toast.className = "toast";
  toast.textContent = `⚠️ Product contains: ${matchedIngredients.join(", ")}`;
  document.body.appendChild(toast);
}

/**
 * Removes the toast if it exists
 * @returns {void} No object is returned
 */
function removeToast() {
  const toast = document.getElementById("allergy-toast");
  if (toast) {
    toast.remove();
  }
}
