export default function ApplicationCodeGenerator(xml, basePackage = `com.example`) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  const baseArtifact = xmlDoc.querySelector("Application").getAttribute("name");
  const smallBaseArtifact = baseArtifact.toLowerCase();
  const code = `package ${basePackage}.${smallBaseArtifact};
    
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${baseArtifact}Application {

  public static void main(String[] args) {
    SpringApplication.run(${baseArtifact}Application.class, args);
  }

}`;

  return [{ fileName: `${baseArtifact}Application.java`, code: code }];
}