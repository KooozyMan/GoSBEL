function getRepository(entityName, idType = "Long") {
    const basePackage = `com.example.${entityName.toLowerCase()}`;
    return `package ${basePackage}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ${basePackage}.entity.${entityName};

@Repository
public interface ${entityName}Repository extends JpaRepository<${entityName}, ${idType}> {
    // Custom query methods can be added here
}`;
}

export default function RepositoryCodeGenerator(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    let repositories = [];

    xmlDoc.querySelectorAll("Entity").forEach(e => {
        const name = e.getAttribute('name').charAt(0).toUpperCase() + e.getAttribute('name').slice(1);
        
        // Find the PK type from the fields
        let idType = "Long"; // Default
        e.querySelectorAll("Field").forEach(f => {
            if (f.getAttribute("pk") === "true") {
                const rawType = f.getAttribute("type");
                // Map frontend types to Java Wrapper types
                if (rawType === "int") idType = "Integer";
                else if (rawType === "string") idType = "String";
                else idType = rawType.charAt(0).toUpperCase() + rawType.slice(1);
            }
        });

        repositories.push({ 
            'fileName': `${name}Repository.java`, 
            'code': getRepository(name, idType) 
        });
    });
    return repositories;
}