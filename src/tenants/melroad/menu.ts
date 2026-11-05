import type { MenuInput, SauceBase } from "@/config/menu-schema";

type ItemInput = MenuInput["items"][number];

const TRADITIONAL = { M: 1600, L: 1900, XL: 2200 };
const GOURMET = { M: 1800, L: 2300, XL: 2700 };

const pizza = (
  categoryId: "traditional" | "gourmet",
  id: string,
  name: string,
  description: string,
  toppings: string[],
  extra: { sauce?: SauceBase; tags?: ItemInput["tags"]; sizePrices?: Record<string, number> } = {},
): ItemInput => ({
  id,
  categoryId,
  name,
  description,
  price: (extra.sizePrices ?? (categoryId === "traditional" ? TRADITIONAL : GOURMET)).M,
  sizePrices: extra.sizePrices ?? (categoryId === "traditional" ? TRADITIONAL : GOURMET),
  art: { sauce: extra.sauce ?? "tomato", toppings },
  tags: extra.tags ?? [],
  halfAndHalf: true,
});

const item = (
  categoryId: string,
  id: string,
  name: string,
  price: number,
  description: string,
  extra: Partial<ItemInput> = {},
): ItemInput => ({ id, categoryId, name, price, description, ...extra });

const choices = (labels: string[], price = 0) =>
  labels.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, price }));

const MEAT = {
  id: "meat",
  label: "Choose your meat",
  min: 1,
  max: 1,
  choices: choices(["Lamb", "Chicken", "Mix"]),
};
const SAUCES = {
  id: "sauces",
  label: "Up to 3 sauces",
  min: 0,
  max: 3,
  choices: choices(["Garlic", "Chilli", "BBQ", "Tomato", "Sweet chilli", "Hummus", "Tzatziki"]),
};
const CAN = {
  id: "flavour",
  label: "Flavour",
  min: 1,
  max: 1,
  choices: choices(["Coke", "Coke No Sugar", "Sprite", "Lift"]),
};
const BOTTLE = {
  id: "flavour",
  label: "Flavour",
  min: 1,
  max: 1,
  choices: choices(["Coke", "Coke No Sugar", "Fanta", "Sprite", "Lift"]),
};
const GELATO = {
  id: "flavour",
  label: "Flavour",
  min: 1,
  max: 1,
  choices: choices(["Bacio", "Cassata", "Tartufo", "Tiramisu"]),
};

type DealInput = MenuInput["deals"][number];
type SlotInput = DealInput["slots"][number];

function deal(
  id: string,
  name: string,
  description: string,
  price: number,
  slots: SlotInput[],
  featured = false,
): DealInput {
  return { id, name, description, price, slots, featured };
}

function pizzas(categoryId: "traditional" | "gourmet", count: number, sizeId: string): SlotInput {
  const label = `${count > 1 ? `${count} ` : ""}${sizeId === "XL" ? "XL" : sizeId === "L" ? "large" : "medium"} ${categoryId} pizza${count > 1 ? "s" : ""}`;
  return { kind: "pick", id: "pizzas", label, count, categoryIds: [categoryId], sizeId };
}

const GARLIC_BREAD: SlotInput = { kind: "fixed", id: "garlic-bread", label: "Garlic bread" };
const A_CAN: SlotInput = { kind: "fixed", id: "can", label: "A can of soft drink" };
const A_BOTTLE: SlotInput = { kind: "fixed", id: "bottle", label: "1.25L soft drink" };
const SMALL_CHIPS: SlotInput = { kind: "fixed", id: "chips", label: "Small chips" };

const KEBAB_IMG = "/images/menu/kebab.webp";
const PARMA_IMG = "/images/menu/parma.webp";
const BURGER_IMG = "/images/menu/burger.webp";
const PASTA_IMG = "/images/menu/pasta.webp";
const SEAFOOD_IMG = "/images/menu/seafood.webp";
const WINGS_IMG = "/images/menu/wings.webp";
const SIDES_IMG = "/images/menu/chips.webp";
const SALAD_IMG = "/images/menu/salad.webp";
const DESSERT_IMG = "/images/menu/dessert.webp";
const DRINK_IMG = "/images/menu/drinks.webp";

export const melroadMenu: MenuInput = {
  categories: [
    {
      id: "traditional",
      name: "Traditional Pizzas",
      kind: "pizza",
      description: 'Medium 11" · Large 13" · XL 15"',
    },
    {
      id: "gourmet",
      name: "Gourmet Pizzas",
      kind: "pizza",
      description: "Loaded, saucier and a little fancy",
    },
    {
      id: "kebabs",
      name: "Kebab Station",
      kind: "standard",
      image: KEBAB_IMG,
      description: "Charcoal and rotisserie, halal",
    },
    { id: "parmas", name: "Parmas & Chicken", kind: "standard", image: PARMA_IMG },
    { id: "burgers", name: "Burgers", kind: "standard", image: BURGER_IMG },
    { id: "pasta", name: "Pasta & Risotto", kind: "standard", image: PASTA_IMG },
    { id: "seafood", name: "Seafood", kind: "standard", image: SEAFOOD_IMG },
    { id: "wings", name: "Chicken Wings", kind: "standard", image: WINGS_IMG },
    { id: "sides", name: "Sides", kind: "standard", image: SIDES_IMG },
    { id: "salads", name: "Salads", kind: "standard", image: SALAD_IMG },
    { id: "desserts", name: "Desserts", kind: "standard", image: DESSERT_IMG },
    { id: "drinks", name: "Drinks", kind: "standard", image: DRINK_IMG },
  ],
  items: [
    // ---------- traditional ----------
    pizza(
      "traditional",
      "supreme",
      "Supreme",
      "Hot salami, mushroom, capsicum, pineapple, smoked meat and Kalamata olives on tomato & mozzarella.",
      ["salami", "ham", "mushroom", "capsicum", "pineapple", "olive"],
      { tags: ["popular"] },
    ),
    pizza(
      "traditional",
      "the-lot",
      "The Lot",
      "Smoked meat, hot salami, minced beef, mushroom, capsicum, onion, pineapple and olives.",
      ["ham", "salami", "beef", "mushroom", "capsicum", "onion", "pineapple", "olive"],
    ),
    pizza("traditional", "aussie", "Aussie", "Smoked meat, bacon and a cracked egg on tomato & mozzarella.", [
      "ham",
      "bacon",
      "egg",
    ]),
    pizza(
      "traditional",
      "mexican",
      "Mexican",
      "Hot salami, capsicum, mushroom, olives, Spanish onion and jalapeños.",
      ["salami", "mushroom", "capsicum", "onion", "olive", "jalapeno"],
      { tags: ["spicy"] },
    ),
    pizza(
      "traditional",
      "napolitan",
      "Napolitan",
      "Anchovies, Kalamata olives and fresh basil on tomato & mozzarella.",
      ["anchovy", "olive", "basil"],
    ),
    pizza(
      "traditional",
      "pepperoni",
      "Pepperoni",
      "A full blanket of pepperoni on tomato & mozzarella.",
      ["pepperoni"],
      { tags: ["popular"] },
    ),
    pizza(
      "traditional",
      "capriciosa",
      "Capriciosa",
      "Smoked meat, mushroom and Kalamata olives on tomato & mozzarella.",
      ["ham", "mushroom", "olive"],
    ),
    pizza(
      "traditional",
      "margarita",
      "Margarita",
      "Sliced tomato, mozzarella and fresh basil.",
      ["tomato", "basil"],
      { tags: ["vegetarian"] },
    ),
    pizza(
      "traditional",
      "bbq-chicken",
      "BBQ Chicken",
      "Chicken, Spanish onion and a BBQ swirl on a BBQ base.",
      ["chicken", "onion", "bbq"],
      { sauce: "bbq", tags: ["popular"] },
    ),
    pizza(
      "traditional",
      "meat-lovers",
      "Meat Lovers",
      "Smoked meat, hot salami, minced beef and bacon finished with BBQ sauce.",
      ["ham", "salami", "beef", "bacon", "bbq"],
    ),
    pizza("traditional", "hawaiian", "Hawaiian", "Shaved smoked meat and pineapple on tomato & mozzarella.", [
      "ham",
      "pineapple",
    ]),
    pizza(
      "traditional",
      "vegetarian",
      "Vegetarian",
      "Onion, capsicum, mushrooms and olives on tomato & mozzarella.",
      ["mushroom", "capsicum", "onion", "olive"],
      { tags: ["vegetarian"] },
    ),
    pizza(
      "traditional",
      "garlic-cheese",
      "Garlic & Cheese",
      "Garlic butter base under a heavy layer of mozzarella.",
      ["cheese"],
      { sauce: "garlic", tags: ["vegetarian"], sizePrices: { M: 1300, L: 1600, XL: 1900 } },
    ),
    // ---------- gourmet ----------
    pizza(
      "gourmet",
      "american-burger",
      "American Burger",
      "Seasoned beef, onion, tomato and burger sauce on a cheesy base.",
      ["beef", "onion", "tomato", "aioli"],
    ),
    pizza(
      "gourmet",
      "meat-lover-deluxe",
      "Meat Lover Deluxe",
      "Pepperoni, smoked meat, hot salami, beef and bacon with a BBQ swirl.",
      ["pepperoni", "ham", "salami", "beef", "bacon", "bbq"],
      { sauce: "bbq" },
    ),
    pizza(
      "gourmet",
      "chicago-chilli-dog",
      "Chicago Chilli Dog",
      "Sliced frankfurt, onion, jalapeños and fresh chilli.",
      ["sausage", "onion", "jalapeno", "chilli"],
      { tags: ["spicy"] },
    ),
    pizza(
      "gourmet",
      "mediterranean",
      "Mediterranean",
      "Baby spinach, feta, olives, tomato and Spanish onion.",
      ["spinach", "feta", "olive", "tomato", "onion"],
      { tags: ["vegetarian"] },
    ),
    pizza(
      "gourmet",
      "mix-kebab",
      "Mix Kebab",
      "Lamb and chicken doner, onion and tomato finished with garlic sauce.",
      ["kebab", "onion", "tomato", "aioli"],
      { tags: ["popular", "halal"] },
    ),
    pizza(
      "gourmet",
      "tandoori",
      "Tandoori",
      "Tandoori chicken, capsicum and onion with a mint yoghurt swirl.",
      ["chicken", "capsicum", "onion", "aioli"],
      { sauce: "tandoori", tags: ["halal"] },
    ),
    pizza(
      "gourmet",
      "peri-peri",
      "Peri Peri",
      "Peri peri chicken, capsicum, onion and fresh chilli.",
      ["chicken", "capsicum", "onion", "chilli"],
      { tags: ["spicy"] },
    ),
    pizza(
      "gourmet",
      "bbq-chicken-gourmet",
      "BBQ Chicken Gourmet",
      "Chicken, bacon, pineapple and onion on a smoky BBQ base.",
      ["chicken", "bacon", "pineapple", "onion", "bbq"],
      { sauce: "bbq" },
    ),
    pizza(
      "gourmet",
      "chicken-creamy-mushroom",
      "Chicken & Creamy Mushroom",
      "Chicken and mushroom on a creamy garlic base.",
      ["chicken", "mushroom", "spinach"],
      { sauce: "creamy" },
    ),
    pizza(
      "gourmet",
      "smokey-bbq-chilli-chicken",
      "Smokey BBQ & Chilli Chicken",
      "Chicken, onion and fresh chilli on a smoky BBQ base.",
      ["chicken", "onion", "chilli", "bbq"],
      { sauce: "bbq", tags: ["spicy"] },
    ),
    pizza(
      "gourmet",
      "mushroom-gourmet",
      "Mushroom Gourmet",
      "Mushroom, spinach and feta on a garlic butter base.",
      ["mushroom", "spinach", "feta"],
      { sauce: "garlic", tags: ["vegetarian"] },
    ),
    pizza(
      "gourmet",
      "buffalo-margarita",
      "Buffalo Margarita",
      "Bocconcini, sliced tomato and fresh basil.",
      ["bocconcini", "tomato", "basil"],
      { tags: ["vegetarian"] },
    ),
    pizza(
      "gourmet",
      "tiger-prawn",
      "Tiger Prawn",
      "Garlic tiger prawns, spinach and chilli on a garlic base.",
      ["prawn", "spinach", "chilli"],
      { sauce: "garlic", tags: ["seafood"] },
    ),
    pizza(
      "gourmet",
      "seafood-lovers",
      "Seafood Lovers",
      "Prawns, calamari and anchovies on tomato & mozzarella.",
      ["prawn", "calamari", "anchovy"],
      { tags: ["seafood"] },
    ),
    // ---------- kebabs ----------
    item(
      "kebabs",
      "doner-kebab",
      "Doner Kebab",
      1700,
      "Lamb, chicken or mix in toasted bread with lettuce, tomato, onion and cheese.",
      { options: [MEAT, SAUCES], tags: ["popular", "halal"], image: KEBAB_IMG },
    ),
    item(
      "kebabs",
      "falafel-kebab",
      "Falafel Kebab",
      1700,
      "House falafel with salad, cheese and your sauces.",
      { options: [SAUCES], tags: ["vegetarian"], image: KEBAB_IMG },
    ),
    item(
      "kebabs",
      "chicken-shish-kebab",
      "Chicken Shish Kebab",
      2100,
      "Charcoal chicken skewer wrapped with salad and sauces.",
      { options: [SAUCES], tags: ["halal"], image: KEBAB_IMG },
    ),
    item(
      "kebabs",
      "adana-shish-kebab",
      "Adana Shish Kebab",
      2100,
      "Spiced minced lamb, charcoal grilled, wrapped with salad and sauces.",
      { options: [SAUCES], tags: ["halal", "spicy"], image: KEBAB_IMG },
    ),
    item("kebabs", "dinner-pack", "Dinner Pack", 3000, "Doner meat with rice, chips, salad and bread.", {
      options: [MEAT, SAUCES],
      tags: ["halal"],
      image: KEBAB_IMG,
    }),
    item(
      "kebabs",
      "adana-dinner-pack",
      "Adana Dinner Pack",
      3200,
      "Charcoal Adana with rice, chips, salad and bread.",
      { options: [SAUCES], tags: ["halal"], image: KEBAB_IMG },
    ),
    item(
      "kebabs",
      "chicken-shish-dinner-pack",
      "Chicken Shish Dinner Pack",
      3200,
      "Charcoal chicken shish with rice, chips, salad and bread.",
      { options: [SAUCES], tags: ["halal"], image: KEBAB_IMG },
    ),
    item(
      "kebabs",
      "falafel-dinner-pack",
      "Falafel Dinner Pack",
      2700,
      "Falafel with rice, chips, salad and bread.",
      { options: [SAUCES], tags: ["vegetarian"], image: KEBAB_IMG },
    ),
    item("kebabs", "meat-container", "Meat Container", 1800, "A box of doner meat with your sauces.", {
      options: [MEAT, SAUCES],
      tags: ["halal"],
      image: KEBAB_IMG,
    }),
    item("kebabs", "hsp", "HSP", 2200, "Halal snack pack: chips, doner meat, cheese and three sauces.", {
      options: [MEAT, SAUCES],
      tags: ["popular", "halal"],
      image: KEBAB_IMG,
    }),
    // ---------- parmas ----------
    item(
      "parmas",
      "creamy-mushroom-parma",
      "Chicken & Creamy Mushroom Parma",
      2700,
      "Crumbed chicken breast, creamy mushroom sauce and melted cheese, with chips & salad.",
      { image: PARMA_IMG },
    ),
    item(
      "parmas",
      "traditional-parma",
      "Traditional Parma",
      2400,
      "Napoli, smoked meat and cheese on crumbed chicken, with chips & salad.",
      { tags: ["popular"], image: PARMA_IMG },
    ),
    item(
      "parmas",
      "tropicana-parma",
      "Tropicana Parma",
      2400,
      "Napoli, smoked meat, pineapple and cheese, with chips & salad.",
      { image: PARMA_IMG },
    ),
    item(
      "parmas",
      "bocconcini-parma",
      "Bocconcini Parma",
      2400,
      "Napoli, bocconcini and basil, with chips & salad.",
      { image: PARMA_IMG },
    ),
    item(
      "parmas",
      "mexican-parma",
      "Mexican Parma",
      2400,
      "Napoli, salami, jalapeños and cheese, with chips & salad.",
      { tags: ["spicy"], image: PARMA_IMG },
    ),
    item(
      "parmas",
      "chicken-schnitzel",
      "Chicken Schnitzel",
      2300,
      "Golden crumbed chicken breast with chips & salad.",
      { image: PARMA_IMG },
    ),
    item(
      "parmas",
      "chicken-scaloppine",
      "Chicken Scaloppine",
      2600,
      "Pan-fried chicken in a creamy mushroom & white wine sauce.",
      { image: PARMA_IMG },
    ),
    // ---------- burgers ----------
    item(
      "burgers",
      "melroad-burger",
      "MelRoad Burger",
      2200,
      "Double beef, bacon, egg, cheese, lettuce, tomato and house sauce.",
      { tags: ["popular"], image: BURGER_IMG },
    ),
    item(
      "burgers",
      "cheesy-burger",
      "Cheesy Burger",
      1800,
      "Beef patty, double cheese, pickles, onion and ketchup.",
      { image: BURGER_IMG },
    ),
    item(
      "burgers",
      "double-trouble",
      "Double Trouble",
      2300,
      "Two beef patties, two cheese slices, pickles and burger sauce.",
      { image: BURGER_IMG },
    ),
    item("burgers", "dirty-bird", "Dirty Bird", 2300, "Crispy chicken, slaw, cheese and chipotle mayo.", {
      image: BURGER_IMG,
    }),
    item(
      "burgers",
      "cajun-chicken",
      "Cajun Chicken",
      2200,
      "Cajun grilled chicken, lettuce, tomato and aioli.",
      { tags: ["spicy"], image: BURGER_IMG },
    ),
    item(
      "burgers",
      "veggie-patch",
      "Veggie Patch",
      2100,
      "Vegetable patty, lettuce, tomato, cheese and aioli.",
      { tags: ["vegetarian"], image: BURGER_IMG },
    ),
    // ---------- pasta ----------
    item("pasta", "bolognese", "Bolognese", 2000, "Slow-cooked beef ragù with parmesan.", {
      image: PASTA_IMG,
    }),
    item("pasta", "carbonara", "Carbonara", 2100, "Bacon, egg and cream with cracked pepper.", {
      image: PASTA_IMG,
    }),
    item("pasta", "matriciana", "Matriciana", 2100, "Bacon, onion and chilli in napoli.", {
      tags: ["spicy"],
      image: PASTA_IMG,
    }),
    item("pasta", "pollo-fungi", "Pollo Fungi", 2100, "Chicken and mushroom in a creamy sauce.", {
      image: PASTA_IMG,
    }),
    item("pasta", "marinara", "Marinara", 2400, "Mixed seafood in a garlic napoli.", {
      tags: ["seafood"],
      image: PASTA_IMG,
    }),
    item(
      "pasta",
      "mediterranean-pasta",
      "Mediterranean",
      2000,
      "Olives, sun-dried tomato, spinach and feta.",
      { tags: ["vegetarian"], image: PASTA_IMG },
    ),
    item(
      "pasta",
      "vegetarian-alfredo",
      "Vegetarian Alfredo",
      2000,
      "Seasonal vegetables in a creamy alfredo.",
      { tags: ["vegetarian"], image: PASTA_IMG },
    ),
    item("pasta", "lasagna", "Lasagna", 2000, "Layered beef lasagna, baked with cheese.", {
      image: PASTA_IMG,
    }),
    item(
      "pasta",
      "chicken-mushroom-risotto",
      "Chicken & Mushroom Risotto",
      2200,
      "Arborio rice, chicken, mushroom and parmesan.",
      { image: PASTA_IMG },
    ),
    item(
      "pasta",
      "seafood-risotto",
      "Seafood Risotto",
      2400,
      "Arborio rice with prawns, calamari and mussels.",
      { tags: ["seafood"], image: PASTA_IMG },
    ),
    // ---------- seafood ----------
    item(
      "seafood",
      "crumbed-calamari",
      "Crumbed Calamari",
      2400,
      "Crumbed calamari with chips, salad and tartare.",
      { tags: ["seafood"], image: SEAFOOD_IMG },
    ),
    item("seafood", "fish-and-chips", "Fish & Chips", 2400, "Battered fish with chips, salad and lemon.", {
      tags: ["seafood", "popular"],
      image: SEAFOOD_IMG,
    }),
    item("seafood", "garlic-prawn", "Garlic Prawn", 2600, "Prawns in a creamy garlic sauce with rice.", {
      tags: ["seafood"],
      image: SEAFOOD_IMG,
    }),
    // ---------- wings ----------
    item("wings", "buffalo-wings", "Buffalo Wings", 1800, "Tossed in hot buffalo sauce.", {
      tags: ["spicy"],
      image: WINGS_IMG,
    }),
    item("wings", "peri-peri-wings", "Peri Peri Wings", 1800, "Peri peri spiced and chargrilled.", {
      tags: ["spicy"],
      image: WINGS_IMG,
    }),
    item("wings", "marinated-wings", "Marinated Wings", 1800, "House marinade, baked till sticky.", {
      image: WINGS_IMG,
    }),
    // ---------- sides ----------
    item("sides", "seasoned-chips", "Seasoned Chips", 1000, "Chicken-salt seasoned chips.", {
      tags: ["popular"],
      image: SIDES_IMG,
    }),
    item("sides", "garlic-bread", "Garlic Bread", 600, "Toasted with garlic butter.", {
      tags: ["vegetarian"],
      image: SIDES_IMG,
    }),
    item("sides", "garden-salad", "Garden Salad", 1000, "Lettuce, tomato, cucumber, onion and dressing.", {
      tags: ["vegetarian"],
      image: SALAD_IMG,
    }),
    item(
      "sides",
      "sauteed-vegetables",
      "Sauteed Vegetables",
      1000,
      "Seasonal vegetables tossed in garlic butter.",
      { tags: ["vegetarian"], image: SALAD_IMG },
    ),
    // ---------- salads ----------
    item("salads", "greek-salad", "Greek Salad", 1500, "Tomato, cucumber, olives, onion and feta.", {
      tags: ["vegetarian"],
      image: SALAD_IMG,
    }),
    item(
      "salads",
      "chicken-avocado-salad",
      "Chicken Avocado Salad",
      2200,
      "Grilled chicken, avocado, leaves and honey mustard.",
      { image: SALAD_IMG },
    ),
    // ---------- desserts ----------
    item(
      "desserts",
      "nutella-pizza",
      "Nutella Pizza",
      1500,
      "Warm base spread with Nutella, dusted with icing sugar.",
      { tags: ["popular"], image: DESSERT_IMG },
    ),
    item(
      "desserts",
      "nutella-marshmallow",
      "Nutella & Marshmallow",
      1500,
      "Nutella pizza topped with toasted marshmallows.",
      { image: DESSERT_IMG },
    ),
    item("desserts", "italian-zapoli", "Italian Zapoli", 1000, "Fried dough balls with cinnamon sugar.", {
      image: DESSERT_IMG,
    }),
    item("desserts", "nutella-calzone", "Nutella Calzone", 1500, "Folded and baked, filled with Nutella.", {
      image: DESSERT_IMG,
    }),
    item("desserts", "gelato", "Gelato", 900, "Two scoops of Italian gelato.", {
      options: [GELATO],
      image: DESSERT_IMG,
    }),
    // ---------- drinks ----------
    item("drinks", "can", "Can of soft drink", 500, "375ml can.", { options: [CAN], image: DRINK_IMG }),
    item("drinks", "bottle", "1.25L soft drink", 800, "1.25 litre bottle.", {
      options: [BOTTLE],
      image: DRINK_IMG,
    }),
    item("drinks", "water", "Mount Franklin Water", 600, "600ml still water.", { image: DRINK_IMG }),
  ],
  deals: [
    deal("deal-1", "Deal 1", "1 medium traditional pizza, garlic bread & a can", 2200, [
      pizzas("traditional", 1, "M"),
      GARLIC_BREAD,
      A_CAN,
    ]),
    deal("deal-2", "Deal 2", "2 medium traditional pizzas & 2 cans", 3500, [
      pizzas("traditional", 2, "M"),
      { kind: "fixed", id: "cans", label: "2 cans" },
    ]),
    deal(
      "deal-3",
      "Deal 3",
      "2 large traditional pizzas, garlic bread & 1.25L drink",
      4600,
      [pizzas("traditional", 2, "L"), GARLIC_BREAD, A_BOTTLE],
      true,
    ),
    deal("deal-4", "Deal 4", "2 large gourmet pizzas, garlic bread & 1.25L drink", 5200, [
      pizzas("gourmet", 2, "L"),
      GARLIC_BREAD,
      A_BOTTLE,
    ]),
    deal("deal-5", "Deal 5", "1 large traditional pizza, 1 pasta & 1.25L drink", 4300, [
      pizzas("traditional", 1, "L"),
      { kind: "pick", id: "pasta", label: "Pasta", count: 1, categoryIds: ["pasta"] },
      A_BOTTLE,
    ]),
    deal(
      "deal-6",
      "Deal 6",
      "Kebab, small chips & a can",
      2300,
      [
        { kind: "pick", id: "kebab", label: "Kebab", count: 1, itemIds: ["doner-kebab", "falafel-kebab"] },
        SMALL_CHIPS,
        A_CAN,
      ],
      true,
    ),
    deal(
      "deal-7",
      "Deal 7",
      "Burger, small chips & a can",
      2500,
      [
        { kind: "pick", id: "burger", label: "Burger", count: 1, categoryIds: ["burgers"] },
        SMALL_CHIPS,
        A_CAN,
      ],
      true,
    ),
    deal(
      "deal-8",
      "Deal 8",
      "Large gourmet pizza, garlic bread & a can",
      2900,
      [pizzas("gourmet", 1, "L"), GARLIC_BREAD, A_CAN],
      true,
    ),
    deal("deal-9", "Deal 9", "2 XL traditional pizzas, garlic bread & 1.25L drink", 5300, [
      pizzas("traditional", 2, "XL"),
      GARLIC_BREAD,
      A_BOTTLE,
    ]),
    deal("deal-10", "Deal 10", "2 XL gourmet pizzas, garlic bread & 1.25L drink", 6000, [
      pizzas("gourmet", 2, "XL"),
      GARLIC_BREAD,
      A_BOTTLE,
    ]),
    deal(
      "party-1",
      "Party Deal 1",
      "5 large traditional pizzas",
      8700,
      [pizzas("traditional", 5, "L")],
      true,
    ),
    deal("party-2", "Party Deal 2", "10 large traditional pizzas", 17100, [pizzas("traditional", 10, "L")]),
    deal("party-3", "Party Deal 3", "15 large traditional pizzas", 25300, [pizzas("traditional", 15, "L")]),
    deal(
      "party-4",
      "Party Deal 4",
      "20 large traditional pizzas",
      33400,
      [pizzas("traditional", 20, "L")],
      true,
    ),
  ],
};
