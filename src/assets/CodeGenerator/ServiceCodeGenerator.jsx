function getService(entityName, idType = "Long", basePackage, smallBaseArtifact) {
    return `package ${basePackage}.${smallBaseArtifact}.service;

import org.springframework.stereotype.Service;
import java.util.List;

import ${basePackage}.${smallBaseArtifact}.repository.${entityName}Repository;
import ${basePackage}.${smallBaseArtifact}.entity.${entityName};

@Service
public class ${entityName}Service {

    private final ${entityName}Repository repository;

    public ${entityName}Service(${entityName}Repository repository) {
        this.repository = repository;
    }

    public List<${entityName}> findAll() {
        return repository.findAll();
    }

    public ${entityName} findById(${idType} id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("${entityName} not found"));
    }

    public ${entityName} save(${entityName} entity) {
        return repository.save(entity);
    }

    public void delete(${idType} id) {
        repository.deleteById(id);
    }
}`;
}


export default function ServiceCodeGenerator(xml, basePackage = `com.example`) {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();
    let services = [];

    xmlDoc.querySelectorAll("Entity").forEach(e => {

        const name = e.getAttribute('name');
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        // detect PK type (like repository generator does)
        let idType = "Long";

        e.querySelectorAll("Field").forEach(f => {
            if (f.getAttribute("pk") === "true") {
                const rawType = f.getAttribute("type");

                if (rawType === "int") idType = "Integer";
                else if (rawType === "string") idType = "String";
                else idType = rawType.charAt(0).toUpperCase() + rawType.slice(1);
            }
        });

        services.push({
            fileName: `${capitalizedName}Service.java`,
            code: getService(capitalizedName, idType, basePackage, smallBaseArtifact)
        });

    });

    return services;
}