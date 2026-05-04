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
        let libraries = [];

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
                            if (!libraries.includes('Min')) {
                                libraries.push('Min');
                            }
                            break;
                        case "Max":
                            validationAnnotations += `    @Max(${value})\n`;
                            if (!libraries.includes('Max')) {
                                libraries.push('Max');
                            }
                            break;
                        case "NotNull":
                            if (value === "true") {
                                validationAnnotations += `    @NotNull\n`;
                                if (!libraries.includes('NotNull')) {
                                    libraries.push('NotNull');
                                }
                            }
                            break;
                        case "Positive":
                            if (value === "true") {
                                validationAnnotations += `    @Positive\n`;
                                if (!libraries.includes('Positive')) {
                                    libraries.push('Positive');
                                }
                            }
                            break;
                        case "DecimalMin":
                            validationAnnotations += `    @DecimalMin("${value}")\n`;
                            if (!libraries.includes('DecimalMin')) {
                                libraries.push('DecimalMin');
                            }
                            break;
                        case "DecimalMax":
                            validationAnnotations += `    @DecimalMax("${value}")\n`;
                            if (!libraries.includes('DecimalMax')) {
                                libraries.push('DecimalMax');
                            }
                            break;
                        case "Regex":
                            validationAnnotations += `    @Pattern(regexp = "${value}")\n`;
                            if (!libraries.includes('Pattern')) {
                                libraries.push('Pattern');
                            }
                            break;
                        case "MaxCharacters":
                            validationAnnotations += `    @Size(max = ${value})\n`;
                            if (!libraries.includes('Size')) {
                                libraries.push('Size');
                            }
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

        const imports = libraries.map(library => `import jakarta.validation.constraints.${library};`).join('\n');
        const code = `package ${basePackage}.${smallBaseArtifact}.entity;
    
import jakarta.persistence.*;
${imports}
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