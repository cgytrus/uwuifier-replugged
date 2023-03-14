import { common, components, util } from 'replugged';
const { React } = common;
const { SliderItem, SwitchItem } = components;

export function Settings(cfg, uwuifier) {
    function uwuifyIfEnabled(text) {
        return cfg.get('enabled') ? uwuifier.uwuify(text) : text;
    }
    return <div>
        <SwitchItem {...util.useSetting(cfg, 'enabled')}>
            {uwuifyIfEnabled('Enabled')}
        </SwitchItem>
        <SwitchItem {...util.useSetting(cfg, 'reverseSubmitButton')}
            note={uwuifyIfEnabled(
                `When uwuifier is enabled: don't uwuify the message if sent using the Send Message button
                When uwuifier is disabled: uwuify the message if sent using the Send Message button`
            )}>
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
    </div>;
}
