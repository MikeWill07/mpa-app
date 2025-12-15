import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "abc", saveUninitialized: true, resave: true }));

// "Banco de dados" em memória
const users = [];

// Middleware simples de autenticação
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// Rotas MPA
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const found = users.find(u => u.username === username && u.password === password);

  if (!found) {
    return res.render("login", { error: "Usuário ou senha incorretos" });
  }

  req.session.user = found;
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));