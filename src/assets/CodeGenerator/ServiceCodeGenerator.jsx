function normalizeJavaType(rawType = "Long") {
    const type = rawType.trim();
    const lower = type.toLowerCase();

    if (lower === "int" || lower === "integer") return "Integer";
    if (lower === "long") return "Long";
    if (lower === "double") return "Double";
    if (lower === "float") return "Float";
    if (lower === "boolean" || lower === "bool") return "Boolean";
    if (lower === "string") return "String";

    return type.charAt(0).toUpperCase() + type.slice(1);
}

function getService(entityName, idType = "Long", basePackage, smallBaseArtifact) {
    return `package ${basePackage}.${smallBaseArtifact}.service;

import ${basePackage}.${smallBaseArtifact}.entity.${entityName};
import ${basePackage}.${smallBaseArtifact}.repository.${entityName}Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

@Service
public class ${entityName}Service {

    private final ${entityName}Repository repository;

    public ${entityName}Service(${entityName}Repository repository) {
        this.repository = repository;
    }

    // Create / Update single
    public ${entityName} save(${entityName} entity) {
        return repository.save(entity);
    }

    // Create / Update multiple
    public List<${entityName}> saveAll(List<${entityName}> entities) {
        return repository.saveAll(entities);
    }

    // Read all
    public List<${entityName}> findAll() {
        return repository.findAll();
    }

    // Read all with pagination
    public Page<${entityName}> findAllPaged(Pageable pageable) {
        return repository.findAll(pageable);
    }

    // Read by id
    public Optional<${entityName}> findById(${idType} id) {
        return repository.findById(id);
    }

    // Delete by id
    public void deleteById(${idType} id) {
        repository.deleteById(id);
    }

    // Delete all
    public void deleteAll() {
        repository.deleteAll();
    }

    // Count
    public long count() {
        return repository.count();
    }

    // Exists
    public boolean existsById(${idType} id) {
        return repository.existsById(id);
    }

    // Generic field search (temporary generic solution)
    public List<${entityName}> findByField(String field, String value) {
        return repository.findAll()
                .stream()
                .filter(entity -> matchesField(entity, field, value))
                .toList();
    }

    // Generic custom search (temporary generic solution)
    public List<${entityName}> customSearch(String param1, String param2) {
        if ((param1 == null || param1.isBlank()) && (param2 == null || param2.isBlank())) {
            return repository.findAll();
        }

        return repository.findAll()
                .stream()
                .filter(entity -> containsInAnyField(entity, param1))
                .filter(entity -> containsInAnyField(entity, param2))
                .toList();
    }

    private boolean matchesField(${entityName} entity, String fieldName, String value) {
        if (fieldName == null || fieldName.isBlank() || value == null) {
            return false;
        }

        try {
            Field field = ${entityName}.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            Object fieldValue = field.get(entity);

            return fieldValue != null && fieldValue.toString().equalsIgnoreCase(value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return false;
        }
    }

    private boolean containsInAnyField(${entityName} entity, String value) {
        if (value == null || value.isBlank()) {
            return true;
        }

        Field[] fields = ${entityName}.class.getDeclaredFields();

        for (Field field : fields) {
            try {
                field.setAccessible(true);
                Object fieldValue = field.get(entity);

                if (fieldValue != null && fieldValue.toString().toLowerCase().contains(value.toLowerCase())) {
                    return true;
                }
            } catch (IllegalAccessException e) {
                // ignore this field and continue
            }
        }

        return false;
    }
}`;
}

export default function ServiceCodeGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();
    let services = [];

    xmlDoc.querySelectorAll("Entity").forEach((e) => {
        const name = e.getAttribute("name");
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        let idType = "Long";

        e.querySelectorAll("Field").forEach((f) => {
            if (f.getAttribute("pk") === "true") {
                idType = normalizeJavaType(f.getAttribute("type"));
            }
        });

        services.push({
            fileName: `${capitalizedName}Service.java`,
            code: getService(capitalizedName, idType, basePackage, smallBaseArtifact),
        });
    });

    return services;
}