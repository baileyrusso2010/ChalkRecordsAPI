import { DataTypes, Model } from "sequelize"
import sequelize from "../../../database"
import { Template_Row } from "./template_row.model"
import { Template_Column } from "./template_column.model"

export class Template_Section extends Model {
    public id!: number
    public template_id!: number
    public key!: string
    public label!: string
    public order!: number
    public section_type!: string
    public source_table!: string
    public uses_rubric!: boolean

    public rows?: Template_Row[]
    public columns?: Template_Column[]
}

Template_Section.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        template_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "form_templates",
                key: "id",
            },
        },
        key: {
            // "cdos_performances, cdoes_technical, assessments"
            type: DataTypes.STRING,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        uses_rubric: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        section_type: {
            type: DataTypes.ENUM("manual", "linked"),
            allowNull: true,
            defaultValue: "manual",
        },
        source_table: {
            //this is optional
            type: DataTypes.STRING,
            allowNull: true,
        },
        //order
    },
    {
        sequelize,
        modelName: "Template_Section",
        tableName: "template_sections",
        timestamps: false,
        underscored: true,
    },
)
