export default function ApplicationCodeGenerator(baseArtifact = `Demo`, basePackage = `com.example`) {
    const code = `package ${basePackage}.${baseArtifact};
    
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