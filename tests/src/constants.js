module.exports = {
	apiBaseUrl: "http://localhost:3111/v1",
	pocketlibAppId: 6,
	authorTableId: 19,
	authorBioTableId: 20,
	authorProfileImageTableId: 21,
	storeBookCollectionTableId: 22,
	storeBookCollectionNameTableId: 23,
	storeBookTableId: 24,
	storeBookCoverTableId: 25,
	storeBookFileTableId: 26,
	// User id: 5, Dev id: 2, App id: 3 (davClassLibraryTestApp)
	davClassLibraryTestUserTestAppJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmNsYXNzbGlicmFyeXRlc3RAZGF2LWFwcHMudGVjaCIsInVzZXJfaWQiOjUsImRldl9pZCI6MiwiZXhwIjozNzU2MTA1MDAyMn0.jZpdLre_ZMWGN2VNbZOn2Xg51RLAT6ocGnyM38jljHI.1",
	// User id: 6, Dev id: 1, App id: 6 (PocketLib)
	authorUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImF1dGhvckBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6NiwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.npXRbu87twmlyqBSPuGb1qOn7Mh1ug_j0qEQiLz3N6U.2",
	// User id: 1, Dev id: 1, App id: 6 (PocketLib)
	davUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdkBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6MSwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.6LvizKcYttmWGLwGFS4A2nhSu6aOs8O9_pa2StxTQqE.3",
	// User id: 5, Dev id: 1, App id: 6 (PocketLib)
	davClassLibraryTestUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdkNsYXNzTGlicmFyeVRlc3RAZGF2LWFwcHMudGVjaCIsInVzZXJfaWQiOjUsImRldl9pZCI6MSwiZXhwIjozNzU2MTAxNzYwMH0.unJZtU7Mua12L_GsW09BvoeSQd56VR_RK9x3TE2GWQo.4",
	authorUserAuthor: {
		uuid: "099fbfa5-a6f1-41c1-99e9-0d02d8364f2d",
		firstName: "Lemony",
		lastName: "Snicket",
		bios: [
			{
				uuid: "0d13e998-1b34-46be-90af-76c401f10fe2",
				bio: "Dear reader, I'm sorry to tell you that I wrote some very unpleasant tales that you definitely should not read, if you want to further live a healthy life.",
				language: "en"
			},
			{
				uuid: "51e8135e-7ba7-4d59-8f93-2eda6141dfc8",
				bio: "Lieber Leser, es tut mir leid, dir sagen zu müssen, dass ich einige sehr unangenehme Geschichten geschrieben habe, die du auf keinen Fall lesen solltest, wenn du weiterhin ein gesundes Leben führen willst.",
				language: "de"
			}
		],
		collections: [
			{
				uuid: "2cfe3d1a-2853-4e5c-9261-1942a9c5ddd9",
				names: [
					{
						uuid: "5f0d68f0-fc99-457b-823a-b9994d17b6b1",
						name: "A Series of Unfortunate Events - Book the First",
						language: "en"
					},
					{
						uuid: "f41d7646-b513-4af4-b93d-3813b1edfc3e",
						name: "Eine Reihe betrüblicher Ereignisse - Der schreckliche Anfang",
						language: "de"
					}
				],
				books: [
					{
						uuid: "1cf6fc5f-8fa5-4972-895d-8b1d6552d41c",
						title: "A Series of Unfortunate Events - Book the First",
						description: "Dear Reader, I'm sorry to say that the book you are holding in your hands is extremely unpleasant. It tells an unhappy tale about three very unlucky children.",
						language: "en",
						status: "review",
						cover: {
							uuid: "bb63e1c9-866c-47b5-b852-e8473df404f3"
						},
						file: {
							uuid: "b7cf0cee-fe8d-4f08-8b6e-d391065f1abb"
						}
					},
					{
						uuid: "4df158a0-2157-4370-abac-dd3c25ca9ed3",
						title: "Eine Reihe betrüblicher Ereignisse - Der schreckliche Anfang",
						description: "Lieber Leser, es tut mir sehr Leid, aber das Buch, das du gerade in Händen hälst, ist außerordentlich unerfreulich. Es erzählt die traurige Geschichte von drei sehr bedauernswerten Kindern.",
						language: "de",
						status: "review"
					}
				]
			},
			{
				uuid: "285a5fca-8db2-4f73-8b12-5d41cdac82ed",
				names: [
					{
						uuid: "9c2f12ad-0e94-4379-a0d6-7e087380bf5b",
						name: "A Series of Unfortunate Events - Book the Second",
						language: "en"
					},
					{
						uuid: "25060c42-e7bf-4187-9712-0a94c51d497c",
						name: "Eine Reihe betrüblicher Ereignisse - Das Haus der Schlangen",
						language: "de"
					}
				],
				books: [
					{
						uuid: "5242102c-b107-4e82-8eb8-bebe2a990436",
						title: "A Series of Unfortunate Events - Book the Second",
						description: "Dear Reader, if you have picked up this book with the hope of finding a simple and cheery tale, I'm afraid you have picked up the wrong book altogether.",
						language: "en",
						status: "unpublished"
					},
					{
						uuid: "617833c8-4d0a-4d78-acd0-306a90e346ba",
						title: "Eine Reihe betrüblicher Ereignisse - Das Haus der Schlangen",
						description: "Lieber Leser, wenn du dieses Buch zur Hand genommen hast in der Hoffnung, darin Zerstreuung und Vergnügen zu finden, dann liegst du leider völlig falsch.",
						language: "de",
						status: "published"
					}
				]
			}
		],
		profileImage: {
			uuid: "14e5ad81-3105-4cbc-85c8-4ffeec1c3812"
		}
	},
	davUserAuthors: [
		{
			uuid: "622ad623-b9a4-415d-92ee-a66f8a7f3c51",
			firstName: "George",
			lastName: "Orwell",
			bios: [
				{
					uuid: "8d394726-6398-4915-a042-33520f5f68cc",
					bio: "Eric Arthur Blair, better known by his pen name George Orwell, was an English novelist and essayist, journalist and critic. His work is characterised by lucid prose, awareness of social injustice, opposition to totalitarianism, and outspoken support of democratic socialism.",
					language: "en"
				}
			],
			collections: [
				{
					uuid: "921b2d9f-5565-442f-95c0-1658ee57146b",
					names: [
						{
							uuid: "9ffb7b69-b9bc-45bc-ae94-34ec08c427c2",
							name: "1984",
							language: "en"
						}
					],
					books: [
						{
							uuid: "b0e4b01d-d53d-47b5-b5e4-48ea7bab6619",
							title: "1984",
							description: "Orwell's novel about the destruction of man by a perfect state machinery has long since become a metaphor for totalitarian conditions that no longer seems in need of explanation.",
							language: "en",
							status: "published"
						},
						{
							uuid: "5aa1c310-cbc6-48b4-9000-63315e713d25",
							title: "1984",
							description: "Orwells Roman über die Zerstörung des Menschen durch eine perfekte Staatsmaschinerie ist längst zu einer scheinbar nicht mehr erklärungsbedürftigen Metapher für totalitäre Verhältnisse geworden.",
							language: "de",
							status: "review"
						}
					]
				},
				{
					uuid: "21a9045f-4148-4e21-a701-8d19dd865d17",
					names: [
						{
							uuid: "5d8ebd0d-9e62-42bb-8565-963cbb6499d7",
							name: "Animal Farm",
							language: "en"
						}
					],
					books: [
						{
							uuid: "13836f22-040f-4efd-9f30-9202184b23bf",
							title: "Animal Farm",
							description: "Animal Farm is an allegorical novella by George Orwell, first published in England on 17 August 1945. The book tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.",
							language: "en",
							status: "published"
						}
					]
				}
			],
			profileImage: {
				uuid: "df45f27f-8ecb-41b0-864f-bb76669279f5"
			}
		},
		{
			uuid: "1dd980fd-ae20-4566-b842-a25e241bfb46",
			firstName: "Aldous",
			lastName: "Huxley",
			bios: [
				{
					uuid: "cd940d1d-4006-4aff-a680-0cfa58ed63f1",
					bio: "Aldous Leonard Huxley was an English writer and philosopher. He wrote nearly fifty books — both novels and non-fiction works — as well as wide-ranging essays, narratives, and poems.",
					language: "en"
				}
			],
			collections: []
		}
	]
}