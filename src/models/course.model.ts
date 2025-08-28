import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Course extends Model {
    public id!: number
    public program_id!: number
    public catalog_id!: number
    public teacher_id!: number | null
    public school_id!: number | null
    public credits!: number | null
    public alias!: string
    public school_year!: string | null
}

Course.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        program_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "program", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        catalog_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "course_catalog", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // set false if required
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // set false if required
            references: { model: "school", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        credits: {
            type: DataTypes.DECIMAL,
            allowNull: true, //change later
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_year: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Course",
        tableName: "course",
        timestamps: false,
        underscored: true,
    }
)
