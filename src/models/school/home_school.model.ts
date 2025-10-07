import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Home_School extends Model {}

Home_School.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        cte_school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_school",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
        },
        phone_number: {
            type: DataTypes.STRING(15),
        },
    },
    {
        sequelize,
        modelName: "Home_School",
        tableName: "home_school",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
