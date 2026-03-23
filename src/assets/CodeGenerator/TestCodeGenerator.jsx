export default function TestCodeGenerator(xml, basePackage = `com.example`) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const baseArtifact = xmlDoc.querySelector("Application").getAttribute("name");
    const smallBaseArtifact = baseArtifact.toLowerCase();
    const code = `package ${basePackage}.${smallBaseArtifact};
    
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ${baseArtifact}ApplicationTests {

  @Test
  void contextLoads() {
  }

}`;

    return [{ fileName: `${baseArtifact}ApplicationTests.java`, code: code }];
}