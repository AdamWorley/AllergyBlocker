const xpath =
  "//h1[contains(text(), 'Ingredients')] | //h2[contains(text(), 'Ingredients')] | //h3[contains(text(), 'Ingredients')] | //h4[contains(text(), 'Ingredients')] | //h5[contains(text(), 'Ingredients')] | //h6[contains(text(), 'Ingredients')] | //div[contains(text(), 'Ingredients')]";

const element = document.getElementById("allergy-toast");

let ingredients = getIngredients();
checkForIngredients();

const observer = new MutationObserver(() => {
  const newIngredients = getIngredients();

  if (ingredients !== newIngredients) {
    let toast = document.getElementById("allergy-toast");
    if (toast) {
      toast.remove();
    }

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
 * @returns {string[]} A List of ingredients
 */
function getIngredients() {
  const ingredientsElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue?.nextElementSibling;

  if (ingredientsElement) {
    return ingredientsElement.textContent.toLowerCase();
  }

  return [];
}

function checkForIngredients() {
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

  const matchedIngredients = avoidedIngredients.filter((x) =>
    ingredients.includes(x.toLowerCase())
  );

  if (matchedIngredients.length > 0) {
    createToast(matchedIngredients);
  }
}

/**
 * Creates a toast at the top of the page
 * @param {string[]} matchedIngredients
 * @returns {void} No object is returned
 */
function createToast(matchedIngredients) {
  const toast = document.createElement("div");
  toast.id = "allergy-toast";
  toast.className = "toast";
  toast.textContent = `⚠️ Product contains: ${matchedIngredients.join(", ")}`;
  document.body.appendChild(toast);
}
