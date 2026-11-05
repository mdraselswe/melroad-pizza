import type { MenuInput } from "@/config/menu-schema";

const SIZES = { M: 1900, L: 2400, XL: 2900 };

export const basilBrickMenu: MenuInput = {
  categories: [
    { id: "pizza", name: "Woodfired Pizza", kind: "pizza" },
    { id: "pasta", name: "Pasta", kind: "standard", image: "/images/menu/pasta.webp" },
    { id: "drinks", name: "Drinks", kind: "standard", image: "/images/menu/drinks.webp" },
  ],
  items: [
    {
      id: "margherita",
      categoryId: "pizza",
      name: "Margherita",
      description: "San Marzano, fior di latte, basil.",
      price: SIZES.M,
      sizePrices: SIZES,
      art: { sauce: "tomato", toppings: ["bocconcini", "basil"] },
      tags: ["vegetarian", "popular"],
      halfAndHalf: true,
    },
    {
      id: "diavola",
      categoryId: "pizza",
      name: "Diavola",
      description: "Hot salami, chilli, fior di latte.",
      price: SIZES.M,
      sizePrices: SIZES,
      art: { sauce: "tomato", toppings: ["salami", "chilli"] },
      tags: ["spicy"],
      halfAndHalf: true,
    },
    {
      id: "funghi",
      categoryId: "pizza",
      name: "Funghi",
      description: "Mushroom, garlic, thyme on a white base.",
      price: SIZES.M,
      sizePrices: SIZES,
      art: { sauce: "garlic", toppings: ["mushroom", "spinach"] },
      tags: ["vegetarian"],
      halfAndHalf: true,
    },
    {
      id: "prosciutto",
      categoryId: "pizza",
      name: "Prosciutto",
      description: "Prosciutto, rocket, parmesan.",
      price: SIZES.M,
      sizePrices: SIZES,
      art: { sauce: "tomato", toppings: ["ham", "spinach"] },
      halfAndHalf: true,
    },
    {
      id: "cacio-pepe",
      categoryId: "pasta",
      name: "Cacio e Pepe",
      description: "Pecorino, black pepper.",
      price: 2400,
      image: "/images/menu/pasta.webp",
    },
    {
      id: "lemonade",
      categoryId: "drinks",
      name: "House Lemonade",
      description: "Made daily.",
      price: 600,
      image: "/images/menu/drinks.webp",
    },
  ],
  deals: [
    {
      id: "date-night",
      name: "Date Night",
      description: "2 large pizzas & 2 lemonades",
      price: 5200,
      featured: true,
      slots: [
        {
          kind: "pick",
          id: "pizzas",
          label: "2 large pizzas",
          count: 2,
          categoryIds: ["pizza"],
          sizeId: "L",
        },
        { kind: "fixed", id: "drinks", label: "2 house lemonades" },
      ],
    },
  ],
};
