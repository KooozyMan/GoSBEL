import { capitalizeFirst, getSelectableRelations, expandManyToMany } from "./RelationshipUtils";

export default function EntityGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    expandManyToMany(xmlDoc);
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
            const fieldValidations = field.children;
            
            // Build validation annotations string
            let validationAnnotations = "";
            
            if (fieldValidations.length > 0) {
                Array.from(fieldValidations).forEach(validation => {
                    const validationName = validation.nodeName;
                    const value = validation.getAttribute("value");
                    
                    switch (validationName) {
                        case "Min":
                            validationAnnotations += `    @Min(${value})\n`;
                            break;
                        case "Max":
                            validationAnnotations += `    @Max(${value})\n`;
                            break;
                        case "NotNull":
                            if (value === "true") {
                                validationAnnotations += `    @NotNull\n`;
                            }
                            break;
                        case "Positive":
                            if (value === "true") {
                                validationAnnotations += `    @Positive\n`;
                            }
                            break;
                        case "DecimalMin":
                            validationAnnotations += `    @DecimalMin("${value}")\n`;
                            break;
                        case "DecimalMax":
                            validationAnnotations += `    @DecimalMax("${value}")\n`;
                            break;
                        case "Regex":
                            validationAnnotations += `    @Pattern(regexp = "${value}")\n`;
                            break;
                        case "MaxCharacters":
                            validationAnnotations += `    @Size(max = ${value})\n`;
                            break;
                        default:
                            validationAnnotations += `    // Unknown validation: ${validationName}\n`;
                    }
                });
            }
            
            const fieldDeclaration = `${validationAnnotations}    private ${fieldType} ${fieldName};\n`;
            
            if (field.getAttribute("pk") === "true") {
                entityFields = fieldDeclaration + entityFields;
                entityGetters = `    public ${fieldType} get${capitalizedFieldName}() { return ${fieldName}; }\n` + entityGetters;
                entitySetters = `    public void set${capitalizedFieldName}(${fieldType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n` + entitySetters;
            } else {
                entityFields += fieldDeclaration;
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