import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ExportWindow({ onClose, xml }) {
    async function fetchFile(path) {
        const res = await fetch(path);
        return await res.blob();
    }

    const getZipFile = async () => {
        const capAppName = xml.Application[0].fileName.slice(0, -16);
        const minAppName = capAppName.toLowerCase();
        const basePackage = ['com', 'example', minAppName]; // TODO: make dynamic from user maybe

        const zip = JSZip();
        const application = zip.folder(capAppName);

        // installing local maven
        application.file('mvnw', await fetchFile('/templates/mvnw'));
        application.file('mvnw.cmd', await fetchFile('/templates/mvnw.cmd'));
        const mvn = application.folder('.mvn');
        const wrapper = mvn.folder('wrapper');
        wrapper.file('maven-wrapper.properties', await fetchFile('/templates/maven-wrapper.properties'));

        const src = application.folder('src');

        // creating main
        const main = src.folder('main');
        const resources = main.folder('resources');
        resources.file('application.properties', `spring.application.name=${minAppName}`);
        const java = main.folder('java');

        let currentFolder = java;
        for (let i = 0; i < basePackage.length; i++) {
            const packageName = basePackage[i];
            currentFolder = currentFolder.folder(packageName);

            if (i === basePackage.length - 1) {
                currentFolder.file(xml.Application[0].fileName, xml.Application[0].code);
            }
        }

        // entities
        const entities = currentFolder.folder('entity');
        xml.Entities.forEach(entity => {
            entities.file(entity.fileName, entity.code);
        });

        // Controllers
        const controllers = currentFolder.folder('controller');
        xml.Entities.forEach(controller => {
            controllers.file(controller.fileName, controller.code);
        });

        // Repositories
        const repositories = currentFolder.folder('repository');
        xml.Entities.forEach(repository => {
            repositories.file(repository.fileName, repository.code);
        });

        // Services
        const services = currentFolder.folder('service');
        xml.Entities.forEach(service => {
            services.file(service.fileName, service.code);
        });

        // creating test
        const test = src.folder('test');
        const testJava = test.folder('java');

        let currentTestFolder = testJava;
        for (let i = 0; i < basePackage.length; i++) {
            const packageName = basePackage[i];
            currentTestFolder = currentTestFolder.folder(packageName);

            if (i === basePackage.length - 1) {
                currentTestFolder.file(xml.Test[0].fileName, xml.Test[0].code);
            }
        }

        // creating pom.xml
        application.file('pom.xml', 'dependency');

        // download the generated zip file
        saveAs(await zip.generateAsync({ type: 'blob' }), minAppName + '.zip');
        onClose();
    }

    const getJarFile = () => {
        alert('Jar file');
        onClose();
    }

    return (
        <div>
            <div className="export-window">
                <div className="export-project-config">
                    <span>Project Settings: <br></br>java 17</span>
                </div>
                <div className="export-project-download">
                    <div className="downloadable" onClick={getZipFile}>
                        <img className="file-img" src="/src/assets/img/zip.svg"></img><span>Download code as a zip file.</span>
                    </div>
                    <div className="downloadable" onClick={getJarFile}>
                        <img className="file-img" src="/src/assets/img/jar.svg"></img><span>Download code as a jar file.</span>
                    </div>
                </div>
            </div>
            <div className="overlay" />
        </div>
    );
}