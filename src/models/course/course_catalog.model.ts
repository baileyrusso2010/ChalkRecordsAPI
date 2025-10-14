import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Course_Catalog extends Model {
    public id!: number
    public course_code!: string
    public title!: string
    public description!: string
}

Course_Catalog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        course_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
        },
        description: {
            type: DataTypes.TEXT,
        },
        //credits maybe.. wait on this
    },
    {
        sequelize,
        modelName: "Course_Catalog",
        tableName: "course_catalog",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
