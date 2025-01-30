const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "mysql://sheikh_hasina:^xbnjY-se6qmjCgFjRxnIyT>^fO<{61Y@ls-ff4ea189a95c93facdfc8b09c3a557cbad965897.c2oald75xobm.ap-south-1.rds.amazonaws.com/dbmaster",
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
