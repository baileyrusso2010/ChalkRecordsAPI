import { Model, DataTypes, Optional } from "sequelize"
import sequelize from "../../database"

// Define attribute interface for stronger typing
export interface CTE_District_ProgramAttributes {
    id: number
    cte_district_id: number
    program_id: number
    authorization_date?: Date | null
    expiration_date?: Date | null
    active?: boolean | null
}

export type CTE_District_ProgramCreationAttributes = Optional<
    CTE_District_ProgramAttributes,
    "id" | "authorization_date" | "expiration_date" | "active"
>

//district level offering
export class CTE_District_Program
    extends Model<CTE_District_ProgramAttributes, CTE_District_ProgramCreationAttributes>
    implements CTE_District_ProgramAttributes
{
    public id!: number
    public cte_district_id!: number
    public program_id!: number
    public authorization_date?: Date | null
    public expiration_date?: Date | null
    public active?: boolean | null
}

CTE_District_Program.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        cte_district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_district",
                key: "id",
            },
        },
        program_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "program_catalog",
                key: "id",
            },
        },
        authorization_date: {
            type: DataTypes.DATE,
        },
        expiration_date: {
            type: DataTypes.DATE,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "CTE_District_Program",
        tableName: "cte_district_program",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
