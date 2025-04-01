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


const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    userID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id"
        }
    },
    
    eventID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Event",
            key: "id"
        }
    },

    seatsbooked:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    bookingdate : {
        type: DataTypes.DATE,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("Booked", "Cancelled"),
        allowNull: false
    }
   
});

module.exports = Booking;