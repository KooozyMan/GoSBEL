const ListForThymeleaf = (entityName,entityFields,appName,entities) => {
    console.log(entities)
    console.log(`
            ${entities.filter(e => e !== entityName).map(e => (`<a th:href="@{/${e}}" class="border-2 text-center h-fit hover:bg-cyan-600 cursor-pointer
        focus:bg-cyan-500 transition-colors duration-300 rounded border-cyan-900 ">${e}</a>`)).join('\n')}`)
    return `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThymeleafTest2 - ${entityName}s</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body>
    
    <h1 class="bg-cyan-500 p-4 font-bold text-2xl
    text-white font-mono">${entityName}s</h1>

    <div class="flex h-screen w-full bg-cyan-950">
        <div id="entities" class="w-60 bg-cyan-700 text-white *:w-full
        *:block space-y-2 p-4">

<!-- buttons generated from gosbil entities -->

            ${entities.map(e => (`<a  ${e === entityName ? 'disabled' : `th:href="@{/${e}}"`}
        class="w-full border-2 ${e === entityName ? 'bg-cyan-500' : 'focus:bg-cyan-500'} text-center h-fit hover:bg-cyan-600 cursor-pointer
        transition-colors duration-300 rounded border-cyan-900 ">${e}</a>`)).join('\n')}

        </div>

        <!-- right side -->
        <div class="p4 w-full text-white">
            <p id="selectedEntity"
            class="pl-1 bg-cyan-400/20 w-full mb-4">
                ${entityName}s list.
            </p>

        <div class="bg-white rounded-lg overflow-hidden shadow-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-cyan-600 text-white">
                    <!-- fields row -->
                    <tr>
                        ${entityFields.map(e => 
        `<th class="px-6 py-3 text-center font-bold tracking-wider">${e.fieldName}</th>`
                        ).join("\n")}
        <th class="px-6 py-3 text-center font-bold tracking-wider">Actions</th>
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
                    
                        ${entityFields.map(e => 
        `<td class="px-6 py-4 whitespace-nowrap text-center" th:text="\${${entityName}.${e.fieldName}}"></td>`
                        ).join("\n")}
                        
                        <td class="px-6 py-4 whitespace-nowrap space-x-2">
                            <a th:href="@{/${entityName}/edit/{id}(id=\${${entityName}.id})}" 
                               class="text-blue-600 text-center hover:underline hover:text-blue-900">Edit</a>
                            <a th:href="@{/${entityName}/delete/{id}(id=\${${entityName}.id})}" 
                               class="text-red-600 text-center hover:underline hover:text-red-900"
                               onclick="return confirm('Are you sure you want to delete this item?')">Delete</a>
                        </td>
                    </tr>
                </tbody>
            </table>
                <a th:href="@{/${entityName}/add}" class="bg-cyan-600 fixed bottom-4 right-2 cursor-pointer
                hover:bg-cyan-800 transition-colors duration-300 p-2 rounded">Add ${entityName} +</a>
                
        </div>
    </div>
</body>
</html>
`
}

export default ListForThymeleaf;