import { Router } from "express";
import { productsService } from "../dao/index.js";

const router = Router();

//get all products
router.get("/", async (req, res) => {
  try {
    const products = await productsService.getProducts();
    res.json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

//add product
router.post("/", async (req, res) => {
  try {
    const productInfo = req.body;
    const product = await productsService.addProduct(productInfo);
    if (product) {
      res.json({
        status: "success",
        message: `${productInfo.title} added successfully`,
      });
    } else {
      res.json({ status: "error", message: "error adding product..." });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//get product by id
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productsService.getProductById(pid);
    if (product) {
      res.json({
        status: "success",
        data: product,
      });
    } else {
      res.json({ status: "error", message: "error getting product..." });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//update product
router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedContent = req.body;
    const product = await productsService.updateProduct(pid, updatedContent);
    if (product) {
      res.json({
        status: "success",
        message: "product updated successfully",
        data: product,
      });
    } else {
      res.json({ status: "error", message: "error updating product..." });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//delete product
router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productsService.deleteProduct(pid);
    if (product) {
      res.json({ status: "success", message: "product deleted successfully" });
    } else {
      res.json({ status: "error", message: "error deleting product..." });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

export { router as productsRouter };
