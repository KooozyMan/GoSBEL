export default function EntityGenerator(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    let EntityCode = [];
    let entityFields = ``;
    let entityGetters = ``;
    let entitySetters = ``;

    xmlDoc.querySelectorAll("Entity").forEach(node => {
        entityFields = ``;
        entityGetters = ``;
        entitySetters = ``;

        const entityName = node.getAttribute("name");
        const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
        const basePackage = `com.example.${entityName}`;

        node.querySelectorAll("Field").forEach(field => {
            const fieldName = field.getAttribute("name");
            const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            const fieldType = field.getAttribute("type");

            entityFields += `    private ${fieldType} ${fieldName};\n`;
            entityGetters += `    public ${fieldType} get${capitalizedFieldName}() { return ${fieldName}; }\n`;
            entitySetters += `    public void set${capitalizedFieldName}(${fieldType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n`;
        });

        const code = `package ${basePackage};
    
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class ${capitalizedName} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
${entityFields}
    // Getters
${entityGetters}
    // Setters
${entitySetters}
}`;
        EntityCode.push({ fileName: `${capitalizedName}.java`, code: code });
    });

    return EntityCode;
}