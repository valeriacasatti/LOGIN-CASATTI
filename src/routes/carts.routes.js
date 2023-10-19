import { Router } from "express";
import { cartsService, productsService } from "../dao/index.js";

const router = Router();

//get all carts
router.get("/", async (req, res) => {
  try {
    const carts = await cartsService.getCarts();
    res.json({ data: carts });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//add cart
router.post("/", async (req, res) => {
  try {
    const cart = await cartsService.addCart();
    res.json({
      status: "success",
      message: "cart added successfully",
      data: cart,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//get cart id
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartsService.getCartById(cid);
    res.json({ data: `cart ID: ${cid}`, cart });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//delete cart
router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    await cartsService.deleteCart(cid);
    res.json({
      status: "success",
      message: "cart deleted successfully",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//agregar productos al arreglo del carrito seleccionado
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    //verificar que el cart y el product existan
    await cartsService.getCartById(cid);
    await productsService.getProductById(pid);

    const result = await cartsService.addProduct(cid, pid);

    res.json({
      status: "success",
      message: `product ${pid} added to cart ${cid} successfully`,
      data: result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//eliminar product del cart
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartsService.getCartById(cid);
    const result = await cartsService.deleteProductCart(cid, pid);
    res.json({
      status: "success",
      message: "product deleted from cart successfully",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//actualizar quantity del product en el cart
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { newQuantity } = req.body;
    await cartsService.getCartById(cid);
    const result = await cartsService.updateProductCart(cid, pid, newQuantity);
    res.json({
      data: result,
      status: "success",
      message: "product updated successfully",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

export { router as cartsRouter };
