import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

// Test database connection
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Test DB connected");
  } catch (error) {
    console.error("Test DB connection failed:", error);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

// Generate test user data
export const generateTestUser = () => ({
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: "Test@123456",
});

// Generate test product data
export const generateTestProduct = (userId) => ({
  metaTitle: "Test Product Meta Title",
  productName: "Test Product Name",
  slug: `test-product-${Date.now()}`,
  price: 99.99,
  discountedPrice: 79.99,
  description: "This is a test product description with enough characters.",
  galleryImages: [
    {
      url: "https://example.com/image.jpg",
      alt: "Test image",
    },
  ],
  isActive: true,
  createdBy: userId,
});
