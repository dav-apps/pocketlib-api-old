module.exports = {
	apiBaseUrl: "http://localhost:3111/v1",
	pocketlibAppId: 6,
	authorTableId: 19,
	storeBookCollectionTableId: 20,
	storeBookCollectionNameTableId: 21,
	storeBookTableId: 22,
	storeBookCoverTableId: 23,
	storeBookFileTableId: 24,
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
		bio: "Dear reader, I'm sorry to tell you that I wrote some very unpleasant tales that you definitely should not read, if you want to further live a healthy life.",
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
					}
				],
				books: [
					{
						uuid: "5242102c-b107-4e82-8eb8-bebe2a990436",
						title: "A Series of Unfortunate Events - Book the Second",
						description: "Dear Reader, if you have picked up this book with the hope of finding a simple and cheery tale, I'm afraid you have picked up the wrong book altogether.",
						language: "de",
						status: "unpublished"
					}
				]
			}
		]
	},
	davUserAuthors: [
		{
			uuid: "622ad623-b9a4-415d-92ee-a66f8a7f3c51",
			firstName: "George",
			lastName: "Orwell",
			bio: "Eric Arthur Blair, better known by his pen name George Orwell, was an English novelist and essayist, journalist and critic. His work is characterised by lucid prose, awareness of social injustice, opposition to totalitarianism, and outspoken support of democratic socialism.",
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
							title: "Animal Farm",
							description: "Animal Farm is an allegorical novella by George Orwell, first published in England on 17 August 1945. The book tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.",
							language: "en",
							status: "unpublished"
						}
					]
				}
			]
		},
		{
			uuid: "1dd980fd-ae20-4566-b842-a25e241bfb46",
			firstName: "Aldous",
			lastName: "Huxley",
			bio: "Aldous Leonard Huxley was an English writer and philosopher. He wrote nearly fifty books — both novels and non-fiction works — as well as wide-ranging essays, narratives, and poems.",
			collections: []
		}
	]
}