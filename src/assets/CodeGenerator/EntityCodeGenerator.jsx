import { capitalizeFirst, getSelectableRelations } from "./RelationshipUtils";

export default function EntityGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();

    let EntityCode = [];

    xmlDoc.querySelectorAll("Entity").forEach(node => {
        let entityFields = ``;
        let entityGetters = ``;
        let entitySetters = ``;
        let cardinality = ``;

        const entityName = node.getAttribute("name");
        const capitalizedName = capitalizeFirst(entityName);

        node.querySelectorAll("Field").forEach(field => {
            const fieldName = field.getAttribute("name");
            const capitalizedFieldName = capitalizeFirst(fieldName);
            const fieldType = field.getAttribute("type");

            if (field.getAttribute("pk") === "true") {
                entityFields = `    private ${fieldType} ${fieldName};\n` + entityFields;
                entityGetters = `    public ${fieldType} get${capitalizedFieldName}() { return ${fieldName}; }\n` + entityGetters;
                entitySetters = `    public void set${capitalizedFieldName}(${fieldType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n` + entitySetters;
            } else {
                entityFields += `    private ${fieldType} ${fieldName};\n`;
                entityGetters += `    public ${fieldType} get${capitalizedFieldName}() { return ${fieldName}; }\n`;
                entitySetters += `    public void set${capitalizedFieldName}(${fieldType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n`;
            }
        });

        const ownedRelations = getSelectableRelations(xmlDoc, node.getAttribute("id"));

        ownedRelations.forEach(relation => {
            const relationFieldCapitalized = capitalizeFirst(relation.fieldName);

            cardinality += `
    ${relation.annotation}
    @JoinColumn(name = "${relation.joinColumnName}")
    private ${relation.relatedName} ${relation.fieldName};
`;

            entityGetters += `    public ${relation.relatedName} get${relationFieldCapitalized}() { return ${relation.fieldName}; }\n`;
            entitySetters += `    public void set${relationFieldCapitalized}(${relation.relatedName} ${relation.fieldName}) { this.${relation.fieldName} = ${relation.fieldName}; }\n`;
        });

        const code = `package ${basePackage}.${smallBaseArtifact}.entity;
    
import jakarta.persistence.*;

@Entity
public class ${capitalizedName} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
${entityFields}${cardinality}
    // Getters
${entityGetters}
    // Setters
${entitySetters}
}`;

        EntityCode.push({ fileName: `${capitalizedName}.java`, code: code });
    });

    return EntityCode;
}