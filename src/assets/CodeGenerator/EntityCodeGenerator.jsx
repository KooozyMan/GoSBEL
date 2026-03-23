export default function EntityGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();

    let EntityCode = [];
    let entityFields = ``;
    let entityGetters = ``;
    let entitySetters = ``;
    let cardinality = ``;
    let relations = [];

    xmlDoc.querySelectorAll("Edge").forEach(edge => {
        const srcId = edge.getAttribute("source");
        const targetId = edge.getAttribute("target");
        const relationship = edge.getAttribute("relationship");

        if (relationship === '1-m') {
            relations.push({ OwnerId: targetId, inverseId: srcId, relation: "@ManyToOne" });

        } else if (relationship === 'm-1') {
            relations.push({ OwnerId: srcId, inverseId: targetId, relation: "@ManyToOne" });

        } else if (relationship === '1-1') {
            relations.push({ OwnerId: srcId, inverseId: targetId, relation: "@OneToOne" });

        } else if (relationship === 'm-m') {
            relation = '@ManyToMany';
            // bridge table TODO
        }
    });

    xmlDoc.querySelectorAll("Entity").forEach(node => {
        entityFields = ``;
        entityGetters = ``;
        entitySetters = ``;
        cardinality = ``;

        const entityName = node.getAttribute("name");
        const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

        node.querySelectorAll("Field").forEach(field => {
            const fieldName = field.getAttribute("name");
            const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            const fieldType = field.getAttribute("type");

            entityFields += `    private ${fieldType} ${fieldName};\n`;
            entityGetters += `    public ${fieldType} get${capitalizedFieldName}() { return ${fieldName}; }\n`;
            entitySetters += `    public void set${capitalizedFieldName}(${fieldType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n`;
        });

        const ownedRelations = relations.filter(r => r.OwnerId === node.getAttribute("id"));

        if (ownedRelations.length != 0) {
            cardinality = ownedRelations.map(r => {
                const inverseName = xmlDoc.querySelector(`Entity[id="${r.inverseId}"]`).getAttribute("name").toLowerCase();
                const inverseNameCapitalized = inverseName.charAt(0).toUpperCase() + inverseName.slice(1);
                return `\n\t${r.relation}\n\t@joinColumn(name = "${inverseName}_id")\n\tprivate ${inverseNameCapitalized} ${inverseName};\n`;
            }).join("");
        }

        const code = `package ${basePackage}.${smallBaseArtifact}.entity;
    
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

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