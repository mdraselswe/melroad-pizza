/**
 * Sample food photography from Unsplash (Unsplash License: free to use,
 * attribution appreciated). Replace with the restaurant's own photos.
 * Pizzas are illustrated in code, not photographed.
 */
export const PHOTO_CREDITS = [
  { file: "kebab.webp", subject: "Kebab", author: "Alexander Mils", id: "photo-1529006557810-274b9b2fc783" },
  {
    file: "parma.webp",
    subject: "Parmas & schnitzel",
    author: "mahsa shamshiri fard",
    id: "photo-1653983483420-5bbd23c89cbf",
  },
  {
    file: "burger.webp",
    subject: "Burgers",
    author: "amirali mirhashemian",
    id: "photo-1568901346375-23c9450c58cd",
  },
  { file: "pasta.webp", subject: "Pasta", author: "Homescreenify", id: "photo-1622973536968-3ead9e780960" },
  {
    file: "seafood.webp",
    subject: "Fish & chips",
    author: "Meelan Bawjee",
    id: "photo-1579208030886-b937da0925dc",
  },
  {
    file: "wings.webp",
    subject: "Chicken wings",
    author: "Chad Montano",
    id: "photo-1567620832903-9fc6debc209f",
  },
  {
    file: "chips.webp",
    subject: "Chips & sides",
    author: "Mitchell Luo",
    id: "photo-1630384060421-cb20d0e0649d",
  },
  {
    file: "salad.webp",
    subject: "Salads",
    author: "Tania Melnyczuk",
    id: "photo-1607532941433-304659e8198a",
  },
  { file: "dessert.webp", subject: "Desserts", author: "Lama Roscu", id: "photo-1567206563064-6f60f40a2b57" },
  { file: "drinks.webp", subject: "Drinks", author: "Jonny Caspari", id: "photo-1527960471264-932f39eb5846" },
] as const;

export const unsplashUrl = (id: string) => `https://images.unsplash.com/${id}`;
