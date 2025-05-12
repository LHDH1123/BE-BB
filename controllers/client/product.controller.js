const Category = require("../../models/category.model");
const Brand = require("../../models/brand.model");
const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({ deleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const categoryIds = [
      ...new Set(
        products.map((p) => p.category_id?.toString()).filter(Boolean)
      ),
    ];
    const brandIds = [
      ...new Set(products.map((p) => p.brand_id?.toString()).filter(Boolean)),
    ];
    const productIds = products.map((p) => p._id.toString());

    const [categories, brands, reviews] = await Promise.all([
      Category.find({ _id: { $in: categoryIds } }).lean(),
      Brand.find({ _id: { $in: brandIds }, deleted: false }).lean(),
      Review.find({ product_id: { $in: productIds }, public: true }).lean(),
    ]);

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat._id.toString()] = cat.title;
      return acc;
    }, {});

    const brandMap = brands.reduce((acc, brand) => {
      acc[brand._id.toString()] = brand.name;
      return acc;
    }, {});

    // Gom review theo product_id
    const reviewMap = {};
    for (const review of reviews) {
      const id = review.product_id.toString();
      if (!reviewMap[id]) reviewMap[id] = [];
      reviewMap[id].push(review);
    }

    const productsWithDetails = products.map((product) => {
      const pid = product._id.toString();
      const productReviews = reviewMap[pid] || [];
      const ratingReviews = productReviews.filter(
        (r) => typeof r.rating === "number"
      );
      const avgRating =
        ratingReviews.reduce((sum, r) => sum + r.rating, 0) /
        (ratingReviews.length || 1);

      const discount = product.discountPercentage || 0;
      const newPrice = Math.round(product.price * (1 - discount / 100));

      return {
        ...product,
        nameCategory: categoryMap[product.category_id?.toString()] || null,
        nameBrand: brandMap[product.brand_id?.toString()] || null,
        avgRating: +avgRating.toFixed(1),
        totalReviews: ratingReviews.length,
        newPrice: newPrice,
      };
    });

    res.status(200).json(productsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.find({ _id: id }, { deleted: false });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getProductSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Đảm bảo Mongoose không bị nhầm `_id`
    const product = await Product.findOne({ slug, deleted: false }).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getAllProductSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Lấy category theo slug
    const category = await Category.findOne({ slug }).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Tìm tất cả category con
    const categorySet = new Set();
    const findChildren = async (id) => {
      categorySet.add(id.toString());
      const children = await Category.find({ parent_id: id }).lean();
      for (let cat of children) {
        await findChildren(cat._id);
      }
    };
    await findChildren(category._id);

    // Lấy danh sách sản phẩm thuộc category và các category con
    const products = await Product.find({
      category_id: { $in: Array.from(categorySet) },
      deleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const categoryIds = [
      ...new Set(
        products.map((p) => p.category_id?.toString()).filter(Boolean)
      ),
    ];
    const brandIds = [
      ...new Set(products.map((p) => p.brand_id?.toString()).filter(Boolean)),
    ];
    const productIds = products.map((p) => p._id.toString());

    // Lấy dữ liệu liên quan
    const [categories, brands, reviews] = await Promise.all([
      Category.find({ _id: { $in: categoryIds } }).lean(),
      Brand.find({ _id: { $in: brandIds }, deleted: false }).lean(),
      Review.find({ product_id: { $in: productIds }, public: true }).lean(),
    ]);

    // Map dữ liệu
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat._id.toString()] = cat.title;
      return acc;
    }, {});
    const brandMap = brands.reduce((acc, brand) => {
      acc[brand._id.toString()] = brand.name;
      return acc;
    }, {});
    const reviewMap = {};
    for (const review of reviews) {
      const id = review.product_id.toString();
      if (!reviewMap[id]) reviewMap[id] = [];
      reviewMap[id].push(review);
    }

    // Gắn thông tin chi tiết vào từng sản phẩm
    const productsWithDetails = products.map((product) => {
      const pid = product._id.toString();
      const productReviews = reviewMap[pid] || [];
      const ratingReviews = productReviews.filter(
        (r) => typeof r.rating === "number"
      );
      const avgRating =
        ratingReviews.reduce((sum, r) => sum + r.rating, 0) /
        (ratingReviews.length || 1);
      const likesCount = productReviews.filter((r) => r.liked).length;

      const discount = product.discountPercentage || 0;
      const newPrice = Math.round(product.price * (1 - discount / 100));

      return {
        ...product,
        nameCategory: categoryMap[product.category_id?.toString()] || null,
        nameBrand: brandMap[product.brand_id?.toString()] || null,
        avgRating: +avgRating.toFixed(1),
        totalReviews: ratingReviews.length,
        likesCount,
        newPrice,
      };
    });

    res.status(200).json(productsWithDetails);
  } catch (error) {
    console.error("Error fetching products by category slug:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getAllProductName = async (req, res) => {
  try {
    const { name } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({ deleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const categoryIds = [
      ...new Set(
        products.map((p) => p.category_id?.toString()).filter(Boolean)
      ),
    ];
    const brandIds = [
      ...new Set(products.map((p) => p.brand_id?.toString()).filter(Boolean)),
    ];
    const productIds = products.map((p) => p._id.toString());

    const [categories, brands, reviews] = await Promise.all([
      Category.find({ _id: { $in: categoryIds } }).lean(),
      Brand.find({ _id: { $in: brandIds }, deleted: false }).lean(),
      Review.find({ product_id: { $in: productIds }, public: true }).lean(),
    ]);

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat._id.toString()] = cat.title;
      return acc;
    }, {});

    const brandMap = brands.reduce((acc, brand) => {
      acc[brand._id.toString()] = brand.name;
      return acc;
    }, {});

    // Gom review theo product_id
    const reviewMap = {};
    for (const review of reviews) {
      const id = review.product_id.toString();
      if (!reviewMap[id]) reviewMap[id] = [];
      reviewMap[id].push(review);
    }

    const productsWithDetails = products.map((product) => {
      const pid = product._id.toString();
      const productReviews = reviewMap[pid] || [];
      const ratingReviews = productReviews.filter(
        (r) => typeof r.rating === "number"
      );
      const avgRating =
        ratingReviews.reduce((sum, r) => sum + r.rating, 0) /
        (ratingReviews.length || 1);

      const discount = product.discountPercentage || 0;
      const newPrice = Math.round(product.price * (1 - discount / 100));

      return {
        ...product,
        nameCategory: categoryMap[product.category_id?.toString()] || null,
        nameBrand: brandMap[product.brand_id?.toString()] || null,
        avgRating: +avgRating.toFixed(1),
        totalReviews: ratingReviews.length,
        newPrice: newPrice,
      };
    });

    // Lọc theo brand name từ URL
    const filteredProducts = productsWithDetails.filter(
      (product) => product.nameBrand?.toLowerCase() === name.toLowerCase()
    );

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
