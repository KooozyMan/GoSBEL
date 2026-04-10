import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ExportWindow({ onClose, generatedCode, onConfirmation }) {
    async function fetchFile(path) {
        const res = await fetch(path);
        return await res.blob();
    }

    const getZipFile = async () => {
        const capAppName = generatedCode.Application[0].fileName.slice(0, -16);
        const smlAppName = capAppName.toLowerCase();
        const basePackage = ['com', 'example', smlAppName]; // TODO: make dynamic from user maybe

        const zip = JSZip();
        const application = zip.folder(capAppName);

        // -----------------------------------------------------
        // --------------- Copying static files ---------------
        // -----------------------------------------------------
        // installing local maven
        application.file('mvnw', await fetchFile('/templates/mvnw'));
        application.file('mvnw.cmd', await fetchFile('/templates/mvnw.cmd'));
        const mvn = application.folder('.mvn');
        const wrapper = mvn.folder('wrapper');
        wrapper.file('maven-wrapper.properties', await fetchFile('/templates/maven-wrapper.properties'));

        // installing git files
        application.file('.gitignore', await fetchFile('/templates/.gitignore'));
        application.file('.gitattributes', await fetchFile('/templates/.gitattributes'));

        // ------------------------------------------------------
        // --------------- Creating File Strcture ---------------
        // ------------------------------------------------------
        const src = application.folder('src');

        // Main Structure
        const main = src.folder('main');
        const java = main.folder('java');

        let currentFolder = java;
        for (let i = 0; i < basePackage.length; i++) {
            const packageName = basePackage[i];
            currentFolder = currentFolder.folder(packageName);

            if (i === basePackage.length - 1) {
                currentFolder.file(generatedCode.Application[0].fileName, generatedCode.Application[0].code);
            }
        }

        // entities
        const entities = currentFolder.folder('entity');
        generatedCode.Entities.forEach(entity => {
            entities.file(entity.fileName, entity.code);
        });

        // Controllers
        const controllers = currentFolder.folder('controller');
        generatedCode.Controllers.forEach(controller => {
            controllers.file(controller.fileName, controller.code);
        });

        // Repositories
        const repositories = currentFolder.folder('repository');
        generatedCode.Repositories.forEach(repository => {
            repositories.file(repository.fileName, repository.code);
        });

        // Services
        const services = currentFolder.folder('service');
        generatedCode.Services.forEach(service => {
            services.file(service.fileName, service.code);
        });

        // Creating Resources
        const resources = main.folder('resources');
        resources.file('application.properties', `spring.application.name=${smlAppName}`);

        // Creating View
        const templates = resources.folder('templates');
        generatedCode.Views.forEach(views => {
            templates.file(views.fileName, views.code);
        });

        resources.folder('static');

        // Test Structure
        const test = src.folder('test');
        const testJava = test.folder('java');

        let currentTestFolder = testJava;
        for (let i = 0; i < basePackage.length; i++) {
            const packageName = basePackage[i];
            currentTestFolder = currentTestFolder.folder(packageName);

            if (i === basePackage.length - 1) {
                currentTestFolder.file(generatedCode.Test[0].fileName, generatedCode.Test[0].code);
            }
        }

        // -----------------------------------------------------
        // --------------- Managing dependencies ---------------
        // -----------------------------------------------------
        // creating pom.xml
        // this list is hardcoded but can be dynamic with spring api however needs a backend to be runnable
        application.file(generatedCode.Pom[0].fileName, generatedCode.Pom[0].code);

        // ---------------------------------------------------------
        // --------------- Downloading the Generated ---------------
        // ---------------------------------------------------------
        // download the zip file
        saveAs(await zip.generateAsync({ type: 'blob' }), smlAppName + '.zip');
        onConfirmation('confirmation', 'Zip file was generated successfully');
        onClose();
    }

    const getJarFile = () => {
        // This feature requires either a backend or an application to run
        onConfirmation('error', 'Cannot be implemented in browser');
        onClose();
    }

    return (
        <div>
            <div className="export-window">
                <div className="export-project-config">
                    <span>Project Settings: Maven Java 17 <br></br>Spring Boot 4.0.4 <br></br>Packaging: Jar <br></br>Configuration: Properties</span>
                </div>
                <div className="export-project-download">
                    <div className="downloadable" onClick={getZipFile}>
                        <img className="export-img" src="/src/assets/img/zip.svg"></img><span>Download code as a zip file.</span>
                    </div>
                    <div className="downloadable" onClick={getJarFile}>
                        <img className="export-img" src="/src/assets/img/jar.svg"></img><span>Download code as a jar file.</span>
                    </div>
                    <button className="close-export-project-window" onClick={onClose}>Close</button>
                </div>
            </div>
            <div className="overlay" />
        </div>
    );
}