function formGenerator(entityName, capAppName, entityFields) {
    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title th:text="\${${entityName}.id != null} ? '${capAppName} - Edit ${entityName}' + \${${entityName}.id} : '${capAppName} - Add New ${entityName}'">${capAppName} - ${entityName} form</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </head>
    <body class="bg-cyan-950">
        <h1 class="bg-cyan-500 text-3xl text-white p-4 font-bold font-mono">
            <span th:if="\${${entityName}.id != null}">Edit ${entityName}<span th:text="\${${entityName}.id}"></span></span>
            <span th:unless="\${${entityName}.id != null}">Add New ${entityName}</span>
        </h1>
        <!-- Dynamic form action: /${entityName}/save for new, /${entityName}/update/{id} for edit -->
        <form
        class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl"
        th:object="\${${entityName}}" method="post" 
        th:action="\${${entityName}.id != null} ? @{/${entityName}/update/{id}(id=\${${entityName}.id})} : @{/${entityName}/save}">
            <!-- Form header -->
            <header class="h-fit bg-cyan-500 pl-2 text-2xl sticky top-0 rounded-tr-2xl font-mono font-bold rounded-tl-2xl">
                <!-- if there's a url mapping id, display Edit in the header -->
                <span th:if="\${${entityName}.id != null}">Edit ${entityName}<span th:text="\${${entityName}.id}"></span></span>
            
                <!-- if there's no url mapping id, display New in the header -->
                <span th:unless="\${${entityName}.id != null}">New ${entityName} Form</span>
            </header>

            <!-- Form inputs -->
            <div class="grid grid-cols-2 gap-1 p-2 my-8">
                <!-- Display input forms depending on entities field names and field types -->${entityFields.map(field => {
        if (field.name === 'id') return;
        let t = field.type;
        switch (t.toLowerCase()) {
            case 'string': t = 'text'; break;
            case 'integer':
            case 'long':
            case 'double':
                t = 'number';
                break;
            case 'boolean': t = 'checkbox'; break;
        }
        return `                <label class="w-full flex group" for="${field.name}-input">${field.name}:
                <input type="${t}" id="${field.name}-input" class="border-2 transition-colors duration-300 group-hover:border-cyan-500 rounded-lg ml-auto mr-0" th:field="*{${field.name}}">
                </label>`
    }).join('\n')}
            </div>
        
            <!-- Form footer -->
            <footer class="h-8 bg-cyan-700 sticky flex bottom-0 rounded-br-2xl pt-1 pr-2 rounded-bl-2xl">
                <div class="flex ml-auto mr-0 space-x-2">
                    <a th:href="@{/${entityName}}" class="bg-black text-white hover:bg-cyan-950 transition-colors duration-300 cursor-pointer rounded h-fit px-2">Cancel</a>
                    <button class="bg-black text-white hover:bg-cyan-950 transition-colors duration-300 cursor-pointer rounded h-fit px-2" type="submit">
                        <span th:if="\${${entityName}.id != null}">Update ${entityName}</span>
                        <span th:unless="\${${entityName}.id != null}">Add ${entityName}</span>
                    </button>
                </div>
            </footer>
        </form>
    </body>
</html>`
}

function listGenerator(entityName, entityFields, capAppName, entitiesList) {
    return `<!DOCTYPE html>
<!-- xmlns -->
<html xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/extras/spring-security">
     <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${capAppName} - ${entityName}s</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </head>
    <body class="h-screen">
        <h1 class="bg-cyan-500 p-4 h-1/12 font-bold text-4xl text-white font-mono flex items-center">
            ${entityName}s
            <div class="ml-auto mr-0">
                <a

                th:href="@{/logout}"
                class="hover:bg-cyan-700 transition-colors duration-300 border-cyan-800 border-2 -translate-y-1.5 rounded-xl p-1">
                    log out
                </a>
            </div>
        </h1>
        <div class="flex w-full h-11/12 bg-cyan-950">
            <!-- left side -->
            <div id="entities" class="w-1/5 bg-cyan-700 text-white *:w-full *:block space-y-2 p-4">

                <!-- Navigation to other entities -->
${entitiesList.map(e => (`\t\t\t\t<a${e === entityName ? '\n\t\t\t\tdisabled' : `\n\t\t\t\tth:href="@{/${e}}"`}
                class="w-full text-lg border-2 ${e === entityName ? 'bg-cyan-500' : 'focus:bg-cyan-500 hover:underline'} text-center h-fit hover:bg-cyan-600 cursor-pointer transition-colors duration-300 rounded border-cyan-900">
                ${e}
                </a>\n`)).join('\n')}
            </div>
            <!-- right side -->
            <div class="p4 w-full text-white px-4">
                <p class="pl-1 text-center w-full text-3xl my-4 font-mono">
                    ${entityName}s list.
                </p>
                <div class="bg-white rounded-lg overflow-hidden shadow-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-cyan-600 text-white">
                            <!-- fields row -->
                            <tr>
${entityFields.map(field =>
        `\t\t\t\t\t\t\t\t<th class="px-6 py-3 text-center font-bold tracking-wider">${field.name}</th>`).join("\n")}
                                <th class="px-6 py-3 text-center font-bold tracking-wider" sec:authorize="hasRole('ADMIN')">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <!-- Check if list is empty -->
                            <tr th:if="\${${entityName}.isEmpty()}">
                                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                                    No ${entityName}s found. Click "Add New ${entityName}" to create one.
                                </td>
                            </tr>
                            <!-- Loop through ${entityName}s -->
                            <tr th:each="${entityName} : \${${entityName}}" class="hover:bg-cyan-50 text-black">
${entityFields.map(field =>
            `\t\t\t\t\t\t\t\t<td class="px-6 hover:font-semibold py-4 whitespace-nowrap text-center" th:text="\${${entityName}.${field.name}}"></td>`).join("\n")}
                                <td class="px-6 text-center py-4 whitespace-nowrap space-x-2" sec:authorize="hasRole('ADMIN')">
                                    <!-- Redirect to edit form -->
                                    <a th:href="@{/${entityName}/edit/{id}(id=\${${entityName}.id})}" class="text-cyan-600 text-center hover:underline hover:text-cyan-900">
                                    Edit
                                    </a>
                                    <a th:href="@{/${entityName}/delete/{id}(id=\${${entityName}.id})}" class="text-red-600 text-center hover:underline hover:text-red-900" onclick="return confirm('Are you sure you want to delete this item?')">
                                    Delete
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Redirect to form -->
                    <a
                    th:href="@{/${entityName}/add}"
                    class="bg-cyan-600 text-3xl fixed bottom-4 right-2 cursor-pointer hover:bg-cyan-800 transition-colors duration-300 p-2 rounded-xl">
                    Add ${entityName} +
                    </a>
                    
                </div>
            </div>
        </div>
    </body>
</html>
`
}

function indexGenerator(capAppName, entitiesList) {
    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${capAppName} - Home</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </head>
    <body>
        <!-- App name generated from gosbel -->
        <h1 class="bg-cyan-500 p-4 font-bold text-2xl text-white font-mono">${capAppName}</h1>

        <div class="flex h-screen w-full bg-cyan-950">
            <div id="entities" class="w-60 bg-cyan-700 text-white *:w-full *:block space-y-2 p-4">
                <!-- Index page navigation -->
                ${entitiesList.map(e => (`<a class="border-2 text-center h-fit hover:bg-cyan-600 cursor-pointer focus:bg-cyan-500 transition-colors duration-300 rounded border-cyan-900" th:href="@{/${e}}" >${e}</a>`)).join('\n\t\t\t\t')}
            </div>
        </div>

    </body>
</html>
`;
}

export default function ThymeleafCodeGenerator(xml) {
    let Views = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const capAppName = xmlDoc.querySelector("Application").getAttribute("name");
    const entitiesList = Array.from(xmlDoc.querySelectorAll("Entity")).map(entity =>
        entity.getAttribute("name").toLowerCase()
    );

    xmlDoc.querySelectorAll("Entity").forEach((entity) => {
        const entityName = entity.getAttribute("name").toLowerCase();
        const entityFields = Array.from(entity.querySelectorAll("Field")).map(field => ({ name: field.getAttribute("name"), type: field.getAttribute("type") }));

        Views.push({ fileName: `${entityName}-form.html`, code: formGenerator(entityName, capAppName, entityFields) });
        Views.push({ fileName: `${entityName}-list.html`, code: listGenerator(entityName, entityFields, capAppName, entitiesList) });
    });
    Views.push({ fileName: 'index.html', code: indexGenerator(capAppName, entitiesList) });

    //  tailwind auto-complete configuration file, I got sick from adding it manually.
    Views.push({ fileName: 'tailwind.config.js', code: `//This is a configuration file that helps you auto-complete tailwind utilities/classes if you have 'Tailwind CSS IntelliSense' extension installed in vs-code\n/** @type {import('tailwindcss').Config} */module.exports = {content: ["./**/*.html","./*.html","!./node_modules/**","!./dist/**"],corePlugins: {preflight: true,},}` });

    return Views;
};