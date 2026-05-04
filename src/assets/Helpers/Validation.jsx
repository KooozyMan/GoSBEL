import { javaReservedKeywords } from '../Lists/JavaReservedKeywords';
import { h2ReservedKeywords } from '../Lists/H2ReservedKeywords';
import { allowedDataTypes } from '../Lists/AllowedDataTypes';
import language from '../Helpers/language';

export default function Validation(applicationName, nodes) {
    let nodeNames = [];
    let fieldNames = [];

    const validate = (field, text, flag = false) => {
        const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
        if (!flag) {
            if (!regex.test(field)) {
                return ['error', language.t('validation_first_error', { text: text, field: field }), 5000];
            }
            if (javaReservedKeywords.includes(field)) {
                return ['error', language.t('validation_second_error', { text: text, field: field }), 5000];
            }
            if (h2ReservedKeywords.includes(field.toUpperCase())) {
                return ['error', language.t('validation_third_error', { text: text, field: field }), 5000];
            }

            if (text === 'Field name') {
                if (fieldNames.includes(field)) {
                    return ['error', language.t('validation_fourth_error', { text: text, field: field }), 5000];
                } else {
                    fieldNames.push(field);
                }
            } else {
                if (nodeNames.includes(field)) {
                    return ['error', language.t('validation_fifth_error', { text: text, field: field }), 5000];
                } else {
                    nodeNames.push(field);
                }
            }
        } else {
            if (!allowedDataTypes.includes(field)) {
                return ['error', language.t('validation_sixth_error', { text: text, field: field }), 5000];
            }
        }

        return null;
    }

    let temp = validate(applicationName, language.t('validation_text_application_name'));
    if (temp) {
        return temp;
    }

    for (const node of nodes) {
        temp = validate(node.data.label, language.t('validation_text_node_name'));
        if (temp) {
            return temp;
        }

        for (const field of node.data.fields) {
            temp = validate(field.name, language.t('validation_text_field_name'));
            if (temp) {
                return temp;
            }

            temp = validate(field.type, language.t('validation_text_field_type'), true);
            if (temp) {
                return temp
            }
        }
        fieldNames = [];
    }

    return null;
}