import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Booking",  // Foreign key to Booking table
            key: "id"
        }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.ENUM("Credit Card", "Debit Card", "UPI", "Net Banking"),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Pending", "Completed", "Failed"),
        defaultValue: "Pending"
    }
});
module.exports = Payment;