module.exports = {
	apiBaseUrl: "http://localhost:3111/v1",
	pocketlibAppId: 6,
	bookTableId: 14,
	bookFileTableId: 15,
	authorTableId: 19,
	authorBioTableId: 20,
	authorProfileImageTableId: 21,
	storeBookCollectionTableId: 22,
	storeBookCollectionNameTableId: 23,
	storeBookTableId: 24,
	storeBookCoverTableId: 25,
	storeBookFileTableId: 26,
	categoryTableId: 27,
	categoryNameTableId: 28,
	// User id: 5, Dev id: 2, App id: 3 (davClassLibraryTestApp)
	davClassLibraryTestUserTestAppJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmNsYXNzbGlicmFyeXRlc3RAZGF2LWFwcHMudGVjaCIsInVzZXJfaWQiOjUsImRldl9pZCI6MiwiZXhwIjozNzU2MTA1MDAyMn0.jZpdLre_ZMWGN2VNbZOn2Xg51RLAT6ocGnyM38jljHI.1",
	authorUser: {
		// User id: 6, Dev id: 1, App id: 6 (PocketLib)
		jwt: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImF1dGhvckBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6NiwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.npXRbu87twmlyqBSPuGb1qOn7Mh1ug_j0qEQiLz3N6U.2",
		author: {
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
					bio: "Lieber Leser, es tut mir Leid, dir sagen zu müssen, dass ich einige sehr unangenehme Geschichten geschrieben habe, die du auf keinen Fall lesen solltest, wenn du weiterhin ein gesundes Leben führen willst.",
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
							price: 1399,
							status: "review",
							cover: {
								uuid: "bb63e1c9-866c-47b5-b852-e8473df404f3",
								ext: "png",
								type: "image/png"
							},
							file: {
								uuid: "b7cf0cee-fe8d-4f08-8b6e-d391065f1abb",
								ext: "pdf",
								type: "application/pdf"
							}
						},
						{
							uuid: "4df158a0-2157-4370-abac-dd3c25ca9ed3",
							title: "Eine Reihe betrüblicher Ereignisse - Der schreckliche Anfang",
							description: "Lieber Leser, es tut mir sehr Leid, aber das Buch, das du gerade in Händen hältst, ist außerordentlich unerfreulich. Es erzählt die traurige Geschichte von drei sehr bedauernswerten Kindern.",
							language: "de",
							status: "hidden",
							cover: {
								uuid: "2ba327c3-d33c-4181-900e-f4c331ddf288",
								ext: "jpg",
								type: "image/jpeg"
							},
							file: {
								uuid: "8f219b89-eb25-4c55-b1a4-467e36bfa081",
								ext: "epub",
								type: "application/zip+epub"
							}
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
							status: "unpublished",
							cover: {
								uuid: "a557824f-26ed-4e5e-8afa-43e20e76e2ad",
								ext: "png",
								type: "image/png"
							},
							file: {
								uuid: "fb2745e4-f095-4237-97d5-660e41356790",
								ext: "pdf",
								type: "application/pdf"
							}
						},
						{
							uuid: "617833c8-4d0a-4d78-acd0-306a90e346ba",
							title: "Eine Reihe betrüblicher Ereignisse - Das Haus der Schlangen",
							description: "Lieber Leser, wenn du dieses Buch zur Hand genommen hast in der Hoffnung, darin Zerstreuung und Vergnügen zu finden, dann liegst du leider völlig falsch.",
							language: "de",
							price: 2000,
							status: "published",
							cover: {
								uuid: "33b486ae-a22e-414b-915c-9a9520970ed8",
								ext: "jpg",
								type: "image/jpeg",
								content: "Hello"
							},
							file: {
								uuid: "d6f52b96-6bca-40ee-bb70-fb1347e1c8ba",
								ext: "epub",
								type: "application/zip+epub"
							}
						}
					]
				},
				{
					uuid: "7bb97f7e-cd7d-4fa8-a734-ef4732d33fcd",
					names: [
						{
							uuid: "e5a21039-1aae-406b-98ba-16d820e906e7",
							name: "A Series of Unfortunate Events - Book the Third",
							language: "en"
						}
					],
					books: [
						{
							uuid: "45c14ab4-8789-41c4-b0f6-11be0a86a94c",
							title: "A Series of Unfortunate Events - Book the Third",
							description: "Dear Reader, if you have not read anything about the Baudelaire orphans, then before you read even one more sentence, you should know this: Violet, Klaus and Sunny are kindhearted and quick-witted, but their lives, I am sorry to say, are filled with bad luck and misery.",
							language: "en",
							status: "unpublished"
						}
					]
				}
			],
			profileImage: {
				uuid: "14e5ad81-3105-4cbc-85c8-4ffeec1c3812",
				ext: "png",
				type: "image/png"
			}
		}
	},
	davUser: {
		// User id: 1, Dev id: 1, App id: 6 (PocketLib)
		jwt: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdkBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6MSwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.6LvizKcYttmWGLwGFS4A2nhSu6aOs8O9_pa2StxTQqE.3",
		authors: [
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
								price: 1000,
								status: "published",
								cover: {
									uuid: "63960709-1aa5-40dd-a7a3-8fa79aaa1f5d",
									ext: "jpg",
									type: "image/jpeg"
								},
								file: {
									uuid: "32adbdaa-0cbe-4672-80a6-19d4b8d6e943",
									ext: "pdf",
									type: "application/pdf"
								}
							},
							{
								uuid: "5aa1c310-cbc6-48b4-9000-63315e713d25",
								title: "1984",
								description: "Orwells Roman über die Zerstörung des Menschen durch eine perfekte Staatsmaschinerie ist längst zu einer scheinbar nicht mehr erklärungsbedürftigen Metapher für totalitäre Verhältnisse geworden.",
								language: "de",
								status: "review",
								file: {
									uuid: "050f7a0d-59a9-498a-9caa-8b418227e72b",
									ext: "epub",
									type: "application/zip+epub"
								}
							},
							{
								uuid: "0c3d12b8-1398-4f4e-b912-2aa460671579",
								title: "1984",
								description: "Le roman d'Orwell sur la destruction de l'homme par une machine étatique parfaite est devenu depuis longtemps une métaphore des conditions totalitaires qui ne semble plus avoir besoin d'explication.",
								language: "fr",
								status: "unpublished"
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
								status: "hidden",
								file: {
									uuid: "6566a1b6-0b17-4ff8-ba01-c58374c179ee",
									ext: "pdf",
									type: "application/pdf"
								}
							},
							{
								uuid: "f27a4472-d3f8-4310-9f76-156af7c03c43",
								title: "Farm der Tiere",
								description: "Farm der Tiere ist eine allegorische Novelle von George Orwell, die erstmals am 17. August 1945 in England veröffentlicht wurde. Das Buch erzählt die Geschichte einer Gruppe von Nutztieren, die sich gegen ihren menschlichen Bauern auflehnen, in der Hoffnung, eine Gesellschaft zu schaffen, in der die Tiere gleichberechtigt, frei und glücklich sein können.",
								language: "de",
								file: {
									uuid: "987335cf-4fd0-4c80-a6f1-97bedd46ecbf",
									ext: "epub",
									type: "application/zip+epub"
								}
							},
							{
								uuid: "ba96f327-f096-4408-8bd0-620f9aad3f09",
								title: "La Ferme des animaux",
								description: "La Ferme des animaux est un roman allégorique de George Orwell, publié pour la première fois en Angleterre le 17 août 1945. Le livre raconte l'histoire d'un groupe d'animaux de ferme qui se rebellent contre leur éleveur humain dans l'espoir de créer une société dans laquelle les animaux peuvent être égaux, libres et heureux.",
								language: "fr",
								status: "published"
							}
						]
					}
				],
				profileImage: {
					uuid: "df45f27f-8ecb-41b0-864f-bb76669279f5",
					ext: "jpg",
					type: "image/jpeg"
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
	},
	// User id: 5, Dev id: 1, App id: 6 (PocketLib)
	davClassLibraryTestUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdkNsYXNzTGlicmFyeVRlc3RAZGF2LWFwcHMudGVjaCIsInVzZXJfaWQiOjUsImRldl9pZCI6MSwiZXhwIjozNzU2MTAxNzYwMH0.unJZtU7Mua12L_GsW09BvoeSQd56VR_RK9x3TE2GWQo.4",
	// User id: 6, Dev id: 1, App id: 6 (PocketLib)
	klausUser: {
		jwt: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImtsYXVzLmJhdWRlbGFpcmVAZGF2LWFwcHMudGVjaCIsInVzZXJfaWQiOjcsImRldl9pZCI6MSwiZXhwIjozNzU2MTAxNzYwMH0.Ow0dLs1x_HR6fJ02UqQBVRxDME7cqp_4LRxioJfe_F4.5",
		books: [
			{
				uuid: "916b7ba2-db45-4c49-bef6-a90280efc686",
				storeBook: "b0e4b01d-d53d-47b5-b5e4-48ea7bab6619",
				file: "32adbdaa-0cbe-4672-80a6-19d4b8d6e943"
			}
		]
	},
	categories: [
		{
			uuid: "0d29f1a8-e181-448c-81d1-5000b167cb16",
			names: [
				{
					uuid: "a6125ec6-085f-4da3-b5c8-991922ec2081",
					name: "Children's book",
					language: "en"
				},
				{
					uuid: "b3cdf544-0485-48cf-a911-e7c187bcede5",
					name: "Kinderbuch",
					language: "de"
				}
			]
		},
		{
			uuid: "8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f",
			names: [
				{
					uuid: "60b73b76-310e-494b-be1a-8d19e5caf630",
					name: "Tragedy",
					language: "en"
				},
				{
					uuid: "ce8f692d-5a4e-416a-8bb0-33802366db04",
					name: "Tragödie",
					language: "de"
				}
			]
		}
	]
}