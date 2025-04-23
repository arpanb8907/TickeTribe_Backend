import { Sequelize, DataTypes } from 'sequelize';
import dotenv from "dotenv"

dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        // validate: {
        //     isEmail: true
        // }
    },
    phone:{
        type : DataTypes.STRING,
        allowNull:false,
        unique : true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
   
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }

},{ 
    tableName : "User",
    freezeTableName : true  
});
export {sequelize}
export default User
//module.exports = User;
