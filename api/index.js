const express = require("express");
const app = express();
const cors = require("cors");
const { nanoid } = require("nanoid");
global.models = require("./models");

app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

const { Responses, Highlights } = global.models;

app.post("/highlight/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data } = req.body;


    const highlight = await Highlights.create({
      _id: nanoid(6),
      room_id: id,
      type,
      visibility: "public",
      data,
    });

    console.log(highlight) 
    res.json(highlight.data);
  } catch (e) {
    console.log(e);
  }
});

app.post("/highlight/:id/publishing", async (req, res) => {
  try {
    const { id } = req.params;
    const { visibility } = req.body;

    await Highlights.update(
      {
        visibility,
      },
      {
        where: { _id: id },
      }
    );

    res.json({ message: "success" });
  } catch (e) {
    console.log(e);
  }
});

app.get("/highlight/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await Highlights.findOne({
      where: { room_id: id },
      order: [["createdAt", "DESC"]],
    });

    if (rs.visibility !== "archive") res.json(rs);
  } catch (e) {
    console.log(e);
  }
});

app.post("/highlight/action/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;

    // create user response and user can't have multiple responses

    const highlight = await Highlights.findOne({
      where: { _id: id },
    });

    if (highlight) {
      if (highlight.data.options[option]) {
        highlight.data.options[option].vote += 1;
        highlight.changed("data", true);
        await highlight.save();
        console.log("highlight", highlight.data);
      }
    }

    res.json({ message: "success" });
  } catch (e) {
    console.log(e);
  }
});

app.get("/room/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await Responses.findAll({
      where: { room_id: id, type: "text" },
      order: [["createdAt", "ASC"]],
    });

    res.json(rs.map((r) => r.data));
  } catch (e) {
    console.log(e);
  }
});

app.post("/room/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data } = req.body;

    console.log("id", data);
    await Responses.create({
      _id: nanoid(6),
      room_id: id,
      type,
      data,
    });

    res.json({ message: "success" });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3005, () => {
  console.log("Server listening on port 3005");
});
