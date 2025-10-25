require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model"); //importo o constructor do user.model
const Note = require("./models/note.model"); //importo o constructor do note.model
const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//criar conta
app.post("/create-account", async (req, res) => {
  console.log(req.body); //retorna undefined se eu não definir pelo menos um objeto vazio no postman <{}>...(mesmo definindo a request como POST com o body:raw & JSON)
  //assim o undefined retorna como um erro de corpo inválido e não crasha os testes
  if (!req.body || typeof req.body !== "object") {
    return res
      .status(400)
      .json({ error: true, message: "Corpo da requisição ausente ou inválido" });
  }

  const { fullName, email, password } = req.body; //dá pra usar <|| {}> aqui para garantir que mesmo que não seja enviado um objeto json seja criado um...mas não me parece tão eficiente quanto a msg de erro acima;
  if (!fullName) {
    return res.status(400).json({ error: true, message: "É necessário o nome completo" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "É necessário um email" });
  }
  if (!password) {
    return res.status(400).json({ error: true, message: "É necessário uma senha" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({ error: true, message: "Usuário já existe" });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });

  return res.json({ error: false, user, accessToken, message: "Registro bem sucedido!" });
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Favor inserir o seu email." });
  }
  if (!password) {
    return res.status(400).json({ message: "Favor inserir o sua senha." });
  }
  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "36000m" });
    return res.json({ error: false, message: "Login efetuado com sucesso", email, accessToken });
  } else {
    return res.status(400).json({ error: true, message: "Login inválido" });
  }
});

//Get usuario
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

//Adicionar nota
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title) {
    return res.status(400).json({ error: true, message: "O título é necessário." });
  }

  if (!content) {
    return res.status(400).json({ error: true, message: "O conteúdo é necessário." });
  }

  try {
    const note = new Note({ title, content, tags: tags || [], userId: user._id });
    await note.save();
    return res.json({ error: false, note, message: "Nota adicionada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Erro interno de servidor" });
  }
});

//Editar note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return req.status(400).json({ error: true, message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Nota não encontrada" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({ error: false, note, message: "Nota editada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Erro interno de servidor" });
  }
});

//Get todas as notas
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({ error: false, notes, message: "Todas as notas recuperadas com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Erro interno de servidor" });
  }
});

//Delete nota
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Nota não encontrada" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({ error: false, message: "Nota deletada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Erro interno de servidor" });
  }
});

//Update isPinned Value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Nota não encontrada" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({ error: false, note, message: "Nota editada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Erro interno de servidor" });
  }
});

//Search notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notas encontradas com sucesso",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.listen(8000);

module.exports = app;

//
