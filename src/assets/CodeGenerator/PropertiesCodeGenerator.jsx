export default function PropertiesCodeGenerator(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const smlAppName = xmlDoc.querySelector("Application").getAttribute("name").toLowerCase();
    const code = `spring.application.name=${smlAppName}
spring.security.user.name=admin
spring.security.user.password=admin
spring.security.user.roles=ADMIN
`;

    return [{ fileName: 'application.properties', code: code }];
}