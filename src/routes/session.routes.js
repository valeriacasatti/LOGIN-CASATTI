import { Router } from "express";
import { usersService } from "../dao/index.js";

const router = Router();

//sign up
router.post("/signUp", async (req, res) => {
  try {
    const userInfo = req.body;
    const result = await usersService.addUser(userInfo);
    if (result) {
      res.render("logIn", {
        message: "user created successfully",
        style: "logIn.css",
      });
    }
  } catch (error) {
    res.render("signUp", { error: "error sign up user", style: "signUp.css" });
  }
});

//log in
router.post("/login", async (req, res) => {
  try {
    const loginForm = req.body;
    //corroborar si el user existe
    const user = await usersService.getUser({ email: loginForm.email });
    if (!user) {
      return res.render("logIn", {
        error: "user not found",
        style: "logIn.css",
      });
    }
    //corroborar contraseña
    if (user.password !== loginForm.password) {
      return res.render("logIn", {
        error: "incorrect credentials",
        style: "logIn.css",
      });
    }
    //info ok
    req.session.email = user.email;
    const userName = user.name;
    res.redirect("/home", 200, { userName, style: "home.css" });
  } catch (error) {
    res.render("logIn", { error: "login error", style: "logIn.css" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error)
        return res.render("profile", {
          error: "logout error",
          style: "profile.css",
        });
    });
    res.redirect("/", 200, { style: "logIn.css" });
  } catch (error) {
    res.render("profile", { error: "logout error", style: "profile.css" });
  }
});

export { router as sessionRouter };
