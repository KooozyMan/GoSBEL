# SpringFlow

## Draw your database. Generate your backend. Ship faster.

**SpringFlow** is a visual Spring Boot project generator built with React Flow.  
Design your full database ERD on an interactive canvas — then export a complete, production-ready Spring Boot project as a ZIP file, instantly.

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)]([https://your-github-pages-link](https://kooozyman.github.io/SpringFlow/))
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Generated-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## ✨ What is SpringFlow?

Most backend developers know the pain: you sketch a database schema on paper or in a diagram tool, then spend hours manually writing entities, repositories, services, controllers, and Thymeleaf templates — all repetitive boilerplate before writing a single line of real business logic.

**SpringFlow eliminates that entirely.**

You drag, drop, and connect entity nodes on a canvas. Configure fields, add validation annotations, name your project — and when you're ready, you click one button and download a fully scaffolded Spring Boot project as a ZIP file, ready to import into IntelliJ or Eclipse and run.

---

## 🎬 Feature Walkthrough

### 🖱️ Drag & Drop Canvas

An infinite, pannable canvas powered by React Flow. Create entity nodes, reposition them freely, and build your schema visually.

<!-- Replace with your actual GIF -->
![Drag and Drop Canvas](./gifs/drag-and-drop.gif)
<img width="1008" height="720" alt="chrome-capture-2026-06-01" src="https://github.com/user-attachments/assets/a28a6a31-6ea9-4888-bf0e-2435774b6bd3" />


---

### 🔗 Relationship Edges

Connect entity nodes by dragging from one handle to another. SpringFlow generates the correct JPA annotations (`@OneToMany`, `@ManyToOne`, etc.) based on your connections.

<!-- Replace with your actual GIF -->
![Edge Connections](./gifs/edges.gif)
<img width="1386" height="989" alt="brave_nT3bhDsagF" src="https://github.com/user-attachments/assets/a0f0cef2-170c-477f-828c-66c1744de649" />

---

### ✏️ Modify Entities

You can modify each entity's name, field names, field types.
<!-- Replace with your actual GIF -->
![Validation Panel](./gifs/validations.gif)
<img width="1386" height="989" alt="brave_Y2HSAylTQc" src="https://github.com/user-attachments/assets/651ed3e6-ee32-403c-9916-2a57c27e5844" />

---

### ⚙️ Validation Configurator

Each entity node has a **cog (⚙️) icon** that expands an advanced panel. From there you can add field-level Bean Validation annotations to any field:

- `@Min` / `@Max` — for numeric bounds
- `@Size` — for string length constraints
- `@NotNull` / `@NotBlank` / `@NotEmpty`
- `@Pattern` — for regex-based validation
- `@Email`, `@Positive`, `@Negative`, and more

<!-- Replace with your actual GIF -->
![Validation Panel](./gifs/validations.gif)
<img width="1386" height="989" alt="brave_xK7CB7WlpH" src="https://github.com/user-attachments/assets/004f1089-63bd-4b49-8516-e3275b0bce56" />

---

### 💾 Save & History

Hit **Save** to snapshot your current ERD. SpringFlow keeps a **history of your latest saved projects** so you can quickly revisit and restore previous designs without starting over.

<!-- Replace with your actual GIF -->
![Save and History](./gifs/save-history.gif)
<img width="1386" height="989" alt="brave_Jwx0rD5LDl" src="https://github.com/user-attachments/assets/c1f491a5-e217-4f3c-bb89-86cfac4c7987" />

---

### 📄 XML View — Cross-Machine Portability

SpringFlow can serialize your entire ERD into an **XML document** — a format SpringFlow itself can read back. Copy the XML and paste it on another machine to restore your exact diagram.

Perfect for sharing schemas with teammates or backing up your work externally.

<!-- Replace with your actual GIF -->
![XML View](./gifs/xml-view.gif)
<img width="1386" height="989" alt="brave_QqNI92Yx4v" src="https://github.com/user-attachments/assets/5d8c61ee-015a-4a85-81ef-64cf25843f68" />

---
### 📦 One-Click ZIP Generation

When you're satisfied, click **Generate Project**. SpringFlow bundles everything into a standard Maven project structure and downloads it as a `.zip` file — ready to open directly in any IDE.

<!-- Replace with your actual GIF -->
![ZIP Generation](./gifs/zip-generation.gif)
<img width="1386" height="989" alt="brave_lAfhQ3sqXV" src="https://github.com/user-attachments/assets/bb72ca0c-d36d-41e5-9c93-bfb5ccf8fd9a" />

---

## 🗂️ Generated Project Structure

```
{app-name}/
├── src/
│   ├── main/
│   │   ├── java/com/example/{appname}/
│   │   │   ├── entity/
│   │   │   │   └── {Entity}.java
│   │   │   ├── repository/
│   │   │   │   └── {Entity}Repository.java
│   │   │   ├── service/
│   │   │   │   └── {Entity}Service.java
│   │   │   ├── controller/
│   │   │   │   └── {Entity}Controller.java
│   │   │   └── form/
│   │   │       └── {Entity}Form.java
│   │   └── resources/
│   │       ├── templates/
│   │       │   ├── {entity}/
│   │       │   │   ├── form.html
│   │       │   │   └── list.html
│   │       └── application.properties
│   └── test/
└── pom.xml
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- npm or yarn

### Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/springflow.git
cd springflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 19 |
| **Canvas / Diagramming** | React Flow |
| **Styling** | CSS |
| **ZIP Generation** | JSZip |
| **XML Serialization** | Custom parser |
| **Hosting** | GitHub Pages |

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, additional Spring Boot patterns, or UI improvements:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please open an issue first for major changes so we can discuss the approach.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">

Made with ☕ and Spring  
**[Try it live →](https://your-github-pages-link)**

</div>
