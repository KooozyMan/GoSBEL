export default function ControllerGenerator({ entityName, basePackage }) {
    return (`package ${basePackage}.controller;

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
}`);
}