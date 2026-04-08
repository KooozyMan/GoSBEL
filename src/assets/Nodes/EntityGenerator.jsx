export default function generateEntity(id) {
    return {
        id: id || crypto.randomUUID(),
        type: "entity",
        position: { x: 200, y: 200 },
        data: {
            label: "defaultNode",
            fields: [
                { name: "id", type: "Integer", pk: true }
            ]
        }
    };
}
