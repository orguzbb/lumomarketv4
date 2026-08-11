import Category from '../models/Category.js';

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: "Kiyim va poyabzal", slug: "clothing" },
        { name: "Go'zallik", slug: "beauty" },
        { name: "Elektronika", slug: "electronics" },
        { name: "Maishiy texnika", slug: "appliances" },
        { name: "Uy-ro'zg'or", slug: "home" },
        { name: "Aksessuarlar", slug: "accessories" },
        { name: "Sport va hordiq", slug: "sports" },
        { name: "Avtotovarlar", slug: "auto" },
        { name: "Bolalar tovarlari", slug: "kids" },
        { name: "Kitoblar va kantselyariya", slug: "books" },
        { name: "Salomatlik va dori-darmon", slug: "health" }
      ];
      await Category.insertMany(defaultCategories);
      console.log("[SEED] Default categories seeded successfully!");
    }
  } catch (err) {
    console.error("[SEED] Error seeding categories:", err);
  }
};
