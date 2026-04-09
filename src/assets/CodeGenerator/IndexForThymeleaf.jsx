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

    <div class="flex h-screen w-full bg-cyan-950">
        <div id="entities" class="w-60 bg-cyan-700 text-white *:w-full
        *:block space-y-2 p-4">

<!-- buttons generated from gosbil entities -->
        ${Object.keys(entities).map(e => (`<a th:href="@{/${e}}" class="border-2 text-center h-fit hover:bg-cyan-600 cursor-pointer
        focus:bg-cyan-500 transition-colors duration-300 rounded border-cyan-900 ">${e}</a>`)).join('\n')}

        </div>
                
        </div>
    </div>
</body>
</html>
`;
}

export default IndexForThymeleaf;