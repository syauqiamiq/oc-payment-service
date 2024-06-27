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
			status: {
				field: "status",
				type: DataTypes.STRING,
			},
			paymentType: {
				field: "payment_type",
				type: DataTypes.STRING,
			},
			orderId: {
				field: "order_id",
				type: DataTypes.UUIDV4,
			},
			rawResponse: {
				field: "raw_response",
				type: DataTypes.JSON,
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
			tableName: "payment_logs",
			underscored: true,
			paranoid: true,
		}
	);

	return PaymentLog;
};
