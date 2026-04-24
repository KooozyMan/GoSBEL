function capitalizeFirst(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getController(entityName, idType, pkFieldName, basePackage, smallBaseArtifact) {
    const entityLower = entityName.toLowerCase();
    const pkSetterName = `set${capitalizeFirst(pkFieldName)}`;

    return `package ${basePackage}.${smallBaseArtifact}.controller;

import ${basePackage}.${smallBaseArtifact}.entity.${entityName};
import ${basePackage}.${smallBaseArtifact}.service.${entityName}Service;
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
        return "${entityLower}-form";
    }

    // Save a new ${entityLower}
    @PostMapping("/${entityLower}/save")
    public String save${entityName}(@ModelAttribute ${entityName} ${entityLower}, RedirectAttributes redirectAttributes) {
        try {
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
            return "${entityLower}-form";
        } else {
            redirectAttributes.addFlashAttribute("error", "${entityName} not found!");
            return "redirect:/${entityLower}";
        }
    }

    // Update an existing ${entityLower}
    @PostMapping("/${entityLower}/update/{${pkFieldName}}")
    public String update${entityName}(@PathVariable("${pkFieldName}") ${idType} ${pkFieldName}, @ModelAttribute ${entityName} ${entityLower}, RedirectAttributes redirectAttributes) {
        try {
            ${entityLower}.${pkSetterName}(${pkFieldName});
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
    const smallBaseArtifact = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();
    let controllers = [];

    xmlDoc.querySelectorAll("Entity").forEach(e => {
        const name = capitalizeFirst(e.getAttribute('name'));
        const pkField = e.querySelector('Field[pk="true"]');

        const idType = pkField.getAttribute('type');
        const pkFieldName = pkField.getAttribute('name');

        controllers.push({
            fileName: `${name}Controller.java`,
            code: getController(name, idType, pkFieldName, basePackage, smallBaseArtifact)
        });
    });

    controllers.push({
        fileName: 'RedirectToIndexHTML.java',
        code: indexController(basePackage, smallBaseArtifact)
    });

    return controllers;
}