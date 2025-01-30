const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "DBURL",
  { logging: false }
);

const Responses = require("./responses")(sequelize);
const Highlights = require("./highlights")(sequelize);
async function sync() {
  try {
    await Highlights.sync({ force: true });
    console.log("DATABASE SYNCED");
  } catch (e) {
    console.log(e);
  }
}

// sync();

module.exports = {
  Responses,
  Highlights,
};
