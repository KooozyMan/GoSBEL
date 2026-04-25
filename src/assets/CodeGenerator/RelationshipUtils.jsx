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