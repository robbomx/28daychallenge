// Curated links to real recipes on recipetineats.com, keyed by the meal
// builder ingredient options. Titles and links only — no recipe content is
// reproduced here, in line with copyright limits.

export interface RecipeLink {
  title: string;
  url: string;
}

export const proteinRecipes: Record<string, RecipeLink> = {
  Chicken: { title: "My Go-To Chicken Breast Recipe", url: "https://www.recipetineats.com/chicken-breast-recipe/" },
  Eggs: { title: "Frittata", url: "https://www.recipetineats.com/frittata-recipe/" },
  "Greek yogurt": { title: "Tzatziki", url: "https://www.recipetineats.com/tzatziki/" },
  Steak: { title: "How to Cook Steak — Like a Chef", url: "https://www.recipetineats.com/how-to-cook-steak/" },
  Tuna: { title: "Tuna Steak", url: "https://www.recipetineats.com/tuna-steak/" },
};

export const carbRecipes: Record<string, RecipeLink> = {
  Rice: { title: "Garlic Rice", url: "https://www.recipetineats.com/garlic-rice/" },
  Potatoes: { title: "Easy Roast Potatoes", url: "https://www.recipetineats.com/roast-potatoes/" },
  Fruit: { title: "Strawberry Salad with Avocado", url: "https://www.recipetineats.com/strawberry-salad-with-avocado/" },
  Oats: { title: "Healthy Homemade Granola (Build Your Own)", url: "https://www.recipetineats.com/homemade-granola-muesli/" },
};

export const vegRecipes: Record<string, RecipeLink> = {
  "Mixed vegetables": { title: "Incredible BBQ Grilled Vegetables (Marinated)", url: "https://www.recipetineats.com/marinated-bbq-vegetables/" },
  Broccoli: { title: "Magic Broccoli", url: "https://www.recipetineats.com/magic-broccoli/" },
  Spinach: { title: "Garlic Sautéed Spinach", url: "https://www.recipetineats.com/garlic-sauteed-spinach/" },
  Peppers: { title: "Mexican Stuffed Peppers", url: "https://www.recipetineats.com/mexican-stuffed-peppers/" },
  "Salad greens": { title: "The Garden Salad", url: "https://www.recipetineats.com/garden-salad/" },
};
