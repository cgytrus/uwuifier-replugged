import { common, components, util } from 'replugged';
const { React } = common;
const { SliderItem, SwitchItem, ButtonItem, Button } = components;
import * as uwuifier from '../uwuifier';

export function Settings(cfg) {
    function uwuifyIfEnabled(text) {
        return cfg.get('enabled') ? uwuifier.uwuify(text) : text;
    }
    return <div>
        <SwitchItem {...util.useSetting(cfg, 'enabled')}>
            {uwuifyIfEnabled('Enabled')}
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, 'reverseSubmitButton')}
            note={uwuifyIfEnabled(
                'Makes the Send Message button act as if the Enabled option is the opposite of what it is. ' +
                'The Send Message button can be enabled in Accessibility settings')}>
            {uwuifyIfEnabled('Reverse Send Message button behavior')}
        </SwitchItem>
        <SliderItem {...util.useSetting(cfg, 'periodToExclamationChance')}
            note={uwuifyIfEnabled('Chance of a period being replaced with an exclamation mark')}
            minValue={0}
            maxValue={1.0}
        >
            {uwuifyIfEnabled('Period to exclamation chance')}
        </SliderItem>
        <SliderItem {...util.useSetting(cfg, 'stutterChance')}
            minValue={0}
            maxValue={1.0}
        >
            {uwuifyIfEnabled('Stutter chance')}
        </SliderItem>
        <SliderItem {...util.useSetting(cfg, 'presuffixChance')}
            note={uwuifyIfEnabled('Chance of a pre-suffix (\'~\' and \'!\') appearing at the end of your message')}
            minValue={0}
            maxValue={1.0}
        >
            {uwuifyIfEnabled('Presuffix chance')}
        </SliderItem>
        <SliderItem {...util.useSetting(cfg, 'suffixChance')}
            note={uwuifyIfEnabled('Chance of a suffix ("nya~", "^^;;" etc.) appearing at the end of your message')}
            minValue={0}
            maxValue={1.0}
        >
            {uwuifyIfEnabled('Suffix chance')}
        </SliderItem>
        <SliderItem {...util.useSetting(cfg, 'duplicateCharactersChance')}
            note={uwuifyIfEnabled('Chance of a specific character (\',\' and \'!\') getting duplicated')}
            minValue={0}
            maxValue={1.0}
        >
            {uwuifyIfEnabled('Duplicate characters chance')}
        </SliderItem>
        <SliderItem {...util.useSetting(cfg, 'duplicateCharactersAmount')}
            markers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            stickToMarkers={true}
        >
            {uwuifyIfEnabled('Duplicate characters amount')}
        </SliderItem>
        <SwitchItem {...util.useSetting(cfg, 'uwuifyUi')}
            note={uwuifyIfEnabled('Please, just... don\'t')}>
            {uwuifyIfEnabled('uwuify UI')}
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, 'uwuifyConsole')}
            style={cfg.get('uwuifyUi') ? {} : { display: 'none' }}
            note={uwuifyIfEnabled('Seriously, this is getting a bit too far')}>
            {uwuifyIfEnabled('uwuify console')}
        </SwitchItem>
        <ButtonItem button={uwuifyIfEnabled('Reset')}
            note={uwuifyIfEnabled('Re-enter settings to see the default settings after resetting them')}
            color={Button.Colors.RED}
            onClick={() => {
                for(const setting of Object.keys(cfg.all())) {
                    cfg.delete(setting);
                }
            }}>
            {uwuifyIfEnabled('Reset settings')}
        </ButtonItem>
    </div>;
}
