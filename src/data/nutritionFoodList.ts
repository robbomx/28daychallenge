// Allowed food list, based on the reference guide provided for this program.
// Portion guides are per serving, per meal — "palms/fists/thumbs" sizing is a
// simple visual portion method rather than exact weights.

export interface FoodGroup {
  title: string;
  portionGuide: string; // e.g. "8 palms (men) / 4 palms (women) per day"
  tone: "orange" | "success" | "sand" | "olive";
  items: string[];
  note?: string;
}

export const foodGroups: FoodGroup[] = [
  {
    title: "Protein",
    portionGuide: "8 palms/day (men) · 4 palms/day (women)",
    tone: "orange",
    items: [
      "Chicken",
      "Veal",
      "Pork",
      "Kangaroo",
      "Turkey",
      "White fish",
      "Lobster",
      "Mussels",
      "Oysters",
      "Scallops",
      "Prawns",
      "Venison",
      "WPI protein powder",
      "Plant protein powder",
    ],
  },
  {
    title: "Fat Protein",
    portionGuide: "For each serve, drop one serve from Good Fats",
    tone: "olive",
    items: ["Salmon", "Trout", "Steak (all cuts)", "Lamb", "Duck", "Quail", "Eggs"],
    note: "These proteins bring their own fat content — swap out one Good Fats serving whenever you eat these.",
  },
  {
    title: "Vegetables",
    portionGuide: "8 fists/day (men) · 8 fists/day (women)",
    tone: "success",
    items: [
      "Bok choy",
      "Broccoli",
      "Brussels sprouts",
      "Cabbage",
      "Cauliflower",
      "Chinese cabbage",
      "Chinese broccoli",
      "Collard greens",
      "Daikon",
      "Horseradish",
      "Kale",
      "Pak choi",
      "Watercress",
      "Asparagus",
      "Artichoke hearts",
      "Spinach",
      "Celery",
      "Zucchini",
      "Peppers (all kinds)",
      "Parsley",
      "Eggplant",
      "Green onions",
    ],
  },
  {
    title: "Good Fats",
    portionGuide: "3 thumbs/day (men) · 3 thumbs/day (women)",
    tone: "sand",
    items: [
      "Coconut oil",
      "Macadamia oil",
      "Avocado oil",
      "Olive oil",
      "Organic butter",
      "Avocado",
      "Almonds",
      "Brazil nuts",
      "Cashew nuts",
      "Hazelnuts",
      "Macadamia nuts",
      "Pecans",
      "Pine nuts",
      "Pistachios",
      "Olives",
    ],
  },
  {
    title: "Carbs",
    portionGuide: "2 fists/day — weeks 3-4 only",
    tone: "olive",
    items: [
      "Brown rice",
      "Sweet potato",
      "Quinoa",
      "Wholemeal pita wrap",
      "Gluten free bread",
      "Gluten free pasta",
      "Apples",
      "Pears",
      "Berries",
    ],
    note: "Carbs are held back in weeks 1-2 and reintroduced from week 3 onward.",
  },
];
