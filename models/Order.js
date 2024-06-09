const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {}

  Order.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      status: {
        field: "status",
        type: DataTypes.STRING,
      },
      userId: {
        field: "user_id",
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        field: "course_id",
        type: DataTypes.UUID,
        allowNull: false,
      },
      snapUrl: {
        field: "snap_url",
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaData: {
        field: "metadata",
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "orders",
      underscored: true,
      paranoid: true,
    }
  );

  return Order;
};
