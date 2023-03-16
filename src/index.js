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
    uwuifyUi: false,
    uwuifyConsole: false
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

    // messages
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

    // ui
    const jsxModule = replugged.webpack.getByProps([ 'Fragment', 'jsx', 'jsxs' ]);
    let lastId = {};
    window.uwuifiedUiCache = new WeakMap();
    function uwuifyChildren(children) {
        if(!children)
            return children;
        if(typeof children == 'string') {
            if(!uwuifiedUiCache.has(lastId)) {
                uwuifiedUiCache.set(lastId, {});
            }
            let texts = uwuifiedUiCache.get(lastId);
            if(Object.hasOwn(texts, children))
                return texts[children];
            const uwuified = uwuifier.uwuify(children);
            texts[children] = uwuified;
            texts[uwuified] = uwuified;
            return uwuified;
        }
        else if(Array.isArray(children)) {
            for(let i = 0; i < children.length; i++) {
                children[i] = uwuifyChildren(children[i]);
            }
        }
        return children;
    }
    function jsxHook(args) {
        try {
            if(!cfg.get('enabled') || !cfg.get('uwuifyUi'))
                return args;
            const currentOwner = replugged.common.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current;
            if(currentOwner) {
                const domNode = replugged.common.ReactDOM.findDOMNode(currentOwner.stateNode);
                if(domNode)
                    lastId = domNode;
            }
            if(args[1].children) {
                args[1].children = uwuifyChildren(args[1].children);
            }
            return args;
        }
        catch(ex) {
            logger.error(ex);
        }
    }
    inject.before(jsxModule, 'jsx', jsxHook);
    inject.before(jsxModule, 'jsxs', jsxHook);

    // console
    const logFuncs = [ 'trace', 'debug', 'info', 'warn', 'error', 'log' ];
    for(let i = 0; i < logFuncs.length; i++) {
        const o = window.console[logFuncs[i]];
        if(o == null)
            return;
        inject.before(window.console, logFuncs[i], args => {
            try {
                if(!cfg.get('enabled') || !cfg.get('uwuifyConsole'))
                    return args;
                for(let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if(typeof arg != 'string')
                        continue;
                    args[i] = uwuifier.uwuify(arg);
                    // skip over formatting
                    i += (arg.match(/%s|%i|%d|%f|%o|%O|%c/g) || []).length;
                }
                return args;
            }
            catch(ex) {
                logger.error(ex);
            }
        });
    }
}

export function stop() {
    inject.uninjectAll();
}
