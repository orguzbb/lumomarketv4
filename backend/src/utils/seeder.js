import Category from '../models/Category.js';
import Banner from '../models/Banner.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const seedCategories = async () => {
  try {
    // Delete old health category if exists
    await Category.deleteOne({ slug: "health" });

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
        { name: "Kitoblar va kantselyariya", slug: "books" }
      ];
      await Category.insertMany(defaultCategories);
      console.log("[SEED] Default categories seeded successfully!");
    }
  } catch (err) {
    console.error("[SEED] Error seeding categories:", err);
  }
};

export const seedBanners = async () => {
  try {
    const count = await Banner.countDocuments();
    if (count === 0) {
      const defaultBanners = [
        {
          title: "Katta mavsumiy chegirmalar",
          highlight: "-30% gacha arzon",
          subtitle: "Kiyim-kechak, elektronika va barcha turdagi sifatli mahsulotlar",
          tag: "Super Aksiya",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
          bgGradient: "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]",
          textColor: "text-[#1E293B]",
          tagBg: "bg-white text-slate-800",
          buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
          isActive: true,
          order: 1
        },
        {
          title: "Smartfonlar va gadjetlar",
          highlight: "Muddatli to'lov 0-0-12",
          subtitle: "Boshlang'ich to'lovsiz, 12 oyga bo'lib to'lang",
          tag: "Rasmiy kafolat 1 yil",
          image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
          bgGradient: "from-[#F7F0FF] via-[#EDDCFF] to-[#E2C4FF]",
          textColor: "text-[#2E1065]",
          tagBg: "bg-white text-purple-900",
          buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
          isActive: true,
          order: 2
        },
        {
          title: "Simsiz TWS quloqchinlar",
          highlight: "-30% Super narx",
          subtitle: "Shovqin so'ndiruvchi zamonaviy akustika",
          tag: "Top sotuv",
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
          bgGradient: "from-[#F0F5FF] via-[#E1EAFF] to-[#D0DFFF]",
          textColor: "text-[#0F172A]",
          tagBg: "bg-white text-blue-900",
          buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
          isActive: true,
          order: 3
        },
        {
          title: "Uy va oshxona texnikalari",
          highlight: "Bepul etkazish",
          subtitle: "Barcha maishiy texnikalarga super arzon narxlar",
          tag: "Super narx kafolati",
          image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80",
          bgGradient: "from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]",
          textColor: "text-[#064E3B]",
          tagBg: "bg-white text-emerald-900",
          buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
          isActive: true,
          order: 4
        }
      ];
      await Banner.insertMany(defaultBanners);
      console.log("[SEED] Default banners seeded successfully!");
    }
  } catch (err) {
    console.error("[SEED] Error seeding banners:", err);
  }
};

export const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // Find or create a default system seller / admin user
      let adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        adminUser = await User.create({
          fullname: "Lumo Admin",
          email: "admin@lumomarket.uz",
          password: hashedPassword,
          role: "admin"
        });
      }

      // Get categories map
      const categories = await Category.find();
      const catMap = {};
      categories.forEach(c => catMap[c.slug] = c._id);

      const defaultProducts = [
        {
          name: "Apple AirPods Pro 2 Simsiz quloqchinlar MagSafe kassa bilan",
          description: "Yuqori sifatli faol shovqin bosuvchi simsiz quloqchinlar. 30 soatgacha avtonom ishlash va MagSafe tezkor zaryadlash moslamasi.",
          price: 2850000,
          oldPrice: 3400000,
          discount: 16,
          stock: 15,
          rating: 4.9,
          reviewsCount: 342,
          category: catMap["electronics"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Erkaklar uchun zamonaviy sport krossovkasi Uzum Edition",
          description: "Yengil, havo o'tkazuvchi matodan tayyorlangan qulay sport krossovkalari. Kundalik yugurish va fitnes uchun ideal.",
          price: 249000,
          oldPrice: 320000,
          discount: 22,
          stock: 30,
          rating: 4.8,
          reviewsCount: 198,
          category: catMap["clothing"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Simsiz quloqchinlar TWS Bluetooth 5.3 Shovqin so'ndirish bilan",
          description: "Bluetooth 5.3 texnologiyasi bilan ishlovchi bas sado beruvchi TWS mikrofonli quloqchinlar.",
          price: 199000,
          oldPrice: 290000,
          discount: 31,
          stock: 25,
          rating: 4.9,
          reviewsCount: 512,
          category: catMap["electronics"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Aqlli soat Smart Watch Ultra Series 9 (Suvdan himoyalangan)",
          description: "Yurak urishi, qondagi kislorod, adrametr hamda sport rejimlariga ega suv o'tkazmaydigan aqlli soat.",
          price: 349000,
          oldPrice: 480000,
          discount: 27,
          stock: 20,
          rating: 4.7,
          reviewsCount: 145,
          category: catMap["accessories"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Oshxona kombayni Ko'p funksiyali blender set 800W",
          description: "Oshxonada eng yaqin yordamchingiz: sharbat chiqargich, kokteyl blender, go'sht qiymalagich jamlanmasi.",
          price: 420000,
          oldPrice: 550000,
          discount: 23,
          stock: 12,
          rating: 5.0,
          reviewsCount: 89,
          category: catMap["appliances"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Ayollar kremi Nemlantiruvchi va parvarishlovchi Hyaluronic Acid",
          description: "Terini chuqur oziqlantiruvchi, ajinlarga qarshi va nemlantiruvchi yuz kremi.",
          price: 95000,
          oldPrice: 130000,
          discount: 26,
          stock: 45,
          rating: 4.9,
          reviewsCount: 276,
          category: catMap["beauty"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Simsiz elektr choynak Zanglamaydigan po'lat 1.8 Litr",
          description: "Avtomatik o'chish funksiyasiga ega, xavfsiz va tez suvituvchi zanglamas po'lat choynak.",
          price: 155000,
          oldPrice: 210000,
          discount: 26,
          stock: 18,
          rating: 4.6,
          reviewsCount: 110,
          category: catMap["appliances"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        },
        {
          name: "Erkaklar kostyum shimi Klassik dizayn Premium Paxta",
          description: "Klassik uslubdagi premium sifatli matodan tayyorlangan kostyum-shim to'plami.",
          price: 380000,
          oldPrice: 520000,
          discount: 27,
          stock: 10,
          rating: 4.9,
          reviewsCount: 64,
          category: catMap["clothing"],
          seller: adminUser._id,
          images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80" }],
          status: "active"
        }
      ];
      await Product.insertMany(defaultProducts);
      console.log("[SEED] Default products seeded successfully!");
    }
  } catch (err) {
    console.error("[SEED] Error seeding products:", err);
  }
};
