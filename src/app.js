import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { cartsService, chatsService, productsService } from "./dao/index.js";
import { chatsRouter } from "./routes/chat.routes.js";
import { connectDB } from "./config/dbConnection.js";

const port = 8080;
const app = express();

app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(port, () =>
  console.log(`server running on port ${port}`)
);

const io = new Server(httpServer);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/chats", chatsRouter);

//PRODUCTS
io.on("connection", async (socket) => {
  try {
    console.log("client connected");
    const products = await productsService.getProducts();
    socket.emit("products", products);

    socket.on("addProduct", async (dataProduct) => {
      try {
        const productToSave = {
          title: dataProduct.title,
          description: dataProduct.description,
          price: dataProduct.price,
          code: dataProduct.code,
          stock: dataProduct.stock,
          status: dataProduct.status,
          category: dataProduct.category,
          thumbnail: dataProduct.thumbnail,
        };
        await productsService.addProduct(productToSave);

        const updatedProducts = await productsService.getProducts();
        io.emit("products", updatedProducts);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("deleteProduct", async (id) => {
      try {
        await productsService.deleteProduct(id);
        const updatedProducts = await productsService.getProducts();

        socket.emit("products", updatedProducts);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

///CHAT
io.on("connection", async (socket) => {
  try {
    const chat = await chatsService.getMessages();
    socket.emit("chatHistory", chat);
    socket.on("messageChat", async (data) => {
      try {
        chat.push(data);

        io.emit("chatHistory", chat);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("authenticated", (data) => {
      socket.broadcast.emit("newUser", `${data} is connected`);
    });

    socket.on("messageChat", async (data) => {
      try {
        if (data.message.trim() !== "") {
          await chatsService.addMessage(data);
          const messageDB = await chatsService.getMessages();
          io.emit("chatHistory", messageDB);
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//CART
io.on("connection", async (socket) => {
  try {
    const cart = await cartsService.getCarts();
    socket.emit("products", cart);
  } catch (error) {
    console.log(error);
  }
});
