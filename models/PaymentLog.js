const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class PaymentLog extends Model {}

	PaymentLog.init(
		{
			// Model attributes are defined here
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			images: DataTypes.STRING,
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
			tableName: "payment-logs",
			underscored: true,
			paranoid: true,
		}
	);

	return PaymentLog;
};
