import { javaReservedKeywords } from '../Lists/JavaReservedKeywords';
import { h2ReservedKeywords } from '../Lists/H2ReservedKeywords';
import { allowedDataTypes } from '../Lists/AllowedDataTypes';

export default function Validation(applicationName, nodes) {
    let nodeNames = [];
    let fieldNames = [];

    const validate = (field, text, flag = false) => {
        const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
        if (!flag) {
            if (!regex.test(field)) {
                return ['error', `${text} "${field}" must be english characters, no spaces, not empty, and cannot start with a number.`, 5000];
            }
            if (javaReservedKeywords.includes(field)) {
                return ['error', `${text} "${field}" is a java reserved keyword.`, 5000];
            }
            if (h2ReservedKeywords.includes(field.toUpperCase())) {
                return ['error', `${text} "${field}" is an h2 reserved keyword.`, 5000];
            }

            if (text === 'Field name') {
                if (fieldNames.includes(field)) {
                    return ['error', `${text} "${field}" is duplicated.`, 5000];
                } else {
                    fieldNames.push(field);
                }
            } else {
                if (nodeNames.includes(field)) {
                    return ['error', `${text} "${field}" is duplicated.`, 5000];
                } else {
                    nodeNames.push(field);
                }
            }
        } else {
            if (!allowedDataTypes.includes(field)) {
                return ['error', `${text} "${field}" is not supported.`, 5000];
            }
        }

        return null;
    }

    let temp = validate(applicationName, 'Application name');
    if (temp) {
        return temp;
    }

    for (const node of nodes) {
        temp = validate(node.data.label, 'Node name');
        if (temp) {
            return temp;
        }

        for (const field of node.data.fields) {
            temp = validate(field.name, 'Field name');
            if (temp) {
                return temp;
            }

            temp = validate(field.type, 'Field type', true);
            if (temp) {
                return temp
            }
        }
        fieldNames = [];
    }

    return null;
}