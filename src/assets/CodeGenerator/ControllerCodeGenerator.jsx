function getController(entityName, type, basePackage, smallBaseArtifact) {
    const entityLower = entityName.toLowerCase();

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
        m.addAttribute("${entityLower}",${entityLower});
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
            redirectAttributes.addFlashAttribute("error","Error saving ${entityLower}" + e.getMessage());
        }
        return "redirect:/${entityLower}";
    }


    // Show form to edit a ${entityLower}
    @GetMapping("/${entityLower}/edit/{id}")
    public String showEditForm(@PathVariable ${type} id, Model model, RedirectAttributes redirectAttributes) {
        Optional<${entityName}> ${entityLower} = ${entityLower}Service.findById(id);
        if (${entityLower}.isPresent()) {
            model.addAttribute("${entityLower}", ${entityLower}.get());
            return "${entityLower}-form";
        } else {
            redirectAttributes.addFlashAttribute("error", "${entityName} not found!");
            return "redirect:/${entityLower}";
        }
    }

    // Update an existing ${entityLower}
    @PostMapping("/${entityLower}/update/{id}")
    public String update${entityName}(@PathVariable ${type} id, @ModelAttribute ${entityName} ${entityLower}, RedirectAttributes redirectAttributes) {
        try {
            ${entityLower}.setId(id);
            ${entityLower}Service.save(${entityLower});
            redirectAttributes.addFlashAttribute("message", "${entityName} updated successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error updating ${entityLower}: " + e.getMessage());
        }
        return "redirect:/${entityLower}";
    }

    // Delete a ${entityLower}
    @GetMapping("/${entityLower}/delete/{id}")
    public String delete${entityName}(@PathVariable ${type} id, RedirectAttributes redirectAttributes) {
        try {
            if (${entityLower}Service.existsById(id)) {
                ${entityLower}Service.deleteById(id);
                redirectAttributes.addFlashAttribute("message", "${entityName} deleted successfully!");
            } else {
                redirectAttributes.addFlashAttribute("error", "${entityName} not found!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting ${entityLower}: " + e.getMessage());
        }
        return "redirect:/${entityLower}";
    }
}`
}

function indexController(basePackage, smallBaseArtifact) {
    return `package ${basePackage}.${smallBaseArtifact}.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class RedirectToIndexHTML {
    // Home page
    @GetMapping("/")
    public String home() {
        return "index";
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
        const type = e.querySelector('Field[pk="true"]').getAttribute('type');
        controllers.push({ 'fileName': `${name}Controller.java`, 'code': getController(name, type, basePackage, smallBaseArtifact) })
    })
    controllers.push({ fileName: 'RedirectToIndexHTML.java', code: indexController(basePackage, smallBaseArtifact) })

    return controllers;
}