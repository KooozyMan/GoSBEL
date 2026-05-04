export function capitalizeFirst(value = "") {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getPrimaryKey(entityElement) {
    const pkField = entityElement.querySelector('Field[pk="true"]') || entityElement.querySelector("Field");

    return {
        name: pkField.getAttribute("name"),
        type: pkField.getAttribute("type"),
    };
}

export function getDisplayField(entityElement) {
    const fields = Array.from(entityElement.querySelectorAll("Field"));
    const pk = getPrimaryKey(entityElement);

    const stringField = fields.find(field =>
        field.getAttribute("pk") !== "true" &&
        field.getAttribute("type") === "String"
    );

    return stringField ? stringField.getAttribute("name") : pk.name;
}

export function getEntityById(xmlDoc, id) {
    return xmlDoc.querySelector(`Entity[id="${id}"]`);
}

function buildRelation(xmlDoc, ownerId, relatedId, annotation) {
    const ownerEntity = getEntityById(xmlDoc, ownerId);
    const relatedEntity = getEntityById(xmlDoc, relatedId);

    if (!ownerEntity || !relatedEntity) {
        return null;
    }

    const ownerName = capitalizeFirst(ownerEntity.getAttribute("name"));
    const relatedName = capitalizeFirst(relatedEntity.getAttribute("name"));

    const ownerLower = ownerName.toLowerCase();
    const relatedLower = relatedName.toLowerCase();

    const relatedPk = getPrimaryKey(relatedEntity);
    const displayField = getDisplayField(relatedEntity);

    const fieldName = relatedLower;
    const setterName = `set${capitalizeFirst(fieldName)}`;
    const getterName = `get${capitalizeFirst(fieldName)}`;
    const paramName = `${fieldName}${capitalizeFirst(relatedPk.name)}`;
    const listName = `${fieldName}s`;

    return {
        ownerId,
        relatedId,

        ownerName,
        ownerLower,

        relatedName,
        relatedLower,

        fieldName,
        setterName,
        getterName,

        paramName,
        listName,

        relatedPkName: relatedPk.name,
        relatedPkType: relatedPk.type,
        displayField,

        annotation,
        joinColumnName: `${fieldName}_${relatedPk.name}`,
    };
}

export function getManyToOneRelations(xmlDoc, ownerEntityId = null) {
    const relations = [];

    xmlDoc.querySelectorAll("Edge").forEach(edge => {
        const sourceId = edge.getAttribute("source");
        const targetId = edge.getAttribute("target");
        const relationship = edge.getAttribute("relationship");

        let ownerId = null;
        let relatedId = null;

        if (relationship === "1-m") {
            ownerId = targetId;
            relatedId = sourceId;
        } else if (relationship === "m-1") {
            ownerId = sourceId;
            relatedId = targetId;
        } else {
            return;
        }

        if (ownerEntityId && ownerId !== ownerEntityId) {
            return;
        }

        const relation = buildRelation(xmlDoc, ownerId, relatedId, "@ManyToOne");

        if (relation) {
            relations.push(relation);
        }
    });

    return relations;
}

export function getOneToOneRelations(xmlDoc, ownerEntityId = null) {
    const relations = [];

    xmlDoc.querySelectorAll("Edge").forEach(edge => {
        const sourceId = edge.getAttribute("source");
        const targetId = edge.getAttribute("target");
        const relationship = edge.getAttribute("relationship");

        if (relationship !== "1-1") {
            return;
        }

        // For 1-1, we treat the source entity as the owner.
        // Example: User -> Profile with 1-1 means User has Profile.
        const ownerId = sourceId;
        const relatedId = targetId;

        if (ownerEntityId && ownerId !== ownerEntityId) {
            return;
        }

        const relation = buildRelation(xmlDoc, ownerId, relatedId, "@OneToOne");

        if (relation) {
            relations.push(relation);
        }
    });

    return relations;
}

export function getSelectableRelations(xmlDoc, ownerEntityId = null) {
    return [
        ...getManyToOneRelations(xmlDoc, ownerEntityId),
        ...getOneToOneRelations(xmlDoc, ownerEntityId),
    ];
}

export function expandManyToMany(xmlDoc) {
    const application = xmlDoc.querySelector("Application");
    if (!application) return xmlDoc;

    const allEdges = Array.from(xmlDoc.querySelectorAll("Edge"));
    const mmEdges = allEdges.filter(edge => edge.getAttribute("relationship") === "m-m");

    if (mmEdges.length === 0) return xmlDoc;

    let nextEntityId = 0;
    xmlDoc.querySelectorAll("Entity").forEach(e => {
        const id = parseInt(e.getAttribute("id"), 10);
        if (!isNaN(id) && id > nextEntityId) nextEntityId = id;
    });

    mmEdges.forEach(mmEdge => {
        const sourceId = mmEdge.getAttribute("source");
        const targetId = mmEdge.getAttribute("target");

        const sourceEntity = xmlDoc.querySelector(`Entity[id="${sourceId}"]`);
        const targetEntity = xmlDoc.querySelector(`Entity[id="${targetId}"]`);
        if (!sourceEntity || !targetEntity) return;

        const sourceName = capitalizeFirst(sourceEntity.getAttribute("name"));
        const targetName = capitalizeFirst(targetEntity.getAttribute("name"));
        const bridgeName = `${sourceName}${targetName}Bridge`;

        const existingBridge = Array.from(xmlDoc.querySelectorAll("Entity"))
            .find(e => e.getAttribute("name") === bridgeName);
        if (existingBridge) {
            mmEdge.parentNode.removeChild(mmEdge);
            return;
        }

        nextEntityId += 1;
        const bridgeId = String(nextEntityId);

        const bridgeEntity = xmlDoc.createElement("Entity");
        bridgeEntity.setAttribute("id", bridgeId);
        bridgeEntity.setAttribute("name", bridgeName);
        bridgeEntity.setAttribute("x", "0");
        bridgeEntity.setAttribute("y", "0");

        const idField = xmlDoc.createElement("Field");
        idField.setAttribute("name", "id");
        idField.setAttribute("type", "Integer");
        idField.setAttribute("pk", "true");
        bridgeEntity.appendChild(idField);

        application.appendChild(bridgeEntity);

        const edge1 = xmlDoc.createElement("Edge");
        edge1.setAttribute("id", `synth-${sourceId}-${bridgeId}`);
        edge1.setAttribute("source", sourceId);
        edge1.setAttribute("target", bridgeId);
        edge1.setAttribute("relationship", "1-m");

        const edge2 = xmlDoc.createElement("Edge");
        edge2.setAttribute("id", `synth-${targetId}-${bridgeId}`);
        edge2.setAttribute("source", targetId);
        edge2.setAttribute("target", bridgeId);
        edge2.setAttribute("relationship", "1-m");

        application.appendChild(edge1);
        application.appendChild(edge2);

        mmEdge.parentNode.removeChild(mmEdge);
    });

    return xmlDoc;
}