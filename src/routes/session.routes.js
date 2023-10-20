import { Router } from "express";
import { usersService } from "../dao/index.js";

const router = Router();

//sign up
router.post("/signUp", async (req, res) => {
  try {
    const userInfo = req.body;
    const result = await usersService.addUser(userInfo);
    if (result) {
      res.render("logIn", { message: "user created successfully" });
    }
  } catch (error) {
    res.render("signUp", { error: "error sign up user" });
  }
});

//log in
router.post("/login", async (req, res) => {
  try {
    const loginForm = req.body;
    //corroborar si el user existe
    const user = await usersService.getUser({ email: loginForm.email });
    if (!user) {
      return res.render("logIn", { error: "user not found" });
    }
    //corroborar contraseña
    if (user.password !== loginForm.password) {
      return res.render("logIn", { error: "incorrect credentials" });
    }
    //info ok
    req.session.email = user.email;
    const userName = user.name;
    res.render("home", { userName });
  } catch (error) {
    res.render("logIn", { error: "login error" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) return res.render("profile", { error: "logout error" });
    });
    res.redirect("/");
  } catch (error) {
    res.render("profile", { error: "logout error" });
  }
});

export { router as sessionRouter };
