function getController(entityName, basePackage, smallBaseArtifact) {
    const entityLower = entityName.toLowerCase();

    return `package ${basePackage}.${smallBaseArtifact}.controller;

import ${basePackage}.entity.${entityName};
import ${basePackage}.service.${entityName}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/${entityLower}")
@CrossOrigin(origins = "*")
public class ${entityName}Controller {

    @Autowired
    private ${entityName}Service service;

    // Create
    @PostMapping
    public ResponseEntity<${entityName}> create(@Valid @RequestBody ${entityName} entity) {
        ${entityName} savedEntity = service.save(entity);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    // Create multiple
    @PostMapping("/batch")
    public ResponseEntity<List<${entityName}>> createAll(@Valid @RequestBody List<${entityName}> entities) {
        List<${entityName}> savedEntities = service.saveAll(entities);
        return new ResponseEntity<>(savedEntities, HttpStatus.CREATED);
    }

    // Read all
    @GetMapping
    public ResponseEntity<List<${entityName}>> getAll() {
        List<${entityName}> entities = service.findAll();
        if (entities.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(entities, HttpStatus.OK);
    }

    // Read all with pagination and sorting
    @GetMapping("/paged")
    public ResponseEntity<Page<${entityName}>> getAllPaged(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<${entityName}> page = service.findAllPaged(pageable);
        if (page.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<${entityName}> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(entity -> new ResponseEntity<>(entity, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<${entityName}> update(@PathVariable Long id, @Valid @RequestBody ${entityName} entity) {
        return service.findById(id)
                .map(existingEntity -> {
                    entity.setId(id);
                    ${entityName} updatedEntity = service.save(entity);
                    return new ResponseEntity<>(updatedEntity, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Partial update
    @PatchMapping("/{id}")
    public ResponseEntity<${entityName}> partialUpdate(@PathVariable Long id, @RequestBody ${entityName} entity) {
        return service.findById(id)
                .map(existingEntity -> {
                    // Update only non-null fields
                    if (entity.getField1() != null) existingEntity.setField1(entity.getField1());
                    if (entity.getField2() != null) existingEntity.setField2(entity.getField2());
                    // Add more fields as needed
                    
                    ${entityName} updatedEntity = service.save(existingEntity);
                    return new ResponseEntity<>(updatedEntity, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all
    @DeleteMapping
    public ResponseEntity<HttpStatus> deleteAll() {
        try {
            service.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        long count = service.count();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // Check if exists
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> existsById(@PathVariable Long id) {
        boolean exists = service.existsById(id);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    // Find by field (example - you can customize based on your entity fields)
    @GetMapping("/search")
    public ResponseEntity<List<${entityName}>> findByField(@RequestParam String field, @RequestParam String value) {
        // This is a generic example - implement specific search methods in service
        List<${entityName}> entities = service.findByField(field, value);
        if (entities.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(entities, HttpStatus.OK);
    }

    // Find with custom query example
    @GetMapping("/search/custom")
    public ResponseEntity<List<${entityName}>> customSearch(
            @RequestParam(required = false) String param1,
            @RequestParam(required = false) String param2) {
        List<${entityName}> entities = service.customSearch(param1, param2);
        if (entities.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(entities, HttpStatus.OK);
    }
}`
}

export default function ControllerCodeGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();
    let controllers = [];

    xmlDoc.querySelectorAll("Entity").forEach(e => {
        const name = e.getAttribute('name').charAt(0).toUpperCase() + e.getAttribute('name').slice(1);
        controllers.push({ 'fileName': `${name}Controller.java`, 'code': getController(name, basePackage, smallBaseArtifact) })
    })

    return controllers;
}