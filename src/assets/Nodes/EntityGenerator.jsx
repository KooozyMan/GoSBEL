export default function generateEntity() {
    return {
        id: crypto.randomUUID(),
        type: "entity",
        position: { x: 200, y: 200 },
        data: {
            label: "default",
            fields: [
                { name: "id", type: "int" }
            ]
        }
    };
}
