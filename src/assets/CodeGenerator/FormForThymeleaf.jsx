const FormForThymeleaf = (entityName,entityFields) => {
    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title th:text="\${${entityName}.id != null} ? 'ThymeleafTest2 - Edit ${entityName}' + \${${entityName}.id} : 'ThymeleafTest2 - Add New ${entityName}'">ThymeleafTest2 - ${entityName} form</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-cyan-950">
    <h1 class="bg-cyan-500 text-2xl text-white p-4 font-bold font-mono">
        <span th:if="\${${entityName}.id != null}">Edit ${entityName}<span th:text="\${${entityName}.id}"></span></span>
        <span th:unless="\${${entityName}.id != null}">Add New ${entityName}</span>
    </h1>
    
    <!-- Dynamic form action: /${entityName}/save for new, /${entityName}/update/{id} for edit -->
    <form class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl"
          th:object="\${${entityName}}" method="post" 
          th:action="\${${entityName}.id != null} ? @{/${entityName}/update/{id}(id=\${${entityName}.id})} : @{/${entityName}/save}">
        
        <header class="h-fit bg-cyan-500 pl-2 sticky top-0 rounded-tr-2xl font-mono font-bold rounded-tl-2xl">
            <span th:if="\${${entityName}.id != null}">Edit ${entityName}<span th:text="\${${entityName}.id}"></span></span>
            <span th:unless="\${${entityName}.id != null}">New ${entityName} Form</span>
        </header>
        
        <div class="grid grid-cols-2 gap-1 p-2 my-4">
            ${entityFields.map(e => {
                if (e.fieldName === 'id') return;
                let t = e.fieldType;
                switch (t) {
                    case 'string': t = 'text';break;
                    case 'integer':
                    case 'long':
                    case 'double':
                        t = 'number';
                        break;
                    case 'boolean': t = 'checkbox';break;
                }
return `            <label class="w-full flex" for="${e.fieldName}-input">${e.fieldName}:
                <input type="${t}" id="${e.fieldName}-input" class="border rounded ml-auto mr-0" th:field="*{${e.fieldName}}">
            </label>`
            }).join('\n')}
        </div>
        
        <footer class="h-8 bg-cyan-700 sticky flex bottom-0 rounded-br-2xl pt-1 pr-2 rounded-bl-2xl">
            <div class="flex ml-auto mr-0 space-x-2">
                <a th:href="@{/${entityName}}" class="bg-black text-white hover:bg-blue-950 transition-colors duration-300 cursor-pointer rounded h-fit px-2">Cancel</a>
                <button class="bg-black text-white hover:bg-blue-950 transition-colors duration-300 cursor-pointer rounded h-fit px-2" type="submit">
                    <span th:if="\${${entityName}.id != null}">Update ${entityName}</span>
                    <span th:unless="\${${entityName}.id != null}">Add ${entityName}</span>
                </button>
            </div>
        </footer>
    </form>
</body>
</html>`
}

export default FormForThymeleaf;