const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Highlights = sequelize.define("Highlights", {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.STRING,
      defaultValue: "private",
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "poll", //  poll, question, info
    },
    data: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  });
  return Highlights;
};
