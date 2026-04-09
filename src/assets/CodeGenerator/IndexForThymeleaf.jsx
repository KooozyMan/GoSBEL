const IndexForThymeleaf = () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(localStorage.getItem('quick-saved-diagram'), "text/xml");
    const appName = xmlDoc.querySelector("Application").getAttribute('name')
    const entities = Object.fromEntries(
        Array.from(xmlDoc.querySelectorAll("Entity")).map(entity => [
            entity.getAttribute('name'),
            Array.from(entity.querySelectorAll("Field")).map(field => ({
                fieldName: field.getAttribute('name'),
                fieldType: field.getAttribute('type').toLowerCase()
            }))
        ])
    );

    const ConsumerFields = entities.Consumer;
    console.log(ConsumerFields);
    console.log(entities);
    // [{fieldName:'id',fieldType:'integer'},{fieldName:'name',fieldType:'string'}]
    return `
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName} - Home</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body>
    
    <h1 class="bg-cyan-500 p-4 font-bold text-2xl
    text-white font-mono">${appName}</h1>

    <div id="overlay" hidden class="fixed bg-transparent backdrop-blur top-0 h-screen w-screen">
        <div class="fixed top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2 bg-white h-96 w-150">
        <div class="relative h-full w-full">
            <h1 id="formText" class="bg-blue-300 text-3xl h-10 font-bold pl-2">add/update form</h1>
            <div id="overlayInputs" class="grid grid-cols-2 gap-4 p-4">
                <div><label for="">test:</label><input class="border-2 rounded" type="text"></div>
                <div><label for="">test:</label><input class="border-2 rounded" type="text"></div>
                <div><label for="">test:</label><input class="border-2 rounded" type="text"></div>
                <div><label for="">test:</label><input class="border-2 rounded" type="text"></div>
            </div>
            <!-- fileds here for form add/update -->
            <footer class="absolute bottom-0 h-10 w-full bg-blue-500">
<button class="bg-black rounded cursor-pointer text-white p-1 absolute top-1 right-1"
    onclick="overlay.hidden = true">close</button>
            </footer>
        </div>
    </div>
    </div>

    <div class="flex h-screen w-full bg-cyan-950">
        <div id="entities" class="w-60 bg-cyan-700 text-white *:w-full
        *:block space-y-2 p-4">

<!-- buttons generated from gosbil entities -->
        ${Object.keys(entities).map(e => (`<button class="border-2 h-fit hover:bg-cyan-600 cursor-pointer
        focus:bg-cyan-500 transition-colors duration-300 rounded border-cyan-900 ">${e}</button>`)).join(' ')}

        </div>

        <!-- right side -->
        <div class="p4 w-full text-white">
            <p id="selectedEntity"
            class="pl-1 bg-cyan-400/20 w-full mb-4">
                Please select an entity.
            </p>

                <table id="tableForEntity" class="w-full text-sm text-left rtl:text-right text-body">
                    <thead class="text-sm text-body bg-neutral-secondary-soft border-b
                    rounded-base border-default">
                        <tr id="fieldsRow">
                            <!-- fields from entities -->
                            <th id="actionsHead" hidden scope="col" class="px-6 py-3
                            border font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="fieldsItems">
    <!-- <td id="actionsCell" class="px-6 py-4 border font-medium text-heading whitespace-nowrap">
        <a class="cursor-pointer hover:text-cyan-400 underline">Edit</a>
                                <form style="display:inline;">
                                    <input type="hidden" name="_method" value="delete" />
                                    <input type="hidden"/>
                        <button type="submit" class="underline cursor-pointer hover:text-red-500"
                                        onclick="return confirm('Are you sure?')">Delete</button>
                                </form>
                             </td> -->
                        </tr>
                    </tbody>
                </table>
                <button id="addEntity" onclick="displayOverlay()" class="bg-cyan-600 fixed bottom-4 right-2 cursor-pointer
                hover:bg-cyan-800 transition-colors duration-300 p-2 rounded">Add +</button>
                
        </div>
    </div>

    
    <script>

// Convert entities fields into arrays
${Object.keys(entities).map(e => {
    return `const ${e}Fields = ${JSON.stringify(entities[e])}`
}).join('\n')}
const fields = {
    ${Object.keys(entities).map(e => `${e}:${e}Fields`).join(',\n    ')}
}

let $selectedEntity = document.getElementById('selectedEntity')
let $tableForEntity = document.getElementById('tableForEntity')
let $fieldsRow = document.getElementById('fieldsRow')
let $actionsHead = document.getElementById('actionsHead')
let $fieldsItems = document.getElementById('fieldsItems')
let $overlayInputs = document.getElementById('overlayInputs')

let selectedEntityName = ''

const displayOverlay = () => {
    if (selectedEntityName == ''){
        alert('Please select an entity.')
        return
    }
    const inputs = fields[selectedEntityName].map(e => {
        if (e.fieldName === 'id'){
            return
        }
        let inputType = ''
        switch (e['fieldType']){
            case 'string':
                inputType = 'text'
                break;
            case 'integer':
            case 'long':
            case 'double':
                inputType = 'number'
                break;
            case 'boolean':
                inputType = 'checkbox'
                break;
            default:
                inputType = 'text'
        }
        return \`<div><label for="\${selectedEntityName}-\${e['fieldName']}">\${e['fieldName']}:</label><input id="\${selectedEntityName}-\${e['fieldName']}" class="border-2 rounded"type="\${inputType}"></div>\`
    })
    console.log(inputs)
    formText.innerText = \`Add \${selectedEntityName}\`
    $overlayInputs.innerHTML = inputs.join("")
    overlay.hidden = false
}

const changeEntity = (entity) => {
    let temp = fields[entity].map(e => e.fieldName)
    actionsHead.hidden = false

    temp = temp.map(e => \`<th scope="col" class="px-6 py-3
    border font-medium">\${e}</th>\`)
    temp.push($actionsHead.outerHTML)
    console.log(temp)
    $fieldsRow.innerHTML = temp.join("")
   }

document.querySelectorAll('#entities > button').forEach(e=>{
    e.addEventListener('click', () => {
        selectedEntityName = e.textContent
        $selectedEntity.textContent = selectedEntityName
        changeEntity(selectedEntityName)
    })
})
    </script>
</body>
</html>
`;
}

export default IndexForThymeleaf;