export type StoryImage = {
	src: string;
	alt: string;
};

export type StoryMessage = {
	/** Telegram post id, used to build the permalink */
	id: number;
	/** Publish date of the post (ISO 8601, as shown on Telegram) */
	date: string;
	/** Preview of the post this one replies to */
	quote?: string;
	/** Channel the post was forwarded from */
	forwardedFrom?: string;
	/** Body of the post. Supports `[label](url)` style links */
	lines: string[];
	image?: StoryImage;
};

/** Permalink of a post on the channel */
export const storyPostUrl = (id: number) => `https://t.me/codenshii/${id}`;

/**
 * The build log of Abbabal, told through the posts of the
 * [@codenshii](https://t.me/codenshii) channel.
 */
export const storyMessages: StoryMessage[] = [
	{
		id: 275,
		date: '2026-03-11T17:06:24+00:00',
		quote:
			"For some reasons the telegram website is not allowing me to get api id and hash and I think this actually happens a lot. You wouldn't expect telegram to do such a thing.",
		lines: [
			'Finally managed to get my api id and hash from [Telegram](https://my.telegram.org/auth?to=apps).',
			'I can now fetch data from channels using [Telethon](https://docs.telethon.dev/en/stable/).'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/Uhny_mPURF7IGfo8pv7USAeNI-bU5nwCV3TEUZ4B1VDuZYjp-pxGcJ-8kBaxb0htuWYPCi431NRR4uoCT2H5wvszwwV72hd3lrTJXW5WtRLTkHqWPjw_U410dWipgehTg1wT1m7bX5HsYns7JQrElA7lswIGPOCeDGQ9zdJGmtaoMdUsWulMMdxuHnCBOi65hHS_PwHifoQDdFhix8XFMEzYk_PZwwq8e6LUtduoVfvwnJU8IqKZlpcm6oCjL2A3JGm5iLAlHzHhbpOP9D0kPDKrZJBn8nM10jPNkdwq8fqjoqo78tgbQ6JUWC_5XrngsqaDuBGVWCfkEEMKWZhwDw.jpg',
			alt: 'Terminal running the scraper and fetching recent messages from the Ababaloch channel'
		}
	},
	{
		id: 277,
		date: '2026-03-11T18:50:13+00:00',
		quote:
			'Finally managed to get my api id and hash from Telegram. I can now fetch data from channels using Telethon.',
		lines: [
			'I managed to extract more than 7,000 messages starting from 2017.',
			'The channel I am extracting from is [ababaloch](https://t.me/ababaloch).',
			'My intention is to build an api that will provide amharic proverbs.',
			'I think I will learn a lot by doing that.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/qjJCAjhcMPgWGjtarpUPlBgj5AcQ7Z0Xf-g1WvyQvmGCG855XEXIF1CJX2qc7x_ms7v4e82VQkLP0XGH7EKiMnGKJw87QkClOQP_gPBpA9Jf7zJdKALo9raE-_-Au_wCcMjHCA2c6pCorVyEt6UuKX3Cg49D883sPk9ybiqcfa12RYATdVXc3fiLJ_q4KfqMVf4kIGXHf4W4c9TZQUHyiZWLIbXKzT_RPf9zRD4-xir90yyZdVbvEi3EbITWCcEe5qNgsQ8uJu8Sy14oxgMWl7oayjSCX56lxrX4Rse_XvAeRuPI0CDVl2z1Sge80CbGGJR-Sxg_onHCmY01P5ZMYQ.jpg',
			alt: 'The proverbs.db database with 7,186 scraped messages'
		}
	},
	{
		id: 278,
		date: '2026-03-11T18:53:50+00:00',
		quote: 'I managed to extract more than 7,000 messages starting from 2017.',
		lines: [
			'I have already set up a github actions cron job to fetch the proverbs 3 times per day and update my database.',
			'I triggered the workflow manually and it run without any errors.',
			'Currently, I am using SQLite for the db, and there was no db update since there was no new post on the channel.',
			'I will check the db again after something is posted on the channel.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/jUUI9owhcM8UzQvohBoMxEkAqZ7y34XFQC79Fs_KB-P075XL9968jJ-6640bYVlBp_tYPPQBibjUzL_u48Z7k-f5Aulo5BPjQGc2F8bDKcRtZ7kTkBoxQQh1ppmn1XIGDldJC0-OD_s43ffF_oZrvYnyZJ6cUhHGFkk1ex9wUa0WC7StDgso1SuJlnqCYtZ_w56ZqOLym8VAAJZz0bL51dTR7cOxUk86v9sTmxXaapdGRKz3TA2NNrss47s3_o-mdrA2E-pWA0Sw93s0ewJTHOp8STpl_F5hfDG_Qoz77BhpZnU7YBwFt_lIV-YTKdvoyiEJtJAtlBMeKvpnMW4u3g.jpg',
			alt: 'GitHub Actions run of fetch_proverbs.yml finishing successfully'
		}
	},
	{
		id: 282,
		date: '2026-03-12T06:17:24+00:00',
		quote: 'I will check the db again after something is posted on the channel.',
		lines: ['The cron job run successfully and I got updates on the db.']
	},
	{
		id: 283,
		date: '2026-03-14T15:38:38+00:00',
		quote: 'The cron job run successfully and I got updates on the db.',
		lines: [
			'In addition to the text, I am now saving the plain English translation, and the meaning of the proverb in both Amharic and English.',
			'I am using Gemini to handle the translation and to extract the meaning.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/PYN6f5oE4juF0mZ39_PdV8gq967D00t8d7sjjf_KqJzBiPBDU05KLBUFNk0evj4B15fjJP3HcQ-0m89jw19a3m2irHUeRGIeGEs6T2IpkdKDTadKw67c9rODh72jQe4EW5_nOZNEqCYf1sWA1mW3OM6Jjm3oGsiR95gMMj2i-AbWp0Fi0qKFrvgh5vxtiS74f_MwtKQRypeNtio_fwyMPn2Ngvjtlto8OlTkRZRIfZVRIlGHYKU6Qde3N0pKP1z4-4EihcRIsSXVBo5gE6x4M0TraLWOVXCOS4Zs5SJARCZ70cf-CGYT7AaPrajLxEcHC8xGbw_L0cxRHi16NkNmlg.jpg',
			alt: 'A proverb row with its English translation and its meaning in Amharic and English'
		}
	},
	{
		id: 284,
		date: '2026-03-14T15:45:26+00:00',
		quote:
			'In addition to the text, I am now saving the plain English translation, and the meaning of the proverb in both Amharic and English.',
		lines: ['I am also saving a confidence score and an indicator if a review is needed'],
		image: {
			src: 'https://cdn4.telesco.pe/file/hZsqathN6GAeWZpKkOrQJKWhNhFDhiG_mm-_-p5bw3GSG9Y4Kz6QCbKRs4z67Pg0K9BD7OFoyvK3WUTXBirA0rsg1zEinJK6e8k6dpoTHIxloPWFRSCN-opty2omoqdqVDY_VwXr4J6SJuJnVLDaaY4I9_KoAli6JiXRRWru0fC9PHzJztxSSN68AcHbeQvLXIG1PLclAsGUBn_6xXZUNh-anKlK1D0iUvnX4Xhn_q-SyLGAEUHOwGJYrr0tgNWh-2aXH1Ew_Eil_65xvMX8foEzk5El4x7U1zaka7RVrIOqHTyaSG1q7lTZ05XnfhFvvQEAwr9p6urUrA635pYyFQ.jpg',
			alt: 'The confidence score, review flag, and Gemini model recorded for a translation'
		}
	},
	{
		id: 286,
		date: '2026-03-14T15:56:48+00:00',
		quote:
			'I have already set up a github actions cron job to fetch the proverbs 3 times per day and update my database.',
		lines: [
			'I also set up another cron job to handle the Gemini translations.',
			'I am making it run 10 times per day.',
			'I have migrated 2,900 proverbs out of the 7,189 proverbs currently in the db and we are adding 3 per day.',
			'I will still have to analyze how many of those translations need a review or have low confidence score.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/FucauL91ICEH_r_G3dC4HZseQb_Ra-F_yeSXdj9UVVPOAUAeq4Wr4YcF5nDhD8htsQvrnezKpz2HpyyAY8Grg7o5lKjkhZ421emzL1NdvD1tS9hPuGKhfdWt006aDpMPpHZoOk1EzvyspNRrvbGPeaIbiAD0HONR9PnIZ_eMKiYkZZ-FdZWZA10LXYVdEJjRdk5JBak6phEFKY20sawOFldgpTNVPLuc1cidAOVdQpoS1okWbwGVsygbMADriC7dnlRnPKcib2M2DDHWAOOp0wFa5d2_uYjdGWXtML3nRt5TyAMV-dzBuyrZZeKWUlGu7yXaHqOYpApSsj26RwGGsg.jpg',
			alt: 'GitHub Actions run of process_proverbs.yml translating proverbs with AI'
		}
	},
	{
		id: 288,
		date: '2026-03-16T05:26:08+00:00',
		quote: 'I also set up another cron job to handle the Gemini translations.',
		lines: [
			'One of the cron jobs managed to run for 37 minutes and processed 1,000 proverbs in a go🤯',
			'On average the cron jobs run for 2 minutes and they parse 50-150 proverbs.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/Hz8EskPX0vVC7dyq2vwnlzNbdwIIiVR82Br3pp99F_UAreUHFiYzxpSwEjspWKOam9nb8HjuIGIbsfaSSMSdelFdmmPX7r8kk8p_Mz0sUUjViCR2nAlR59eFptMrc-TA-VCoHSnds-a2hESLxyUHJoAjcxFgGoEygJ_UxT2YAWtCPYAQdG8Q7KsUdu8n09hg9CkPYWOn1DvzgDtlbU1mYLr1uLhe8GX-D2H74ndbu335LkkipOVLFep6s8AEXpaqPQkk-_r7TiG_jhqfY8RwzKpi6zqDOBal9muLTYHqnyzQULj2if5s9Jp6vT5vrNWyuvqN6bK8wkevuOCnFB1pnA.jpg',
			alt: 'The AI cron job that ran for 37 minutes, circled in red'
		}
	},
	{
		id: 300,
		date: '2026-03-25T12:41:03+00:00',
		quote:
			'One of the cron jobs managed to run for 37 minutes and processed 1,000 proverbs in a go🤯',
		lines: [
			"Its been a while since our AI cron job managed to parse all the existing proverbs (that's 7,000+).",
			'I am currently building the backend using NestJS and I have so far figured out auth (jwt + passport, API key), rate limiter (Nest throttling), and a couple of endpoints to provide the proverbs.',
			'Both our scrapper and our parser are still running and they still fetch proverbs and add translation and meanings to our db.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/lSBN7StObh_aGIqv4uXx0msKtIqK0BZBYiQQtewciNcoO0SjQ-YErmv3DJbmxlnDEEPal18t7sSObMQaZPXfqcfYbhNXoTpryo3jnqdXDwCI9kISMqWwtQvR1Ssje1s78WnZPcwy_cvBTh2E4DIytXpP_OV03iajSowT5eapRaCA1jmmwjW31UHXyjb2S_2kNacf8UoTB8yxF5A2BXQhLN_htBYQZQCx-Oyz6y-lC6Jwbnaa_E2zT4OwIpNEP_gdssjpMZDnkW1UsRA4dO86nlZnivYNqxRakgXzjPGCOk2k0k3AvhgGgZotM1nI0Mt69Cprv7j3NEZpa4Ijlbxy9A.jpg',
			alt: 'The NestJS API docs listing the proverbs, API key, and auth endpoints'
		}
	},
	{
		id: 306,
		date: '2026-03-27T17:18:42+00:00',
		quote:
			"Its been a while since our AI cron job managed to parse all the existing proverbs (that's 7,000+).",
		lines: [
			'Currently working on the frontend.',
			"I haven't wired up everything with the backend.",
			"I really don't know why I am dedicating my time and effort on this thing.",
			'I am learning things but still...🤦‍♂'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/ksm7bTjzcjoISMv8Ur_62_Zp6iOwisb3e_7szKOdt0OMKhYAHYnXmQmzcCNk9Ixua34AP-oDukCfxISe9YHcsggCOOnIq1gsT9qQPK1UzP_MWWnvpzSyphiNaeFMOan-eozU7AN8xZS9oETduQK143toY17l6BviKNKehewgSeNhxiMzE7SaqI_BxNMyyufADTk9sSHYD5hx-ZeDHIctkk-qvnYP2N76RMulgLH5JBJdTFlFqkLnhMiirA0gcM4f_5kKsgQxGcmGK9uewa6an9DmHrCLh3CrWNR9W_UkxaE7rOv13gHeK9x28uyCknzt46NI-BxsnFipxz2V41qGiw.jpg',
			alt: 'The first frontend dashboard, showing API credentials and recent proverb responses'
		}
	},
	{
		id: 308,
		date: '2026-03-27T17:22:36+00:00',
		quote: 'Currently working on the frontend.',
		lines: [
			'I think everything will be easier once I set up a design system and add a bit more logic to the backend.'
		]
	},
	{
		id: 317,
		date: '2026-04-11T05:06:07+00:00',
		forwardedFrom: 'አማርኛ አባባሎች',
		lines: ['ውል ያዋውላል ታንኳ ያሻግራል አቧራ ያስላል']
	},
	{
		id: 318,
		date: '2026-04-11T05:06:23+00:00',
		quote: 'ውል ያዋውላል ታንኳ ያሻግራል አቧራ ያስላል',
		lines: ['Bars🔥']
	},
	{
		id: 319,
		date: '2026-04-11T06:47:09+00:00',
		quote: 'ውል ያዋውላል ታንኳ ያሻግራል አቧራ ያስላል',
		lines: ['This is the translation I got in my db'],
		image: {
			src: 'https://cdn4.telesco.pe/file/O6fFVQjNebwd0ivVvCRaAwT_ek8Bf3jozFuiWTKOiWbgUefGkEDd-D1MmUU89aK4Y31LznY1IfQfbZHn82FrzaiBiwp-yjjhT2XgO7mmnvivUiFC78AMOWtBik7G-3t_iJbCt9ZzI3KblgRyZzGfQQjTO7lA7h0PGKHv-lgGTxoANaPNgThEY0g0gZqmwzHpObnKJeDeDHR1RuEQMa--bhEKlxjKPLdyZmMRaz4QFTNWWz7-Vvn6ZO4nnRmLf3ZtL1KILF1MMFAZ01Vc0vBUACtG_lIoL455i7D6Tf7UwePFr9j8Ios__Abq5QZSqFRXc9OjWI5MZWBCeWYwTydfsA.jpg',
			alt: 'Screenshot of the translated proverb stored in the database'
		}
	},
	{
		id: 320,
		date: '2026-04-11T06:48:34+00:00',
		lines: ['Bruh💀'],
		image: {
			src: 'https://cdn4.telesco.pe/file/fmwHZhXmnkzNomWec27NBl7VyZauMV-DLcLvtliY-2RZQFT0oXXW7iZZdqA3O0kGgHuTEdzPQno7VC_CmjFqtYK98OwT0JWwWkTmnsvLNM2dRQufuKP1GDrYyj0tgmJbV8ORYvhbut9L0ybuDq9hxeTyzhsTkiYdlFeDeYdZibki-qHaIijrdrNuUmjH8uYKvEoem3yhvmnAj_F5Nd4NlAJOqMJqrJdd9gD8OkVDepor53mJTKU7QaRWin56YqWjbt498N9NiDWwVvmHwOe-5o_ClTp6yHF9PDXXj9Zjw9bb3h_dlujJdP5xY8gA8dQmHRqAixfOmMo1axCaGdSVFA.jpg',
			alt: 'Screenshot of the odd English translation stored in the database'
		}
	},
	{
		id: 321,
		date: '2026-04-11T11:41:08+00:00',
		quote:
			'I think everything will be easier once I set up a design system and add a bit more logic to the backend.',
		lines: ['I think I will have to abandon this project for sometime']
	},
	{
		id: 327,
		date: '2026-04-14T07:36:09+00:00',
		lines: ['[SQLite and the N+1 (no) problem](https://www.youtube.com/watch?v=qPfAQY_RahA)'],
		image: {
			src: 'https://cdn4.telesco.pe/file/vBoJmJ8Au1j8rBDaoWkQfG9wyJHn8LBK-A8ZI5qHO6lxrAd4cYSbGWTmV4BCqzfHcFHms0GgfbaS1YaTEtQDqXtFvxmsRkEu_Lz11MDPs-FEGgYt_ddNxxuL5lpPjZ5_GdxjG6vSCtNz-eez44r0kN6rZuroFaypjKoMJCw95O2VFR7LFPOhW8OAemEHpxkk-v0RUwb3mlSI4S3rhdSb3jq0e3t0yECEQ2pnHGHwuTP01iiTMr6jekNdomOozLLJBT22Jq_Rq2AEsr4-hdEn2sBrUMJtEarOTc4VYC1oEO2-Qr5VkSuaLocLCYznl3Bz3g8_eWXU-gUcI2r2oXfZIA.jpg',
			alt: 'Preview of the SQLite and the N+1 (no) problem video'
		}
	},
	{
		id: 358,
		date: '2026-05-16T08:19:53+00:00',
		lines: [
			'Today I found out about [wuchale](https://wuchale.dev/).',
			'It is an internationalization (i18n) toolkit and is actually named after the treaty of Wuchale.',
			'And yep it is made by an [Ethiopian](https://github.com/K1DV5).',
			'You can give the repo a star [here](https://github.com/wuchalejs/wuchale).'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/VCgdMqz6UkDU1Z6dTYMtmMysCQRe06loeAOEv0oZRygp7ygkWIjSHR0dVmtmX8zjik5um8ezgzPnlWXeTBusIobf1hXs1WAUKJvcx3tmzUoA-kdIODuckeeGYfPXCGAHrOZ4Zvb4h7VdGEw6Ct3bp9J-pC5g51pT-P3cGosTAYcExzP2zRL7PRnyv5Lg8GYLArJw3l35zAvy2qT1rM8TJs_vMmSQJyipw6dLZGWpBbuFUGjVIZ12-acoKxa432jjoOvZJwzFtlxWZmZ2zKFOgBu03qrwm-IwG7_0HxBl8PYol7j2CyARVt5XkB1j_uLkP7jHGh-KoFLu4EUGVWG_aQ.jpg',
			alt: 'The wuchale website'
		}
	},
	{
		id: 371,
		date: '2026-05-19T12:01:39+00:00',
		quote: 'I think I will have to abandon this project for sometime',
		lines: ['Got back on it.', 'Made api keys optional.', 'And the mobile app is running.'],
		image: {
			src: 'https://cdn4.telesco.pe/file/ZvuGag7Ss7U24XdBJrPs6V2IEPL4j7M6-godw-vSZOEBgMztA1UYt3iCTHo4VsUN69tSOiTTKbjxL53CQBKeoAzRAFK_Lig3Fv7oSumUzgy6RWP3dyTLCqTXQgczH5_MhWWZHHIqs1wbu26O7WwgaZkNCdBpGzSZenB4909u7R1OJRolAAjcbBk2pu6INq-yRv3BrnQAhk-Z2PaURaGsxBqJwaZmal2O6ZuLTPUiy-151nFLD-NxCx9N5O4_T6REzcn9gV6L7gopY1EaoPnfoJrT7NbQF9rKvOq5QOUcIUGAWWTTabQDE49jUp88kbE75IYumAoEv2nIc68ojYHhwA.jpg',
			alt: 'The Android app listing Amharic proverbs with translations and meanings'
		}
	},
	{
		id: 372,
		date: '2026-05-19T12:02:51+00:00',
		quote: 'Got back on it. Made api keys optional. And the mobile app is running.',
		lines: [
			'using capacitor with sveltekit for the mobile app.',
			"Let's see if we can make some widgets."
		]
	},
	{
		id: 374,
		date: '2026-05-19T12:22:44+00:00',
		quote: "Let's see if we can make some widgets.",
		lines: [
			'I got a widget.',
			'All it took was writing a couple of xml files and a java file to fetch, cache, and display the proverbs.'
		],
		image: {
			src: 'https://cdn4.telesco.pe/file/pYo7e9wrBR1j-l8vH8bVBdMTxquDLM6t2CRPFbXcK0BegV-OwhhgHklbv6SfxX0P-gm8RqvMYdbCma6_82Dwr0KKrI0svu_C_wBCL0fvs0HpHivoPHtKV5hEapUD-eyFBljO_gTxDqkv6M05XyPjUUpnloyyMEoMDIDPoYJCJOjhHTSLsCEiQama4GRkzGChBTVvzhoXUWpPAQHFWHGT8K9elFqZlvZKLM1PQN-sm9ZOlU2n7Ru9MKCZFOnoNsevWSgQNoMEsEirre01UBYeLJwZhCWcTjY3HiekkGDQedYqR1vyxWi8P1iaEkWZWLKX0XQVINyaU51LPKl7wB0H5Q.jpg',
			alt: 'The Android home screen widget showing a proverb'
		}
	},
	{
		id: 386,
		date: '2026-06-03T15:22:27+00:00',
		quote:
			'I got a widget. All it took was writing a couple of xml files and a java file to fetch, cache, and display the proverbs.',
		lines: [
			'I have never been this much hesitant to make a landing page.',
			'The project is almost done.'
		]
	},
	{
		id: 504,
		date: '2026-08-21T05:20:48+00:00',
		lines: [],
		image: {
			src: 'https://cdn4.telesco.pe/file/ozkDdr8FjwFxmiWwl7JsynvgqmJjM5uLSaw8EeikogbK4Q7_zyh7HkPDZcbWH6mutFTGDIi_kZY3FHVgOlrHu_-KtfGthwAl04fZJ8L59-I3CwNKJRtavtTjwXPQcHbWYNuzCdglMLFgxryPBtqfAe0Rlqj5aYEGt-GVN5NblRqQAgi756nyMpLnnNSDCLHcWUmrI_xrSIO5Y9-Cl78UYRaH7G6FNX-GXex82IaBYIymLE7FTDJwnf1ITXww90r6fthwJBHS6dgu6ZeR4g0BkElq7VwtwFlMdULF_ye0dFMUkknS07Vwg0mAd61QpMNM7ccSfUgc3g43hdAT39S1hg.jpg',
			alt: 'The app widget showing a proverb and its English translation'
		}
	},
	{
		id: 506,
		date: '2026-08-21T08:30:32+00:00',
		quote: 'Photo',
		lines: ['some proverbs are just outright weird and rude']
	},
	{
		id: 533,
		date: '2026-09-06T03:46:59+00:00',
		lines: [],
		image: {
			src: 'https://cdn4.telesco.pe/file/S6hkffmqdAr3E33Bj-5nTubYng86HbMTFfGzrD6XH_w_kYXW21D09FVxTkLlYl68Cj2XRJWf0Waw1x_oTO0Lh1E89w4UQg0QdyOLmc9Fq1jEPw6eaozMrp6uIbN_fRIDNFv3tm2OgPMfaLIPA-yTrRCNHKChR5jtmBf9-yAB-V8BypGmtwewMAi_v4cy8bDwALv8JNo6gMZVgF21gf20FkkKDFtmCrv2-aPRFsMQKUwGLg7scWZMCTPtQzBX5a6daPPQ4aRmZHnLbhnr1c_ZV_vyhfGJ1hidFDr5W3uEKs09PU1Ntqo-7lYVDaHeDkZ6Fq30sBcyhleIJEP8q2f0EQ.jpg',
			alt: 'The app widget showing another proverb with its English translation'
		}
	}
];
