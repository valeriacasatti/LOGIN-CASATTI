import { Router } from "express";
import { productsService } from "../dao/index.js";
import { cartsService } from "../dao/index.js";

const router = Router();

//home
router.get("/", async (req, res) => {
  try {
    const { limit = 3, page = 1, sort = { price: 1 } } = req.query;
    const query = {};
    const options = {
      limit,
      page,
      sort,
      lean: true,
    };
    const products = await productsService.getProductsPaginate(query, options);
    const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const data = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? //reemplaza la pagina actual, por la pagina anterior
          `${baseUrl.replace(
            `page=${products.page}`,
            `page=${products.prevPage}`
          )}`
        : null,
      nextLink: products.hasNextPage
        ? baseUrl.includes("page")
          ? baseUrl.replace(
              `page=${products.page}`,
              `page=${products.nextPage}`
            )
          : baseUrl.concat(`?page=${products.nextPage}`)
        : null,
      style: "home.css",
    };
    res.render("home", data);
  } catch (error) {
    res.render({ error: error.message });
  }
});

//real time products
router.get("/realTimeProducts", (req, res) => {
  res.render("realTime", { style: "realTime.css" });
});

//chat
router.get("/chat", (req, res) => {
  res.render("chat", { style: "chat.css" });
});

//cart
router.get("/cart", async (req, res) => {
  try {
    const cid = "65259c66629d0fc68ead263e";
    const cart = await cartsService.getCartById(cid);
    if (!cart) {
      return res.render("cart not found");
    } else {
      res.render("cart", { products: cart.products, style: "cart.css" });
    }
  } catch (error) {
    res.render({ error: error.message });
  }
});

export { router as viewsRouter };
