export default function EntityGenerator(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    let EntityCode = [];
    let entityFields = ``;
    let entityGetters = ``;
    let entitySetters = ``;
    let relations = [];

    // still underwork
    xmlDoc.querySelectorAll("Edge").forEach(edge => {
        // relations.push({ source: edge.getAttribute("source"), target: edge.getAttribute("target"), field: null });
        let relation = '';
        if (edge.getAttribute("relationship") === '1-m') {
            relation = '@OneToMany';
        } else if (edge.getAttribute("relationship") === 'm-1') {
            relation = '@ManyToOne';
        } else if (edge.getAttribute("relationship") === '1-1') {
            relation = '@OneToOne';
        } else if (edge.getAttribute("relationship") === 'm-m') {
            relation = '@ManyToMany';
        }

        xmlDoc.querySelectorAll("Entity").forEach(e => {
            if (e.getAttribute("id") === edge.getAttribute("target")) {
                e.querySelectorAll("Field").forEach(f => {
                    if (f.pk === true) {
                        relations.push({ code: `` })
                    }
                })
            }
        })
    });
    console.log(relations);

    xmlDoc.querySelectorAll("Entity").forEach(node => {
        entityFields = ``;
        entityGetters = ``;
        entitySetters = ``;

        const entityName = node.getAttribute("name");
        const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
        const basePackage = `com.example.entity`;

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