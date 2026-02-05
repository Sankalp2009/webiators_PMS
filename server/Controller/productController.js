import Product from "../Model/productModel.js";
import { processRichText } from "../Utils/sanitizer.js";

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().lean();

    return res.status(200).json({
      status: "success",
      result: products.length,
      message:
        products.length > 0
          ? "Products retrieved successfully"
          : "No products found",
      data: products,
    });
  } catch (err) {
    console.error("getAllProduct error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("createdBy", "username email")
      .lean()
      .exec();

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("getProductById error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve product",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let products = req.body;

    const isBulk = Array.isArray(products);
    if (!isBulk) {
      products = [products];
    }

    // Sanitize descriptions in all products
    products = products.map((product) => {
      if (product.description) {
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
      }
      return product;
    });

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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Sanitize description if present
    if (updateData.description) {
      const { content, isValid, errors } = processRichText(
        updateData.description,
      );

      if (!isValid) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid description",
          errors,
        });
      }

      updateData = {
        ...updateData,
        description: content,
      };
    }

    const existingProduct = await Product.findById(id)
      .select("createdBy")
      .lean();

    if (!existingProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    if (
      req.user &&
      existingProduct.createdBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this product",
      });
    }

    if (updateData.slug) {
      const duplicate = await Product.findOne({
        slug: updateData.slug.toLowerCase().trim(),
        _id: { $ne: id },
      }).lean();

      if (duplicate) {
        return res.status(400).json({
          status: "fail",
          message: "A product with this slug already exists",
        });
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        lean: true,
      },
    ).exec();

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .select("createdBy productName")
      .lean();

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    if (req.user && product.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to delete this product",
      });
    }

    await Product.findByIdAndDelete(id).lean().exec();

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: { _id: product._id, productName: product.productName },
    });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete product",
    });
  }
};
