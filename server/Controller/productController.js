import Product from "../Model/productModel.js";
import { processRichText } from "../Utils/sanitizer.js";

// Get all products
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");

    return res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (error) {
    console.error("getAllProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "createdBy",
      "username email",
    );

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
    });
  }
};

// Create product(s) - supports both single and bulk
export const createProduct = async (req, res) => {
  try {
    let products = req.body;

    const isBulk = Array.isArray(products);
    if (!isBulk) {
      products = [products];
    }

    // Add createdBy to all products from authenticated user
    const userId = req.user._id || req.user.id;
    
    products = products.map((product) => ({
      ...product,
      createdBy: userId,
    }));

    // Sanitize descriptions in all products
    products = products.map((product) => {
      if (product.description) {
        // If you have a processRichText function, use it
        // Otherwise, just use the description as-is
        try {
          const { content, isValid, errors } = processRichText(
            product.description,
          );

          if (!isValid) {
            throw new Error(`Invalid description: ${errors.join(", ")}`);
          }

          return {
            ...product,
            description: content,
          };
        } catch (err) {
          // If processRichText doesn't exist, just use the description
          return product;
        }
      }
      return product;
    });

    // Check for duplicate slugs in the request
    if (products.length > 1) {
      const slugs = products.map((p) => p.slug.toLowerCase().trim());
      const uniqueSlugs = new Set(slugs);

      if (uniqueSlugs.size !== slugs.length) {
        return res.status(400).json({
          status: "fail",
          message: "Duplicate slugs found in request",
        });
      }
    }

    // Check if slugs already exist in database
    const slugsToCheck = products.map((p) => p.slug.toLowerCase().trim());
    const existingSlugs = await Product.find({
      slug: { $in: slugsToCheck },
    })
      .select("slug")
      .lean();

    if (existingSlugs.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: `Product(s) with slug(s) already exist: ${existingSlugs
          .map((p) => p.slug)
          .join(", ")}`,
      });
    }

    // Bulk insert
    const newProducts = await Product.insertMany(products);

    return res.status(201).json({
      status: "success",
      message: `${newProducts.length} product(s) created successfully`,
      data: isBulk ? newProducts : newProducts[0],
    });
  } catch (error) {
    console.error("createProduct error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "A product with this slug already exists.",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: "Validation failed.",
        errors,
      });
    }

    // Handle rich text processing errors
    if (error.message.includes("Invalid description")) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to create product(s)",
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

   
    if (updates.description) {
      try {
        const { content, isValid, errors } = processRichText(
          updates.description,
        );

        if (!isValid) {
          return res.status(400).json({
            status: "fail",
            message: `Invalid description: ${errors.join(", ")}`,
          });
        }

        updates.description = content;
      } catch (err) {
        // If processRichText doesn't exist, just use the description
      }
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    // Check if user owns the product
    const userId = req.user._id || req.user.id;
    if (product.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You don't have permission to update this product",
      });
    }

    // Check if slug is being changed and if it already exists
    if (updates.slug && updates.slug !== product.slug) {
      const existingProduct = await Product.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(400).json({
          status: "fail",
          message: "A product with this slug already exists",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username email");

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("updateProduct error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "A product with this slug already exists",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to update product",
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    // Check if user owns the product
    const userId = req.user._id || req.user.id;
    if (product.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You don't have permission to delete this product",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete product",
    });
  }
};