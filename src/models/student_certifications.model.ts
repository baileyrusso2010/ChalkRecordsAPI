import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class StudentCertifications extends Model {}

StudentCertifications.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        certificationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "certification",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "student",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.CHAR(7),
        },
        //code if applicable
        //state reported
    },
    {
        sequelize,
        modelName: "Student_Certifications",
        tableName: "student_certifications",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
