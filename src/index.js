import { Injector, Logger } from 'replugged';
const inject = new Injector();
const logger = Logger.plugin('uwuifier');

import * as uwuifier from './uwuifier';
import * as settings from './components/Settings.jsx';

import { sendEphemeralMessage } from './util/ephemeral';
import findInReactTree from './util/findInReactTree';
import isIgnoredAt from './util/isIgnoredAt';

const defaultSettings = {
    enabled: true,
    reverseSubmitButton: false,
    periodToExclamationChance: uwuifier.settings.periodToExclamationChance,
    stutterChance: uwuifier.settings.stutterChance,
    presuffixChance: uwuifier.settings.presuffixChance,
    suffixChance: uwuifier.settings.suffixChance,
    duplicateCharactersChance: uwuifier.settings.duplicateCharactersChance,
    duplicateCharactersAmount: uwuifier.settings.duplicateCharactersAmount,
};
const cfg = await replugged.settings.init('mod.cgytrus.uwuifier', defaultSettings);

export function Settings() {
    return settings.Settings(cfg);
}

function assignUwuifierSetting(name) {
    uwuifier.settings.__defineGetter__(name, () => cfg.get(name));
    uwuifier.settings.__defineSetter__(name, value => cfg.set(name, value));
}

function uwuifyMessage(message) {
    try {
        return uwuifier.uwuify(message, true, isIgnoredAt);
    }
    catch(error) {
        logger.error(error);
        try {
            sendEphemeralMessage(`${uwuifier.uwuify('oh no! there was an error in uwuifier!! ;-; i\'m gonna show it to you now')}\n${error}`);
        }
        catch {
            try {
                sendEphemeralMessage(`ow nyow! t-thewe was an e-ewwow in uwuifiew!!\\~ ;-; i'm gwonna s-show it to uwu nyow uwu\\~\\~\n${error}`);
            } catch(ephemeralMessageError) {
                logger.error(ephemeralMessageError);
            }
        }
    }
    return message;
}

export async function start() {
    assignUwuifierSetting('periodToExclamationChance');
    assignUwuifierSetting('stutterChance');
    assignUwuifierSetting('presuffixChance');
    assignUwuifierSetting('suffixChance');
    assignUwuifierSetting('duplicateCharactersChance');
    assignUwuifierSetting('duplicateCharactersAmount');

    const CTAC = replugged.webpack.getBySource(".slateTextArea");
    inject.after(CTAC.type, 'render', (_, res) => {
        const editor = findInReactTree(res, x => x.props?.promptToUpload && x.props.onSubmit);
        const rightSideButtons = findInReactTree(res, x => x.props?.channel && x.props.handleSubmit);
        let isSubmitButton = false;
        if(rightSideButtons != null) {
            rightSideButtons.props.handleSubmit = (original => function(...args) {
                isSubmitButton = true;
                return original(...args);
            })(rightSideButtons.props.handleSubmit);
        }
        if(editor != null) {
            editor.props.onEnter = (original => function(...args) {
                isSubmitButton = false;
                return original(...args);
            })(editor.props.onEnter);
            editor.props.onSubmit = (original => function(...args) {
                if(isSubmitButton && cfg.get('reverseSubmitButton') ? !cfg.get('enabled') : cfg.get('enabled'))
                    args[0] = uwuifyMessage(args[0]);
                return original(...args);
            })(editor.props.onSubmit);
        }
        return res;
    });
}

export function stop() {
    inject.uninjectAll();
}
