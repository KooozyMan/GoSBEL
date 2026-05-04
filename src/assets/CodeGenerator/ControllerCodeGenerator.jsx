import { capitalizeFirst, getSelectableRelations, getPrimaryKey, expandManyToMany } from "./RelationshipUtils";

function uniqueRelations(relations) {
    return relations.filter((relation, index, self) =>
        index === self.findIndex(r => r.fieldName === relation.fieldName)
    );
}

function relationServiceImports(relations, basePackage, smallBaseArtifact) {
    return uniqueRelations(relations)
        .map(relation => `import ${basePackage}.${smallBaseArtifact}.service.${relation.relatedName}Service;`)
        .join("\n");
}

function relationServiceFields(relations) {
    return uniqueRelations(relations)
        .map(relation => `    @Autowired
    private ${relation.relatedName}Service ${relation.fieldName}Service;`)
        .join("\n\n");
}

function relationModelAttributes(relations) {
    return uniqueRelations(relations)
        .map(relation => `        model.addAttribute("${relation.listName}", ${relation.fieldName}Service.findAll());`)
        .join("\n");
}

function relationRequestParams(relations) {
    return uniqueRelations(relations)
        .map(relation => `, @RequestParam(value = "${relation.paramName}", required = false) ${relation.relatedPkType} ${relation.paramName}`)
        .join("");
}

function relationAssignments(entityLower, relations) {
    return uniqueRelations(relations)
        .map(relation => `            if (${relation.paramName} != null && !${relation.paramName}.toString().isBlank()) {
                ${relation.fieldName}Service.findById(${relation.paramName}).ifPresent(${entityLower}::${relation.setterName});
            } else {
                ${entityLower}.${relation.setterName}(null);
            }`)
        .join("\n");
}

function getController(entityName, idType, pkFieldName, relations, basePackage, smallBaseArtifact) {
    const entityLower = entityName.toLowerCase();
    const pkSetterName = `set${capitalizeFirst(pkFieldName)}`;

    const relatedImports = relationServiceImports(relations, basePackage, smallBaseArtifact);
    const relatedFields = relationServiceFields(relations);
    const addRelationModelAttributes = relationModelAttributes(relations);
    const addRelationRequestParams = relationRequestParams(relations);
    const addRelationAssignments = relationAssignments(entityLower, relations);

    return `package ${basePackage}.${smallBaseArtifact}.controller;

import ${basePackage}.${smallBaseArtifact}.entity.${entityName};
import ${basePackage}.${smallBaseArtifact}.service.${entityName}Service;
${relatedImports}
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
public class ${entityName}Controller {

    @Autowired
    private ${entityName}Service ${entityLower}Service;

${relatedFields ? relatedFields + "\n" : ""}
    // Show all ${entityLower}
    @GetMapping("/${entityLower}")
    public String list${entityName}(Model m){
        List<${entityName}> ${entityLower} = ${entityLower}Service.findAll();
        m.addAttribute("${entityLower}", ${entityLower});
        return "${entityLower}-list";
    }

    // Show form to add a new ${entityLower}
    @GetMapping("/${entityLower}/add")
    public String showAddForm(Model model) {
        model.addAttribute("${entityLower}", new ${entityName}());
${addRelationModelAttributes}
        return "${entityLower}-form";
    }

    // Save a new ${entityLower}
    @PostMapping("/${entityLower}/save")
    public String save${entityName}(@ModelAttribute ${entityName} ${entityLower}${addRelationRequestParams}, RedirectAttributes redirectAttributes) {
        try {
${addRelationAssignments}
            ${entityLower}Service.save(${entityLower});
            redirectAttributes.addFlashAttribute("message", "${entityName} saved successfully.");
        } catch (Exception e){
            redirectAttributes.addFlashAttribute("error", "Error saving ${entityLower}: " + e.getMessage());
        }
        return "redirect:/${entityLower}";
    }

    // Show form to edit a ${entityLower}
    @GetMapping("/${entityLower}/edit/{${pkFieldName}}")
    public String showEditForm(@PathVariable("${pkFieldName}") ${idType} ${pkFieldName}, Model model, RedirectAttributes redirectAttributes) {
        Optional<${entityName}> ${entityLower} = ${entityLower}Service.findById(${pkFieldName});
        if (${entityLower}.isPresent()) {
            model.addAttribute("${entityLower}", ${entityLower}.get());
${addRelationModelAttributes}
            return "${entityLower}-form";
        } else {
            redirectAttributes.addFlashAttribute("error", "${entityName} not found!");
            return "redirect:/${entityLower}";
        }
    }

    // Update an existing ${entityLower}
    @PostMapping("/${entityLower}/update/{${pkFieldName}}")
    public String update${entityName}(@PathVariable("${pkFieldName}") ${idType} ${pkFieldName}, @ModelAttribute ${entityName} ${entityLower}${addRelationRequestParams}, RedirectAttributes redirectAttributes) {
        try {
            ${entityLower}.${pkSetterName}(${pkFieldName});
${addRelationAssignments}
            ${entityLower}Service.save(${entityLower});
            redirectAttributes.addFlashAttribute("message", "${entityName} updated successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error updating ${entityLower}: " + e.getMessage());
        }
        return "redirect:/${entityLower}";
    }

    // Delete a ${entityLower}
    @GetMapping("/${entityLower}/delete/{${pkFieldName}}")
    public String delete${entityName}(@PathVariable("${pkFieldName}") ${idType} ${pkFieldName}, RedirectAttributes redirectAttributes) {
        try {
            if (${entityLower}Service.existsById(${pkFieldName})) {
                ${entityLower}Service.deleteById(${pkFieldName});
                redirectAttributes.addFlashAttribute("message", "${entityName} deleted successfully!");
            } else {
                redirectAttributes.addFlashAttribute("error", "${entityName} not found!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting ${entityLower}: " + e.getMessage());
        }
        return "redirect:/${entityLower}";
    }
}`;
}

function indexController(basePackage, smallBaseArtifact) {
    return `package ${basePackage}.${smallBaseArtifact}.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.GetMapping;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class RedirectToIndexHTML {
    // Home page
    @GetMapping("/")
    public String home() {
        return "index";
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/*/update/*").hasRole("ADMIN")
                .requestMatchers("/*/delete/*").hasRole("ADMIN")
                .requestMatchers("/", "/*", "/*/*").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults());

        return http.build();
    }
}`;
}

export default function ControllerCodeGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    expandManyToMany(xmlDoc);
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();
    let controllers = [];

    xmlDoc.querySelectorAll("Entity").forEach(e => {
        const name = capitalizeFirst(e.getAttribute("name"));
        const pkField = getPrimaryKey(e);
        const relations = getSelectableRelations(xmlDoc, e.getAttribute("id"));

        controllers.push({
            fileName: `${name}Controller.java`,
            code: getController(name, pkField.type, pkField.name, relations, basePackage, smallBaseArtifact)
        });
    });

    controllers.push({
        fileName: "RedirectToIndexHTML.java",
        code: indexController(basePackage, smallBaseArtifact)
    });

    return controllers;
}