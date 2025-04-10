const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const DeclararionHS = sequelize.define(
  "suicide",
  {
    ID_SUPP_DECL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    AFFECTATION_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    COMMENTAIRE: {
      type: DataTypes.STRING(220),
      allowNull: false,
    },
    DATE_INSERTION: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    tableName: "heure_supp_declare",
    timestamps: false,
    hooks: {
      beforeValidate: (instance, options) => {
        if (instance.changed("DATE_INSERTION")) {
          // Set DATE_INSERTION to current timestamp
          instance.DATE_INSERTION = new Date();
        }
      }
    }
  }
);

module.exports = DeclararionHS;
