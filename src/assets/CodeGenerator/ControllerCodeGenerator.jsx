function getController(entityName) {
    const basePackage = `com.example.${entityName}`
    return `package ${basePackage}.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import ${basePackage}.service.${entityName}Service;
import ${basePackage}.entity.${entityName};

@RestController
@RequestMapping("/${entityName.toLowerCase()}")
public class ${entityName}Controller {
    private final ${entityName}Service service;

    public ${entityName}Controller(${entityName}Service service) {
        this.service = service;
    }

    @GetMapping
    public List<${entityName}> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ${entityName} create(@RequestBody ${entityName} entity) {
        return service.save(entity);
    }
}`
}

export default function ControllerCodeGenerator(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    let controllers = [];
    xmlDoc.querySelectorAll("Entity").forEach(e => {
        const name = e.getAttribute('name');
        controllers.push({ 'fileName': `${name}.java`, 'code': getController(name) })
    })
    return controllers;
}