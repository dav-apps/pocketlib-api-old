module.exports = {
	apiBaseUrl: "http://localhost:3111/v1",
	pocketlibAppId: 6,
	authorTableId: 19,
	storeBookTableId: 20,
	storeBookCoverTableId: 21,
	davClassLibraryTestUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdmNsYXNzbGlicmFyeXRlc3RAZGF2LWFwcHMudGVjaCIsInVzZXJfaWQiOjUsImRldl9pZCI6MiwiZXhwIjozNzU2MTA1MDAyMn0.jZpdLre_ZMWGN2VNbZOn2Xg51RLAT6ocGnyM38jljHI.1",
	davUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhdkBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6MSwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.6LvizKcYttmWGLwGFS4A2nhSu6aOs8O9_pa2StxTQqE.3",
	authorUserJWT: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImF1dGhvckBkYXYtYXBwcy50ZWNoIiwidXNlcl9pZCI6NiwiZGV2X2lkIjoxLCJleHAiOjM3NTYxMDE3NjAwfQ.npXRbu87twmlyqBSPuGb1qOn7Mh1ug_j0qEQiLz3N6U.2",
	authorUserAuthor: {
		uuid: "099fbfa5-a6f1-41c1-99e9-0d02d8364f2d",
		firstName: "Lemony",
		lastName: "Snicket",
		bio: "Dear reader, I'm sorry to tell you that I wrote some very unpleasant tales that you definitely should not read, if you want to further live a healthy life.",
		books: [
			{
				uuid: "1cf6fc5f-8fa5-4972-895d-8b1d6552d41c",
				title: "A Series of Unfortunate Events - Book the First",
				description: "Dear Reader, I'm sorry to say that the book you are holding in your hands is extremely unpleasant. It tells an unhappy tale about three very unlucky children.",
				language: "en"
			},
			{
				uuid: "5242102c-b107-4e82-8eb8-bebe2a990436",
				title: "A Series of Unfortunate Events - Book the Second",
				description: "Dear Reader, if you have picked up this book with the hope of finding a simple and cheery tale, I'm afraid you have picked up the wrong book altogether.",
				language: "de",
				cover: "bb63e1c9-866c-47b5-b852-e8473df404f3"
			}
		],
		covers: [{
			uuid: "bb63e1c9-866c-47b5-b852-e8473df404f3"
		}]
	}
}