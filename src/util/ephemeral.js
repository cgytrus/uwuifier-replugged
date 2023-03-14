import { common, webpack } from 'replugged';
const { getModule } = webpack;

export function sendEphemeralMessage(content, username = 'Clyde', avatar = 'clyde') {
    sendEphemeralMessageInChannel(common.channels.getChannelId(), content, username, avatar);
}
export function sendEphemeralMessageInChannel(channelId, content, username = 'Clyde', avatar = 'clyde') {
    common.messages.receiveMessage(channelId, {
        id: getModule(['fromTimestamp'], false).fromTimestamp(Date.now()),
        type: 0,
        flags: 64,
        content: content,
        channel_id: channelId,
        author: {
            id: '1',
            username: username,
            discriminator: '0000',
            avatar: avatar,
            bot: true
        },
        attachments: [],
        embeds: [],
        pinned: false,
        mentions: [],
        mention_channels: [],
        mention_roles: [],
        mention_everyone: false,
        timestamp: (new Date).toISOString(),
        state: 'SENT',
        tts: false,
        loggingName: null
    });
}
