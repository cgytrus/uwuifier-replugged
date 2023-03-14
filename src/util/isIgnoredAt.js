let ignoreIn = [
    /^<#(?<id>\d{17,19})>$/gd,
    /<a?:\w{2,32}:\d{17,18}>/gd,
    /^<@&(?<id>\d{17,19})>$/gd,
    /^<@!?(?<id>\d{17,19})>$/gd,
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gd,
    /^(@everyone|@here)$/gd,
    /\`\`\`.*\`\`\`/gsd,
    /\`.*\`/gsd // single-line code
];
export default function isIgnoredAt(offset, string) {
    for (let pattern of ignoreIn) {
        for (let match of string.matchAll(pattern)) {
            for (let bounds of match.indices) {
                if (bounds === undefined)
                    continue;
                if (bounds[0] <= offset && offset <= bounds[1])
                    return true;
            }
        }
    }
    return false;
}
