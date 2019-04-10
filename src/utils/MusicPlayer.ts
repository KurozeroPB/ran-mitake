import ytdl from "ytdl-core";
import { Guild, Message, VoiceState, PlayerOptions, Queue, Song } from "../utils/Interfaces";
import RanClient from "./RanClient";

export default class MusicPlayer {
    public id: string;

    public client: RanClient;
    public guild: Guild;
    public songQueue: Queue;
    public youtube: any;

    public constructor(options: PlayerOptions) {
        this.id = options.guild.id; // Collection id

        this.client = options.client;
        this.guild = options.guild;
        this.songQueue = options.songQueue;
        this.youtube = options.client.youtube;

        this.client.players.add(this);
    }

    public async play(msg: Message, args: string[]) {
        const voiceState = msg.member ? msg.member.voiceState : null;
        if (!voiceState || !voiceState.channelID)
            return msg.channel.createMessage("\\❌ | You must in voice channel to play music");
        if (!args.length)
            return msg.channel.createMessage("\\❌ | No query provided");

		if (/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/.test(args[0])) {
			const playlist = await this.youtube.getPlaylist(args[0]);
			const videos = await playlist.getVideos();
			for (const video of Object.values<any>(videos)) {
				try {
					const vid = await this.youtube.getVideoByID(video.id);
					await this._handleVideo(vid, msg, voiceState, true);
				} catch (e) {
                    continue;
                }
			}
			return await msg.channel.createMessage(`\\✅ | **${playlist.title}**: has been added to queue`);
        }

		try {
			const video = await this.youtube.getVideo(args[0]);
			return await this._handleVideo(video, msg, voiceState);
		} catch (error) {
			const videos = await this.youtube.searchVideos(args.join(" "), 1);
            if (!videos.length)
                return msg.channel.createMessage("\\❌ | No result found");

			const video = await this.youtube.getVideoByID(videos[0].id);
			return await this._handleVideo(video, msg, voiceState);
        }
    }

    public async queue(msg: Message) {
		if (!this.songQueue.songs.length)
            return await msg.channel.createMessage("\\❌ | Im not playing anything right now");

        return await msg.channel.createMessage(
            `🎶 | Now playing **${this.songQueue.songs[0].title}**\n\n` +
            `__**Song Queue**__:\n${this.songQueue.songs.map((x) => `• ${x.title}`).join("\n")}`
        );
    }

    public async playing(msg: Message) {
        if (!this.songQueue.songs.length)
            return await msg.channel.createMessage("\\❌ | Im not playing anything right now");

        return await msg.channel.createMessage(`\\🎵 | Now playing **${this.songQueue.songs[0].title}**`);
    }

    public async loop(msg: Message) {
        if (!this.songQueue.songs.length)
            return await msg.channel.createMessage("\\❌ | Im not playing anything right now");
        if (msg.member && !msg.member.voiceState.channelID)
            return await msg.channel.createMessage("\\❌ | You need to be in a voice channel to loop/unloop a queue");

        this.songQueue.loop = !this.songQueue.loop;
        return await msg.channel.createMessage(`\\✅ | ${this.songQueue.loop ? "loop" : "unloop" } current queue`);
    }

    public async skip(msg: Message) {
        if (!this.songQueue.songs.length)
            return await msg.channel.createMessage("\\❌ | Im not playing anything right now");
        if (msg.member && !msg.member.voiceState.channelID)
            return await msg.channel.createMessage("\\❌ | You need to be in a voice channel to skip songs");

        const voiceConnection = this.client.voiceConnections.get(this.guild.id);
        if (voiceConnection) {
            voiceConnection.stopPlaying();
            await msg.channel.createMessage("\\✅ | Song skipped");
        } else {
            await msg.channel.createMessage("\\❌ | Something went wrong");
        }
    }

    public async stop(msg: Message) {
        if (!this.songQueue.songs.length)
            return await msg.channel.createMessage("\\❌ | Im not playing anything right now");
        if (msg.member && !msg.member.voiceState.channelID)
            return await msg.channel.createMessage("\\❌ | You need to be in a voice channel to stop the queue");
        
        this.songQueue.songs = [];
        const voiceConnection = this.client.voiceConnections.get(this.guild.id);
        if (voiceConnection) {
            voiceConnection.stopPlaying();
            await msg.channel.createMessage("\\✅ | Stopped current queue");
        } else {
            await msg.channel.createMessage("\\❌ | Something went wrong");
        }
    }

    private async _handleVideo(video: any, msg: Message, voiceState: VoiceState, hide = false) {
        const song: Song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        }

        this.songQueue.connection = await this.client.joinVoiceChannel(voiceState.channelID!);
        this.songQueue.songs.push(song);

        if (!hide)
            await msg.channel.createMessage(`\\✅ | **${song.title}** added to queue`);

        return this._handlePlay(voiceState, this.songQueue.songs[0]); // Not sure but this might error with index out of range when using the stop command???
    }

    private _handlePlay(voiceState: VoiceState, song?: Song) {
        if (!song) {
            this.client.players.delete(this.guild.id);
            return this.client.leaveVoiceChannel(voiceState.channelID!);
        }

        if (this.songQueue.connection) {
            this.songQueue.connection.play(ytdl(song.url, { filter: "audioonly" }));
            this.songQueue.connection.setVolume(this.songQueue.volume);
            this.songQueue.connection.once("end", () => {
                const shiffed = this.songQueue.songs.shift();
                if (shiffed && this.songQueue.loop)
                    this.songQueue.songs.push(shiffed);

                return this._handlePlay(voiceState, this.songQueue.songs[0]);
            });

            this.songQueue.channel.createMessage(`\\🎶 | Now playing **${song.title}**`);
        }
    }
}