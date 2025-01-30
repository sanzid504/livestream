const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Responses = sequelize.define("Responses", {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "text", // text, poll
    },
    data: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  });
  return Responses;
};
