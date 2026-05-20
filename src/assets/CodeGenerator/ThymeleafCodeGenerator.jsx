import { getSelectableRelations, getPrimaryKey, expandManyToMany } from "./RelationshipUtils";

function toInputType(fieldType) {
    switch (fieldType.toLowerCase()) {
        case "string":
            return "text";
        case "integer":
        case "long":
        case "double":
            return "number";
        case "boolean":
            return "checkbox";
        default:
            return "text";
    }
}

function relationInputs(entityName, relations) {
    return relations
        .map(relation => {
            const optionVar = `${relation.fieldName}Option`;

            return `                        <div class="form-control w-full">
                            <label class="label" for="${relation.paramName}-select">
                                <span class="label-text font-medium">${relation.relatedName}</span>
                            </label>
                            <select id="${relation.paramName}-select" name="${relation.paramName}" class="select select-bordered w-full">
                                <option value="">-- Select ${relation.relatedName} --</option>
                                <option th:each="${optionVar} : \${${relation.listName}}"
                                        th:value="\${${optionVar}.${relation.relatedPkName}}"
                                        th:text="\${${optionVar}.${relation.displayField}}"
                                        th:selected="\${${entityName}.${relation.fieldName} != null and ${entityName}.${relation.fieldName}.${relation.relatedPkName} == ${optionVar}.${relation.relatedPkName}}">
                                </option>
                            </select>
                        </div>`;
        })
        .join("\n");
}

function relationTableHeaders(relations) {
    return relations
        .map(
            relation =>
                `                                    <th class="text-sm font-bold">${relation.relatedName}</th>`
        )
        .join("\n");
}

function relationTableCells(entityName, relations) {
    return relations
        .map(
            relation =>
                `                                    <td th:text="\${${entityName}.${relation.fieldName} != null ? ${entityName}.${relation.fieldName}.${relation.displayField} : ''}"></td>`
        )
        .join("\n");
}

function formGenerator(entityName, capAppName, entityFields, pkField, relations) {
    const pkName = pkField.name;

    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title th:text="\${${entityName}.${pkName} != null ? '${capAppName} - Edit ${entityName} ' + ${entityName}.${pkName} : '${capAppName} - Add New ${entityName}'}">${capAppName} - ${entityName} form</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
    </head>
    <body class="bg-base-200 min-h-screen flex items-center justify-center p-4">
        <div class="card bg-base-100 shadow-xl w-full max-w-2xl">
            <div class="card-body">
                <h2 class="card-title text-2xl font-bold bg-primary text-primary-content p-4 rounded-xl mb-6 shadow-sm">
                    <span th:if="\${${entityName}.${pkName} != null}">
                        Edit ${entityName} #<span th:text="\${${entityName}.${pkName}}"></span>
                    </span>
                    <span th:unless="\${${entityName}.${pkName} != null}">
                        Add New ${entityName}
                    </span>
                </h2>

                <form th:object="\${${entityName}}" method="post" th:action="@{\${${entityName}.${pkName} != null ? '/${entityName}/update/' + ${entityName}.${pkName} : '/${entityName}/save'}}">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
${entityFields
            .map(field => {
                if (field.name === pkName) return "";

                const inputType = toInputType(field.type);

                if (inputType === "checkbox") {
                    return `                        <div class="form-control w-full flex-row items-center justify-end gap-4 p-2">
                            <label class="cursor-pointer flex items-center gap-3" for="${field.name}-input">
                                <input type="${inputType}" id="${field.name}-input" class="checkbox checkbox-primary" th:field="*{${field.name}}">
                                <span class="label-text font-medium">${field.name}</span>
                                <span th:if="\${#fields.hasErrors('${field.name}')}" th:errors="*{${field.name}}" class="mt-2 py-1 px-2 text-xs font-semibold bg-red-600 text-white rounded shadow-sm"></span>
                            </label>
                        </div>`;
                }

                return `                        <div class="form-control w-full">
                            <label class="label" for="${field.name}-input">
                                <span class="label-text font-medium">${field.name}</span>
                            </label>
                            <input type="${inputType}" id="${field.name}-input" class="input input-bordered w-full" th:field="*{${field.name}}" placeholder="Enter ${field.name}">
                            <span th:if="\${#fields.hasErrors('${field.name}')}" th:errors="*{${field.name}}" class="mt-2 py-1 px-2 text-xs font-semibold bg-red-600 text-white rounded shadow-sm"></span>
                        </div>`;
            })
            .join("\n")}
${relationInputs(entityName, relations)}
                    </div>
                    
                    <div class="card-actions justify-end mt-8 border-t pt-6 border-base-200">
                        <a th:href="@{/${entityName}}" class="btn btn-ghost">Cancel</a>
                        <button class="btn btn-primary" type="submit">
                            <span th:if="\${${entityName}.${pkName} != null}">Update ${entityName}</span>
                            <span th:unless="\${${entityName}.${pkName} != null}">Save ${entityName}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </body>
</html>`;
}

function listGenerator(entityName, entityFields, pkField, relations, capAppName, entitiesList) {
    const pkName = pkField.name;

    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/extras/spring-security">
     <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${capAppName} - ${entityName}s</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
    </head>
    <body class="bg-base-200 h-screen flex overflow-hidden">
        
        <div class="w-64 bg-base-100 shadow-xl hidden md:flex flex-col z-10">
            <div class="p-6 text-center border-b border-base-200">
                <h1 class="text-2xl font-bold w-full text-primary truncate" title="${capAppName}">${capAppName}</h1>
            </div>
            <ul class="menu p-4 w-full text-base-content flex-grow gap-1">
${entitiesList
            .map(
                e =>
                    `                <li><a${e === entityName ? ' class="active"' : ` th:href="@{/${e}}"`}>${e}</a></li>`
            )
            .join("\n")}
            </ul>
        </div>

        <div class="flex-1 flex flex-col h-full overflow-hidden">
            <div class="navbar bg-base-100 shadow-md z-0 px-6">
                <div class="flex-1">
                    <h1 class="text-xl font-semibold">${entityName} Management</h1>
                </div>
                <div class="flex-none">
                    <a th:href="@{/logout}" class="btn btn-ghost btn-sm">Log out</a>
                </div>
            </div>

            <div class="flex-1 overflow-auto p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-base-content">${entityName} List</h2>
                    <a th:href="@{/${entityName}/add}" class="btn btn-primary shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add ${entityName}
                    </a>
                </div>

                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body p-0 overflow-x-auto">
                        <table class="table table-zebra w-full">
                            <thead class="bg-base-200 text-center">
                                <tr>
${entityFields
            .map(field => `                                    <th class="text-sm font-bold">${field.name}</th>`)
            .join("\n")}
${relationTableHeaders(relations)}
                                    <th sec:authorize="hasRole('ADMIN')" class="text-center text-sm font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="text-center">
                                <tr th:if="\${${entityName}.isEmpty()}">
                                    <td colspan="100%" class="text-center py-12 text-base-content/50">
                                        No ${entityName}s found. Click "Add ${entityName}" to create one.
                                    </td>
                                </tr>
                                <tr th:each="${entityName} : \${${entityName}}" class="hover">
${entityFields
            .map(field => `                                    <td th:text="\${${entityName}.${field.name}}"></td>`)
            .join("\n")}
${relationTableCells(entityName, relations)}
                                    <td sec:authorize="hasRole('ADMIN')" class="text-center space-x-2">
                                        <a th:href="@{/${entityName}/edit/{${pkName}}(${pkName}=\${${entityName}.${pkName}})}" class="btn btn-sm btn-info btn-outline">Edit</a>
                                        <a th:href="@{/${entityName}/delete/{${pkName}}(${pkName}=\${${entityName}.${pkName}})}" class="btn btn-sm btn-error btn-outline" onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
}

function indexGenerator(capAppName, entitiesList) {
    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${capAppName} - Home</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
    </head>
    <body class="bg-base-200">
        <div class="flex h-screen overflow-hidden">
            <div class="w-64 bg-base-100 shadow-xl hidden md:flex flex-col z-10">
                <div class="p-6 border-b border-base-200">
                    <h1 class="text-2xl font-bold text-primary truncate" title="${capAppName}">${capAppName}</h1>
                </div>
                <ul class="menu p-4 w-full text-base-content flex-grow gap-1">
                    ${entitiesList
            .map(e => `<li><a th:href="@{/${e}}">${e}</a></li>`)
            .join("\n                    ")}
                </ul>
            </div>
            
            <div class="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                <div class="card bg-base-100 shadow-xl max-w-lg w-full">
                    <div class="card-body items-center text-center">
                        <h2 class="card-title text-4xl font-bold mb-4">Welcome to ${capAppName}</h2>
                        <p class="text-base-content/70">Select an entity from the sidebar to manage your data.</p>
                        
                        <div class="md:hidden mt-8 w-full">
                            <h3 class="font-semibold mb-4 text-left">Available Entities:</h3>
                            <div class="flex flex-col gap-3">
                                ${entitiesList
            .map(
                e =>
                    `<a th:href="@{/${e}}" class="btn btn-outline btn-primary w-full">${e}</a>`
            )
            .join("\n                                ")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
}

export default function ThymeleafCodeGenerator(xml) {
    let Views = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    expandManyToMany(xmlDoc);
    const capAppName = xmlDoc.querySelector("Application").getAttribute("name");

    const entitiesList = Array.from(xmlDoc.querySelectorAll("Entity")).map(entity =>
        entity.getAttribute("name").toLowerCase()
    );

    xmlDoc.querySelectorAll("Entity").forEach(entity => {
        const entityName = entity.getAttribute("name").toLowerCase();

        const entityFields = Array.from(entity.querySelectorAll("Field")).map(field => ({
            name: field.getAttribute("name"),
            type: field.getAttribute("type"),
            pk: field.getAttribute("pk") === "true",
        }));

        const pkField = getPrimaryKey(entity);
        const relations = getSelectableRelations(xmlDoc, entity.getAttribute("id"));

        Views.push({
            fileName: `${entityName}-form.html`,
            code: formGenerator(entityName, capAppName, entityFields, pkField, relations),
        });

        Views.push({
            fileName: `${entityName}-list.html`,
            code: listGenerator(entityName, entityFields, pkField, relations, capAppName, entitiesList),
        });
    });

    Views.push({
        fileName: "index.html",
        code: indexGenerator(capAppName, entitiesList),
    });

    Views.push({
        fileName: "tailwind.config.js",
        code: `//This is a configuration file that helps you auto-complete tailwind utilities/classes if you have 'Tailwind CSS IntelliSense' extension installed in vs-code
/** @type {import('tailwindcss').Config} */
module.exports = {
content: ["./**/*.html","./*.html","!./node_modules/**","!./dist/**"],
corePlugins: {preflight: true,},
}`,
    });

    return Views;
}