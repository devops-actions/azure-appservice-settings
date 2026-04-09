import * as core from '@actions/core';

export class Utils {
    static validateSettings(customSettings: string, maskInputs?: string, treatEmptyAsNotSet?: string) {
        try {
            var customParsedSettings = JSON.parse(customSettings);
            if (maskInputs !== undefined && maskInputs !== "false") {
                Utils.maskValues(customParsedSettings);
            }
            if (treatEmptyAsNotSet === 'true') {
                customParsedSettings = Utils.filterEmptyValues(customParsedSettings);
            }
            return customParsedSettings;
        }
        catch (error) {
            throw new Error('Given Settings object is not a valid JSON');
        }
    }
    
    static maskValues(jsonContent: any) {
        for(let i = 0; i< Object.keys(jsonContent).length; i++) {
            core.setSecret(jsonContent[i].value);
        }
    }

    static filterEmptyValues(jsonContent: any[]) {
        return jsonContent.filter(item => {
            const value = item.value;
            if (value === null || value === undefined || String(value).trim() === '') {
                core.info(`Skipping setting '${item.name}' because its value is empty or blank.`);
                return false;
            }
            return true;
        });
    }

}