import { Auth } from 'dav-js'

let constants = {
	apiBaseUrl: "http://localhost:3111/v1/api/1/master/call",
	pocketlibAppId: 4,
	bookTableId: 10,
	bookFileTableId: 11,
	publisherTableId: 33,
	publisherLogoItemTableId: 34,
	publisherLogoTableId: 35,
	authorTableId: 14,
	authorBioTableId: 15,
	authorProfileImageItemTableId: 32,
	authorProfileImageTableId: 16,
	storeBookCollectionTableId: 17,
	storeBookCollectionNameTableId: 18,
	storeBookSeriesTableId: 26,
	storeBookTableId: 19,
	storeBookReleaseTableId: 29,
	storeBookCoverItemTableId: 30,
	storeBookCoverTableId: 20,
	storeBookFileItemTableId: 31,
	storeBookFileTableId: 21,
	categoryTableId: 22,
	categoryNameTableId: 23,
	davDev: new Auth({
		apiKey: "eUzs3PQZYweXvumcWvagRHjdUroGe5Mo7kN1inHm",
		secretKey: "Stac8pRhqH0CSO5o9Rxqjhu7vyVp4PINEMJumqlpvRQai4hScADamQ",
		uuid: "d133e303-9dbb-47db-9531-008b20e5aae8"
	}),
	// User id: 2, Dev id: 2, App id: 5 (TestApp)
	testUserTestAppAccessToken: "ckktuu0gs00008iw3ctnrofzf",
	authorUser: {
		// User id: 3, Dev id: 1, App id: 4 (PocketLib)
		id: 3,
		accessToken: "ckktuub8p00018iw3hy7b5i0m",
		publisher: {
			uuid: "30484542-f3e2-4888-8078-15aca76f6995",
			name: "Penguin House",
			description: "Publishing for Penguins!",
			authors: [],
			logoItem: {
				uuid: "03b76a96-7ea3-407b-b895-fcb38df1b9f2",
				blurhash: "LUGR@iNG01oM%MoMIVWU03t7tQR%",
				logo: {
					uuid: "d4952600-7040-4932-895c-9c22307c1af1",
					file: "./files/olaf.jpg",
					etag: "143b5249c619f06be25c7ab82863593c",
					ext: "jpg",
					type: "image/jpeg"
				}
			}
		},
		author: {
			uuid: "099fbfa5-a6f1-41c1-99e9-0d02d8364f2d",
			firstName: "Lemony",
			lastName: "Snicket",
			twitterUsername: "lemonysnicket",
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
							language: "en",
							status: "review",
							releases: [
								{
									uuid: "f1ea042a-46da-4a4b-911e-733d1f84b335",
									releaseName: "Initial release",
									title: "A Series of Unfortunate Events - Book the First",
									description: "Dear Reader, I'm sorry to say that the book you are holding in your hands is extremely unpleasant. It tells an unhappy tale about three very unlucky children.",
									price: 1399,
									isbn: "9780064407663",
									coverItem: "bf3b23fb-dd1e-4c7a-a526-6d997765e77e",
									fileItem: "18f44382-9f5a-4933-be7a-6c4a03daa790",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
						},
						{
							uuid: "4df158a0-2157-4370-abac-dd3c25ca9ed3",
							language: "de",
							status: "hidden",
							releases: [
								{
									uuid: "fd80ef43-ecd9-4002-afc4-77f4762b49cc",
									releaseName: "Initial release",
									publishedAt: 1650129331,
									title: "Eine Reihe betrüblicher Ereignisse - Der schreckliche Anfang",
									description: "Lieber Leser, es tut mir sehr Leid, aber das Buch, das du gerade in Händen hältst, ist außerordentlich unerfreulich. Es erzählt die traurige Geschichte von drei sehr bedauernswerten Kindern.",
									isbn: "3442545790",
									status: "published",
									coverItem: "22699239-8326-4508-9b9b-07178a228bba",
									fileItem: "e3737248-690a-4084-a5b6-5f9b56eb1f58",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								},
								{
									uuid: "bb3b1d3e-4e8a-4945-af7a-9a8cb1d30926",
									releaseName: "Description update",
									releaseNotes: "Add more description",
									publishedAt: 1650149462,
									title: "Eine Reihe betrüblicher Ereignisse - Der schreckliche Anfang",
									description: "Lieber Leser, es tut mir sehr Leid, aber das Buch, das du gerade in Händen hältst, ist außerordentlich unerfreulich. Es erzählt die traurige Geschichte von drei sehr bedauernswerten Kindern. Die drei sind klug, charmant und einfallsreich, aber das nützt ihnen gar nichts. Im Gegenteil: Gleich zu Beginn dieses Buches erhalten die Kinder eine schreckliche Nachricht, und auch alles, was ihnen danach passiert, strotzt nur so vor Unheil, Elend und Verzweiflung.",
									isbn: "3442545790",
									status: "published",
									coverItem: "22699239-8326-4508-9b9b-07178a228bba",
									fileItem: "e3737248-690a-4084-a5b6-5f9b56eb1f58",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
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
							language: "en",
							status: "unpublished",
							releases: [
								{
									uuid: "7f5a550a-34dc-41ea-b71a-a36c625e8c05",
									releaseName: "Initial release",
									title: "A Series of Unfortunate Events - Book the Second",
									description: "Dear Reader, if you have picked up this book with the hope of finding a simple and cheery tale, I'm afraid you have picked up the wrong book altogether.",
									isbn: "9780064407670",
									status: "unpublished",
									coverItem: "9f3549bc-c0da-4301-8346-65d6164fbe38",
									fileItem: "a77579fc-5f77-4a0b-b616-99cb9d0d7ea7",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
						},
						{
							uuid: "617833c8-4d0a-4d78-acd0-306a90e346ba",
							language: "de",
							status: "published",
							releases: [
								{
									uuid: "ffa4d644-4d2a-4a17-8d52-d2e26181d35c",
									releaseName: "Initial release",
									publishedAt: 1650129332,
									title: "Eine Reihe betrüblicher Ereignisse - Das Haus der Schlangen",
									description: "Lieber Leser, wenn du dieses Buch zur Hand genommen hast in der Hoffnung, darin Zerstreuung und Vergnügen zu finden, dann liegst du leider völlig falsch.",
									price: 2000,
									isbn: "3442545803",
									status: "published",
									coverItem: "d9aaf019-b602-44a7-86ff-f39ec66ac8ae",
									fileItem: "a6500f16-b6f8-45fe-810a-4a2901a66aaa",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
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
							language: "en",
							status: "unpublished",
							releases: [
								{
									uuid: "5763aeb2-0843-4e2f-bac0-fd034d84d3fe",
									title: "A Series of Unfortunate Events - Book the Third",
									description: "Dear Reader, if you have not read anything about the Baudelaire orphans, then before you read even one more sentence, you should know this: Violet, Klaus and Sunny are kindhearted and quick-witted, but their lives, I am sorry to say, are filled with bad luck and misery.",
									isbn: "9780064407687"
								}
							]
						},
						{
							uuid: "2fd1beed-da6f-46c8-8631-a7931dda2ef2",
							language: "de",
							status: "published",
							releases: [
								{
									uuid: "c46d5cd6-4555-4012-aa0d-56d4d0f53fcc",
									releaseName: "Initial release",
									publishedAt: 1650125352,
									title: "Eine Reihe betrüblicher Ereignisse - Der Seufzersee",
									description: "Lieber Leser, wenn du noch nie etwas von den Baudelaire-Kindern gehört hast, dann solltest du, bevor du auch nur eine einzige Zeile liest, Folgendes wissen: Violet, Klaus und Sunny sind nett, charmant und klug, aber ihr Leben - leider, leider - strotzt nur so vor Elend und Unheil.",
									isbn: "3442545811",
									status: "published",
									coverItem: "4fbcc890-03c1-4fcd-9e38-89c725be1bf0",
									fileItem: "7f444ffc-e515-4f0f-a76d-7997cf64e63b",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
						}
					]
				},
				{
					uuid: "0734712e-86dd-474f-bf99-e9b77faf9c71",
					names: [
						{
							uuid: "84ce1293-6591-427d-8050-3e4daffbcac1",
							name: "A Series of Unfortunate Events - Book the Fourth",
							language: "en"
						}
					],
					books: [
						{
							uuid: "d0ca384f-9d8e-4a56-b2e1-c76a0a5cac4b",
							language: "en",
							status: "published",
							releases: [
								{
									uuid: "81d40349-0d9c-4167-b87b-94432090c1de",
									releaseName: "Initial release",
									publishedAt: 1650361252,
									title: "A Series of Unfortunate Events - Book the Fourth",
									description: "Dear Reader, I hope, for your sake, that you have not chosen to read this book because you are in the mood for a pleasant experience. If this is the case, I advise you to put this book down instantaneously, because of all the books describing the unhappy lives of the Baudelaire orphans, THE MISERABLE MILL might be the unhappiest yet.",
									price: 3500,
									isbn: "9780064407694",
									status: "published",
									coverItem: "78182c23-faa0-4950-9011-e0a0d724fa4a",
									fileItem: "47027837-ac77-4d30-8117-04e638e7d176",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								},
								{
									uuid: "27092d24-764d-44b1-967a-68f0a5f51254",
									title: "A Series of Unfortunate Events - Book the Fourth",
									description: "Dear Reader, I hope, for your sake, that you have not chosen to read this book because you are in the mood for a pleasant experience. If this is the case, I advise you to put this book down instantaneously, because of all the books describing the unhappy lives of the Baudelaire orphans, THE MISERABLE MILL might be the unhappiest yet. Violet, Klaus, and Sunny Baudelaire are sent to Paltryville to work in a lumbermill, and they find disaster and misfortune lurking behind every log.",
									price: 3500,
									isbn: "9780064407694",
									coverItem: "78182c23-faa0-4950-9011-e0a0d724fa4a",
									fileItem: "47027837-ac77-4d30-8117-04e638e7d176",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
						}
					]
				},
				{
					uuid: "b1156808-e81c-4cf9-b2ce-502baa23e548",
					names: [
						{
							uuid: "db9578cc-4f57-4dd3-bd0b-3f3abe06caef",
							name: "A Series of Unfortunate Events - Book the Fifth",
							language: "en"
						}
					],
					books: [
						{
							uuid: "d59bdd46-428d-412d-964b-0c57b41df478",
							language: "en",
							status: "published",
							releases: [
								{
									uuid: "4238eb86-9da3-4343-a8f0-94ea5c71130e",
									releaseName: "Initial release",
									publishedAt: 1650339311,
									title: "A Series of Unfortunate Events - Book the Fifth",
									description: "Dear Reader, if you are looking for a story about cheerful youngsters spending a jolly time at boarding school, look elsewhere. Violet, Klaus and Sunny Baudelaire are intelligent and resourceful children, and you might expect that they would do very well at school. Don't. For the Baudelaires, school turns out to be another miserable episode in their unlucky lives.",
									price: 0,
									isbn: "9780064408639",
									status: "published",
									coverItem: "86ffda0f-0622-41b7-8fc5-0b98f6db5e98",
									fileItem: "e276d6f1-1dc0-4e2d-bbad-cc0e975b4200",
									categories: [
										"0d29f1a8-e181-448c-81d1-5000b167cb16",	// Childrens
										"8f1ac4ab-aeba-4e8a-8071-a2a77553dc3f"		// Tragedy
									]
								}
							]
						}
					]
				}
			],
			series: [
				{
					uuid: "0bb3410d-eded-4713-8dff-5295bf7dc5ae",
					name: "A Series of Unfortunate Events",
					language: "en",
					storeBooks: [
						"1cf6fc5f-8fa5-4972-895d-8b1d6552d41c",
						"5242102c-b107-4e82-8eb8-bebe2a990436",
						"45c14ab4-8789-41c4-b0f6-11be0a86a94c",
						"d0ca384f-9d8e-4a56-b2e1-c76a0a5cac4b",
						"d59bdd46-428d-412d-964b-0c57b41df478"
					]
				},
				{
					uuid: "3029ea0f-a6c7-4c0e-be5f-ce6d77ac2296",
					name: "Eine Reihe betrüblicher Ereignisse",
					language: "de",
					storeBooks: [
						"4df158a0-2157-4370-abac-dd3c25ca9ed3",
						"617833c8-4d0a-4d78-acd0-306a90e346ba",
						"2fd1beed-da6f-46c8-8631-a7931dda2ef2"
					]
				}
			],
			coverItems: [
				{
					uuid: "bf3b23fb-dd1e-4c7a-a526-6d997765e77e",
					aspectRatio: "1:1.42377",
					blurhash: "LOK12L4?V]5FNeoJn~kB~8NKE3R%",
					cover: {
						uuid: "bb63e1c9-866c-47b5-b852-e8473df404f3",
						file: "./files/The Adventures of Sherlock Holmes.jpg",
						etag: "c47bb35fbe9388ab669aae80499b8488",
						ext: "jpg",
						type: "image/jpeg"
					}
				},
				{
					uuid: "22699239-8326-4508-9b9b-07178a228bba",
					aspectRatio: "1:1.4073",
					blurhash: "LQKmh00hrr5AI@j@s,j[^hWXENWB",
					cover: {
						uuid: "2ba327c3-d33c-4181-900e-f4c331ddf288",
						file: "./files/The Hound of the Baskervilles.jpg",
						etag: "c73ed5e0ceee34235f9857d05618db72",
						ext: "jpg",
						type: "image/jpeg"
					}
				},
				{
					uuid: "9f3549bc-c0da-4301-8346-65d6164fbe38",
					aspectRatio: "1:1.67151",
					blurhash: "LWJkJRja^hjaS}oei{WC~9ofIqWB",
					cover: {
						uuid: "a557824f-26ed-4e5e-8afa-43e20e76e2ad",
						file: "./files/The Memoirs of Sherlock Holmes.jpg",
						etag: "b97eb6911a265f99bad04dca3344e65a",
						ext: "jpg",
						type: "image/jpeg"
					}
				},
				{
					uuid: "d9aaf019-b602-44a7-86ff-f39ec66ac8ae",
					aspectRatio: "1:1.49701",
					blurhash: "LUKJ}L9bix0$OYo0nifj^hNcEMo0",
					cover: {
						uuid: "33b486ae-a22e-414b-915c-9a9520970ed8",
						file: "./files/The Return of Sherlock Holmes.jpg",
						etag: "e5e877cabc8e335c5c9ccee3fe537d39",
						ext: "jpg",
						type: "image/jpeg"
					}
				},
				{
					uuid: "4fbcc890-03c1-4fcd-9e38-89c725be1bf0",
					aspectRatio: "1:1.49701",
					blurhash: "LSJQs39brr0*I[oJs,fk}-NeIrV@",
					cover: {
						uuid: "c877a6e5-aebb-4c8c-b28d-817aaffc9226",
						file: "./files/The Sign of the Four.jpg",
						etag: "73a9473e8fe01a4f668d8102aaff54cf",
						ext: "jpg",
						type: "image/jpeg"
					}
				},
				{
					uuid: "78182c23-faa0-4950-9011-e0a0d724fa4a",
					aspectRatio: "1:1.41224",
					blurhash: "LMLg8{0RjL5GX8WBs.of^gW=IXRk",
					cover: {
						uuid: "33ddb7d6-03ff-430f-a526-e7ceeb43782d",
						file: "./files/The Valley of Fear.jpg",
						etag: "0bdf921ec97fcd6280fda4df621117bd",
						ext: "jpg",
						type: "image/jpeg"
					}
				},
				{
					uuid: "86ffda0f-0622-41b7-8fc5-0b98f6db5e98",
					aspectRatio: "1:1.41509",
					blurhash: "LbK18I9HjY4=NIodsnWX~SNIE3WX",
					cover: {
						uuid: "fcd1ddb9-fab4-465e-ad8c-f5074e2d7fc3",
						file: "./files/A Study in Scarlet.jpg",
						etag: "017157c7e8e63d1ad0f9730e46799d61",
						ext: "jpg",
						type: "image/jpeg"
					}
				}
			],
			fileItems: [
				{
					uuid: "18f44382-9f5a-4933-be7a-6c4a03daa790",
					fileName: "Bad Beginning.epub",
					file: {
						uuid: "b7cf0cee-fe8d-4f08-8b6e-d391065f1abb",
						file: "./files/The Adventures of Sherlock Holmes.epub",
						etag: "9c3e53972a82f86f22f2327e4d225e36",
						ext: "epub",
						type: "application/epub+zip"
					}
				},
				{
					uuid: "e3737248-690a-4084-a5b6-5f9b56eb1f58",
					fileName: "Schrecklicher Anfang.epub",
					file: {
						uuid: "8f219b89-eb25-4c55-b1a4-467e36bfa081",
						file: "./files/The Hound of the Baskervilles.epub",
						etag: "8da9acb232e35440bce1040dfe38cfce",
						ext: "epub",
						type: "application/epub+zip"
					}
				},
				{
					uuid: "a77579fc-5f77-4a0b-b616-99cb9d0d7ea7",
					fileName: "The Reptile Room.epub",
					file: {
						uuid: "fb2745e4-f095-4237-97d5-660e41356790",
						file: "./files/The Memoirs of Sherlock Holmes.epub",
						etag: "a97d439bfa7d13b9218588d74d4a4632",
						ext: "epub",
						type: "application/epub+zip"
					}
				},
				{
					uuid: "a6500f16-b6f8-45fe-810a-4a2901a66aaa",
					fileName: "Haus der Schlangen.epub",
					file: {
						uuid: "d6f52b96-6bca-40ee-bb70-fb1347e1c8ba",
						file: "./files/The Return of Sherlock Holmes.epub",
						etag: "c1fdcc4e9e8b1a9ac944d800726c8352",
						ext: "epub",
						type: "application/epub+zip"
					}
				},
				{
					uuid: "7f444ffc-e515-4f0f-a76d-7997cf64e63b",
					fileName: "Seufzersee.epub",
					file: {
						uuid: "090cb584-c10e-4068-9346-81f134c3a5e3",
						file: "./files/The Sign of the Four.epub",
						etag: "2e5221e064112a49df3c496362f7648d",
						ext: "epub",
						type: "application/epub+zip"
					}
				},
				{
					uuid: "47027837-ac77-4d30-8117-04e638e7d176",
					fileName: "The Miserable Mill.epub",
					file: {
						uuid: "4dd8c2cf-82a0-4887-95f1-68284679a026",
						file: "./files/The Valley of Fear.epub",
						etag: "cae2fb34685cd449e6873060707ac4ff",
						ext: "epub",
						type: "application/epub+zip"
					}
				},
				{
					uuid: "e276d6f1-1dc0-4e2d-bbad-cc0e975b4200",
					fileName: "The Austere Academy.epub",
					file: {
						uuid: "35e1418d-ff2f-4498-8a93-a0bf7b47ccce",
						file: "./files/A Study in Scarlet.epub",
						etag: "1deab14f07d6bd786b8444423ba59976",
						ext: "epub",
						type: "application/epub+zip"
					}
				}
			],
			profileImageItem: {
				uuid: "0c7cfccb-bbea-4e55-a14f-d6187a82c8ba",
				blurhash: "LUGR@iNG01oM%MoMIVWU03t7tQR%",
				profileImage: {
					uuid: "14e5ad81-3105-4cbc-85c8-4ffeec1c3812",
					file: "./files/Hildebrandt.jpg",
					etag: "7e5755c34e9472a23d4b3adc87bcc49d",
					ext: "jpg",
					type: "image/jpeg"
				}
			}
		}
	},
	davUser: {
		// User id: 1, Dev id: 1, App id: 4 (PocketLib)
		id: 1,
		accessToken: "ckktuujpl00028iw3s8ssrrsb",
		publishers: [
			{
				uuid: "6855224f-b1e6-4f01-a7e6-515cf359af4b",
				name: "Standard Ebooks",
				description: "Standard Ebooks is a volunteer-driven project that produces new editions of public domain ebooks that are lovingly formatted, open source, free of U.S. copyright restrictions, and free of cost.",
				websiteUrl: "https://standardebooks.org/",
				authors: [],
				logoItem: {
					uuid: "830e7cd5-a41f-425f-a806-829475a02940",
					blurhash: "LUGR@iNG01oM%MoMIVWU03t7tQR%",
					logo: {
						uuid: "ec0ca054-8e4b-4e65-a42e-a948f01d3469",
						file: "./files/standardebooks.png",
						etag: "2725dda467b0aaa5253e9956c5c2659c",
						ext: "png",
						type: "image/png"
					}
				}
			},
			{
				uuid: "3b45cb2b-b345-4556-81a8-8e9e6e27a7c1",
				name: "Test publisher",
				description: "Test publisher description",
				authors: []
			}
		],
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
								language: "en",
								status: "published",
								releases: [
									{
										uuid: "2e5bc1b6-747f-478b-8d6b-e94ca5c5757a",
										releaseName: "Initial release",
										publishedAt: 1650319352,
										title: "1984",
										description: "Orwell's novel about the destruction of man by a perfect state machinery has long since become a metaphor for totalitarian conditions that no longer seems in need of explanation.",
										price: 1000,
										status: "published",
										coverItem: "bac664ad-f5f4-464d-bf0f-bbf4b126e880",
										fileItem: "b7d0dd22-4f65-4f96-83d7-bdcc3d682e7d",
										categories: [
											"27c78f90-934e-41e3-8738-b20f6d76f0a9"		// Dystopia
										]
									},
									{
										uuid: "182e4691-d9b6-4d9d-854f-b097dc348035",
										title: "1984",
										description: "Orwell's novel about the destruction of man by a perfect state machinery has long since become a metaphor for totalitarian conditions that no longer seems in need of explanation.",
										price: 1984,
										coverItem: "bac664ad-f5f4-464d-bf0f-bbf4b126e880",
										fileItem: "b7d0dd22-4f65-4f96-83d7-bdcc3d682e7d",
										categories: [
											"27c78f90-934e-41e3-8738-b20f6d76f0a9"		// Dystopia
										]
									}
								]
							},
							{
								uuid: "5aa1c310-cbc6-48b4-9000-63315e713d25",
								language: "de",
								status: "review",
								releases: [
									{
										uuid: "43708a0f-d06b-4733-850a-4bd22e5f4ac4",
										releaseName: "Initial release",
										title: "1984",
										description: "Orwells Roman über die Zerstörung des Menschen durch eine perfekte Staatsmaschinerie ist längst zu einer scheinbar nicht mehr erklärungsbedürftigen Metapher für totalitäre Verhältnisse geworden.",
										isbn: "9783548234106",
										fileItem: "420fc2a1-d0f3-4770-8e60-c6da3b3b0985",
										categories: [
											"27c78f90-934e-41e3-8738-b20f6d76f0a9"		// Dystopia
										]
									}
								]
							},
							{
								uuid: "0c3d12b8-1398-4f4e-b912-2aa460671579",
								language: "fr",
								status: "unpublished",
								releases: [
									{
										uuid: "525bc760-1bc3-44ab-8a99-5abd92a2252b",
										title: "1984",
										description: "Le roman d'Orwell sur la destruction de l'homme par une machine étatique parfaite est devenu depuis longtemps une métaphore des conditions totalitaires qui ne semble plus avoir besoin d'explication."
									}
								]
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
								language: "en",
								status: "hidden",
								releases: [
									{
										uuid: "0d4307c4-5568-48b5-a266-02df2f80de6f",
										releaseName: "Initial release",
										publishedAt: 1650339311,
										title: "Animal Farm",
										description: "Animal Farm is an allegorical novella by George Orwell, first published in England on 17 August 1945. The book tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy.",
										status: "published",
										coverItem: "708bf15c-8e6e-49c6-8113-33f5ddb28d15",
										fileItem: "290a762c-5c9a-4951-9c38-a64dd3b2a6e4"
									}
								]
							},
							{
								uuid: "f27a4472-d3f8-4310-9f76-156af7c03c43",
								language: "de",
								releases: [
									{
										uuid: "d425b3b5-3fad-45bb-808d-50fe797a3de0",
										releaseName: "Initial release",
										title: "Farm der Tiere",
										description: "Farm der Tiere ist eine allegorische Novelle von George Orwell, die erstmals am 17. August 1945 in England veröffentlicht wurde. Das Buch erzählt die Geschichte einer Gruppe von Nutztieren, die sich gegen ihren menschlichen Bauern auflehnen, in der Hoffnung, eine Gesellschaft zu schaffen, in der die Tiere gleichberechtigt, frei und glücklich sein können.",
										isbn: "3257201184",
										fileItem: "4a7a2328-4522-4d06-ab45-a3cc4e502348"
									}
								]
							},
							{
								uuid: "ba96f327-f096-4408-8bd0-620f9aad3f09",
								language: "fr",
								status: "published",
								releases: [
									{
										uuid: "d978c438-0711-439e-b12d-6549a5842851",
										releaseName: "Initial release",
										publishedAt: 1650336312,
										title: "La Ferme des animaux",
										description: "La Ferme des animaux est un roman allégorique de George Orwell, publié pour la première fois en Angleterre le 17 août 1945. Le livre raconte l'histoire d'un groupe d'animaux de ferme qui se rebellent contre leur éleveur humain dans l'espoir de créer une société dans laquelle les animaux peuvent être égaux, libres et heureux.",
										price: 0,
										status: "published",
										coverItem: "0091cc8d-7883-4019-8c2e-1d4fb092b950",
										fileItem: "c8c4736b-ec69-4524-905d-eea43c69c73d"
									}
								]
							}
						]
					}
				],
				series: [],
				coverItems: [
					{
						uuid: "bac664ad-f5f4-464d-bf0f-bbf4b126e880",
						aspectRatio: "1:1.5",
						blurhash: "LML.f7~C-pbvI9J,%2oz^Q9ttRxu",
						cover: {
							uuid: "63960709-1aa5-40dd-a7a3-8fa79aaa1f5d",
							file: "./files/The House of Arden.jpg",
							etag: "4f02b59bc16b8c4475bfcad53c83e443",
							ext: "jpg",
							type: "image/jpeg"
						}
					},
					{
						uuid: "708bf15c-8e6e-49c6-8113-33f5ddb28d15",
						aspectRatio: "1:1.59309",
						blurhash: "LbR.uzbH.RsoHXa|x]n%xua|V@jt",
						cover: {
							uuid: "244d873a-ce11-4a01-920b-c1ef2855d4e5",
							file: "./files/A Christmas Carol.jpg",
							etag: "36c33e7f2a5ca3c7c437440e260ebe4c",
							ext: "jpg",
							type: "image/jpeg"
						}
					},
					{
						uuid: "0091cc8d-7883-4019-8c2e-1d4fb092b950",
						aspectRatio: "1:1.59309",
						blurhash: "LbR.uzbH.RsoHXa|x]n%xua|V@jt",
						cover: {
							uuid: "9ac13017-9b5f-4fef-abe4-6964171767f0",
							file: "./files/Hard Times.jpg",
							etag: "a44e9413c96f3fa33caf7ee33f56bd13",
							ext: "jpg",
							type: "image/jpeg"
						}
					}
				],
				fileItems: [
					{
						uuid: "b7d0dd22-4f65-4f96-83d7-bdcc3d682e7d",
						fileName: "1984.epub",
						file: {
							uuid: "32adbdaa-0cbe-4672-80a6-19d4b8d6e943",
							file: "./files/The House of Arden.epub",
							etag: "044301fb28b6ebe5885a30efe1397a59",
							ext: "epub",
							type: "application/epub+zip"
						}
					},
					{
						uuid: "420fc2a1-d0f3-4770-8e60-c6da3b3b0985",
						fileName: "1984.epub",
						file: {
							uuid: "050f7a0d-59a9-498a-9caa-8b418227e72b",
							file: "./files/The Story of the Amulet.epub",
							etag: "4f7de9ca14597fae699aff326a235493",
							ext: "epub",
							type: "application/epub+zip"
						}
					},
					{
						uuid: "290a762c-5c9a-4951-9c38-a64dd3b2a6e4",
						fileName: "Animal Farm.epub",
						file: {
							uuid: "6566a1b6-0b17-4ff8-ba01-c58374c179ee",
							file: "./files/A Christmas Carol.epub",
							etag: "05641646f72e66cf3c1d2f916a067524",
							ext: "epub",
							type: "application/epub+zip"
						}
					},
					{
						uuid: "4a7a2328-4522-4d06-ab45-a3cc4e502348",
						fileName: "Farm der Tiere.epub",
						file: {
							uuid: "987335cf-4fd0-4c80-a6f1-97bedd46ecbf",
							file: "./files/A Tale of Two Cities.epub",
							etag: "cc812afe547dfb8b0665daeb82626a00",
							ext: "epub",
							type: "application/epub+zip"
						}
					},
					{
						uuid: "c8c4736b-ec69-4524-905d-eea43c69c73d",
						fileName: "Ferme des animaux.epub",
						file: {
							uuid: "ab3f8f74-b335-4bf2-bc1e-4f85f866ae22",
							file: "./files/Hard Times.epub",
							etag: "a490f28fe1d8ffa87e38e32fe9ba5e63",
							ext: "epub",
							type: "application/epub+zip"
						}
					}
				],
				profileImageItem: {
					uuid: "34253e30-bbfe-42e3-9f9c-b0511f359802",
					blurhash: "LUI;@boe^*j[-oWBt6of~WRjjss:",
					profileImage: {
						uuid: "df45f27f-8ecb-41b0-864f-bb76669279f5",
						file: "./files/Bebel.jpg",
						etag: "5a05d8649d62c2051167126ad8cf8ec2",
						ext: "jpg",
						type: "image/jpeg"
					}
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
				collections: [],
				series: [],
				coverItems: [],
				fileItems: []
			},
			{
				uuid: "74667201-3a22-4486-a455-b4b381a9d45a",
				firstName: "Daniel",
				lastName: "Defoe",
				bios: [],
				collections: [
					{
						uuid: "98fbd4b0-6a97-4792-8b77-789b355b4dd7",
						names: [
							{
								uuid: "d92ba11d-12b4-4ec9-9e3b-96ee5dd234cf",
								name: "The Life and Adventures of Robinson Crusoe",
								language: "en"
							}
						],
						books: [
							{
								uuid: "fc5e9938-1fbf-420e-9d11-7143dd7d42f1",
								language: "en",
								status: "published",
								releases: [
									{
										uuid: "1c9dfe5e-1de0-47fc-bb42-afd258e8d414",
										releaseName: "Initial release",
										publishedAt: 1651338517,
										title: "The Life and Adventures of Robinson Crusoe",
										description: "Robinson Crusoe is one of the most popular books ever written in the English language, published in innumerable editions and translated into almost every language of the world, not to mention the many versions created in film, television and even radio.",
										price: 1200,
										status: "published",
										coverItem: "87c20601-bf63-423e-afa7-008a97e397d5",
										fileItem: "ac91cf62-3013-43b2-ae4b-1829c6aa0c1c",
										categories: [
											"76dd74fa-0fb3-4d80-8c0a-6d6a803383a7"		// Adventure
										]
									},
									{
										uuid: "db5e6175-6dd0-4a6f-9142-fa1b3778a3a8",
										releaseName: "Update chategories",
										releaseNotes: "Add fiction category",
										title: "The Life and Adventures of Robinson Crusoe",
										description: "Robinson Crusoe is one of the most popular books ever written in the English language, published in innumerable editions and translated into almost every language of the world, not to mention the many versions created in film, television and even radio.",
										price: 1200,
										status: "published",
										coverItem: "87c20601-bf63-423e-afa7-008a97e397d5",
										fileItem: "ac91cf62-3013-43b2-ae4b-1829c6aa0c1c",
										categories: [
											"8c98e8cb-33a5-460e-8c33-3fa335e11c81",	// Fiction
											"76dd74fa-0fb3-4d80-8c0a-6d6a803383a7"		// Adventure
										]
									}
								]
							}
						]
					},
					{
						uuid: "8ea0b976-fe67-472d-ae2f-88869b7df625",
						names: [
							{
								uuid: "1513dba4-22ee-463b-a186-ba44bb4f3ebf",
								name: "The Further Adventures of Robinson Crusoe",
								language: "en"
							}
						],
						books: [
							{
								uuid: "36561f01-0523-4dbe-9bf3-2fb8a208e8f6",
								language: "en",
								status: "published",
								releases: [
									{
										uuid: "335f6812-f897-4fbe-a385-17b4425f1394",
										releaseName: "Initial release",
										publishedAt: 1650339352,
										title: "The Further Adventures of Robinson Crusoe",
										description: "After his return from an uninhabited island, Robinson Crusoe marries and starts a family. Despite his comfortable life in England, he has an intense desire to go back to sea.",
										price: 1200,
										status: "published",
										coverItem: "3a68a4a9-d6a0-4a32-b13c-32c753cb0038",
										fileItem: "671f2d6c-c6f1-449c-b392-320549794c29",
										categories: [
											"76dd74fa-0fb3-4d80-8c0a-6d6a803383a7"		// Adventure
										]
									}
								]
							}
						]
					}
				],
				series: [
					{
						uuid: "6f9793de-33e0-4a10-ac4a-fb2b18f28a48",
						name: "Robinson Crusoe",
						language: "en",
						storeBooks: [
							"fc5e9938-1fbf-420e-9d11-7143dd7d42f1",
							"36561f01-0523-4dbe-9bf3-2fb8a208e8f6"
						]
					}
				],
				coverItems: [
					{
						uuid: "87c20601-bf63-423e-afa7-008a97e397d5",
						aspectRatio: "1:1.5",
						blurhash: "LbR.uzbH.RsoHXa|x]n%xua|V@jt",
						cover: {
							uuid: "fb230b01-ee89-4209-83f5-7680e116ed14",
							file: "./files/The Life and Adventures of Robinson Crusoe.jpg",
							etag: "bfdfc26eef7ff3628d85454f3c414d51",
							ext: "jpg",
							type: "image/jpeg"
						}
					},
					{
						uuid: "3a68a4a9-d6a0-4a32-b13c-32c753cb0038",
						aspectRatio: "1:1.5",
						blurhash: "LbR.uzbH.RsoHXa|x]n%xua|V@jt",
						cover: {
							uuid: "fb6d4537-3a71-40b7-9f58-bbbbce7bc62e",
							file: "./files/The Further Adventures of Robinson Crusoe.jpg",
							etag: "09ec9adee6563185397de00defc093d7",
							ext: "jpg",
							type: "image/jpeg"
						}
					}
				],
				fileItems: [
					{
						uuid: "ac91cf62-3013-43b2-ae4b-1829c6aa0c1c",
						fileName: "The Life and Adventures of Robinson Crusoe.epub",
						file: {
							uuid: "97fd0673-d445-4e40-b72c-31698c9d1d8b",
							file: "./files/The Life and Adventures of Robinson Crusoe.epub",
							etag: "b84d13eb0c54c40aa65ec72c696ab211",
							ext: "epub",
							type: "application/epub+zip"
						}
					},
					{
						uuid: "671f2d6c-c6f1-449c-b392-320549794c29",
						fileName: "The Further Adventures of Robinson Crusoe.epub",
						file: {
							uuid: "2cc4f77e-cda8-433d-9367-25cb431e9ea6",
							file: "./files/The Further Adventures of Robinson Crusoe.epub",
							etag: "cc5595953f506c2ccc22a0c67d43b422",
							ext: "epub",
							type: "application/epub+zip"
						}
					}
				]
			}
		]
	},
	testUser: {
		// User id: 2, Dev id: 1, App id: 4 (PocketLib)
		id: 2,
		accessToken: "ckktuuqa100038iw385wrhl78",
		books: [
			{
				uuid: "e4183c7a-12fd-42e9-9bdd-b351cbf6448e",
				storeBook: "b0e4b01d-d53d-47b5-b5e4-48ea7bab6619",
				file: "32adbdaa-0cbe-4672-80a6-19d4b8d6e943"
			}
		]
	},
	klausUser: {
		// User id: 4, Dev id: 1, App id: 4 (PocketLib)
		id: 4,
		accessToken: "ckktuuy2h00048iw3sfsfdv76",
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
			uuid: "8c98e8cb-33a5-460e-8c33-3fa335e11c81",
			key: "fiction",
			names: [
				{
					uuid: "bd426ce4-4176-4e5f-8acd-6ed8bdb5d14a",
					name: "Fiction",
					language: "en"
				},
				{
					uuid: "71f2f75a-77a3-4578-be08-d867a3bbd5a1",
					name: "Fiktion",
					language: "de"
				}
			]
		},
		{
			uuid: "0d29f1a8-e181-448c-81d1-5000b167cb16",
			key: "childrens",
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
			key: "tragedy",
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
		},
		{
			uuid: "27c78f90-934e-41e3-8738-b20f6d76f0a9",
			key: "dystopia",
			names: [
				{
					uuid: "029e6808-e328-4fe2-bddd-3a80606e25aa",
					name: "Dystopia",
					language: "en"
				},
				{
					uuid: "efaa516a-dd29-4fe4-aee1-25eabee3512a",
					name: "Dystopie",
					language: "de"
				}
			]
		},
		{
			uuid: "76dd74fa-0fb3-4d80-8c0a-6d6a803383a7",
			key: "adventure",
			names: [
				{
					uuid: "074de601-477e-4fe5-bdda-cb127a162f1e",
					name: "Adventure",
					language: "en"
				},
				{
					uuid: "81196b7a-8f5c-48a2-8ba0-7279efc3fba4",
					name: "Abenteuer",
					language: "de"
				}
			]
		}
	]
}

constants.collections = [
	{
		name: "latest_books",
		tableId: constants.storeBookTableId,
		tableObjects: [
			"617833c8-4d0a-4d78-acd0-306a90e346ba",
			"2fd1beed-da6f-46c8-8631-a7931dda2ef2",
			"d0ca384f-9d8e-4a56-b2e1-c76a0a5cac4b",
			"d59bdd46-428d-412d-964b-0c57b41df478",
			"b0e4b01d-d53d-47b5-b5e4-48ea7bab6619",
			"ba96f327-f096-4408-8bd0-620f9aad3f09",
			"fc5e9938-1fbf-420e-9d11-7143dd7d42f1",
			"36561f01-0523-4dbe-9bf3-2fb8a208e8f6"
		]
	},
	{
		name: "latest_authors",
		tableId: constants.authorTableId,
		tableObjects: [
			"099fbfa5-a6f1-41c1-99e9-0d02d8364f2d",
			"622ad623-b9a4-415d-92ee-a66f8a7f3c51",
			"1dd980fd-ae20-4566-b842-a25e241bfb46",
			"74667201-3a22-4486-a455-b4b381a9d45a"
		]
	},
	{
		name: "latest_series",
		tableId: constants.storeBookSeriesTableId,
		tableObjects: [
			"0bb3410d-eded-4713-8dff-5295bf7dc5ae",
			"3029ea0f-a6c7-4c0e-be5f-ce6d77ac2296",
			"6f9793de-33e0-4a10-ac4a-fb2b18f28a48"
		]
	}
]

constants.purchases = [
	{
		// testUser purchased 1984 store book in English
		id: 1,
		userId: constants.testUser.id,
		uuid: "303d722a-38b2-4400-ae42-a04c3e27ee30",
		price: 1000,
		currency: "eur",
		completed: true,
		tableObjects: [
			"b0e4b01d-d53d-47b5-b5e4-48ea7bab6619",
			"32adbdaa-0cbe-4672-80a6-19d4b8d6e943"
		]
	},
	{
		// testUser didn't purchase A Series of Unfortunate Events 2 store book in German
		id: 2,
		userId: constants.testUser.id,
		uuid: "5b704e03-60e2-4e5e-b1c0-9032ccc0cae9",
		price: 2000,
		currency: "eur",
		completed: false,
		tableObjects: [
			"617833c8-4d0a-4d78-acd0-306a90e346ba",
			"d6f52b96-6bca-40ee-bb70-fb1347e1c8ba"
		]
	},
	{
		// testUser purchased A Series of Unfortunate Events 4 store book in English
		id: 3,
		userId: constants.testUser.id,
		uuid: "1ac1cbfb-cfe4-4680-b15c-afcb08bfb760",
		price: 3500,
		currency: "eur",
		completed: true,
		tableObjects: [
			"d0ca384f-9d8e-4a56-b2e1-c76a0a5cac4b",
			"4dd8c2cf-82a0-4887-95f1-68284679a026"
		]
	},
	{
		// testUser purchased La Ferme des animaux
		id: 4,
		userId: constants.testUser.id,
		uuid: "7c62fcac-5522-422e-aec1-f03fdf874e9b",
		price: 0,
		currency: "eur",
		completed: true,
		tableObjects: [
			"ba96f327-f096-4408-8bd0-620f9aad3f09",
			"ab3f8f74-b335-4bf2-bc1e-4f85f866ae22"
		]
	},
	{
		// AuthorUser purchased Childrens category
		id: 5,
		userId: constants.authorUser.id,
		uuid: "6f0762ac-7f80-452e-9d6d-38f843fae8ff",
		price: 10,
		currency: "eur",
		completed: true,
		tableObjects: [
			"0d29f1a8-e181-448c-81d1-5000b167cb16"
		]
	},
	{
		// AuthorUser purchased Animal Farm in French
		id: 6,
		userId: constants.authorUser.id,
		uuid: "1fdeca3c-25b1-4ba5-8f6e-15bac25b307c",
		price: 0,
		currency: "eur",
		completed: true,
		tableObjects: [
			"ba96f327-f096-4408-8bd0-620f9aad3f09",
			"ab3f8f74-b335-4bf2-bc1e-4f85f866ae22"
		]
	},
	{
		// Klaus purchased A Series of Unfortunate Events 4 store book in English
		id: 7,
		userId: constants.klausUser.id,
		uuid: "c9294689-a6ba-4549-a47b-de36f44e2810",
		price: 3500,
		currency: "eur",
		completed: true,
		tableObjects: [
			"d0ca384f-9d8e-4a56-b2e1-c76a0a5cac4b",
			"4dd8c2cf-82a0-4887-95f1-68284679a026"
		]
	},
	{
		// Klaus purchased La Ferme des animaux store book in French
		id: 8,
		userId: constants.klausUser.id,
		uuid: "82182b3b-1d3f-44ea-8b7b-9d7f9d7aeb03",
		price: 0,
		currency: "eur",
		completed: true,
		tableObjects: [
			"ba96f327-f096-4408-8bd0-620f9aad3f09",
			"ab3f8f74-b335-4bf2-bc1e-4f85f866ae22"
		]
	}
]

export default constants