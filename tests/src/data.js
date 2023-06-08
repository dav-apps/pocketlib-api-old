import constants from "./constants.js"

var tableObjects = []

//#region Publishers, PublisherLogos
addPublisherToTableObjects(
	constants.authorUser.publisher,
	constants.authorUser.id
)
addPublisherLogoToTableObjects(
	constants.authorUser.publisher.logo,
	constants.authorUser.id
)

for (let publisher of constants.davUser.publishers) {
	addPublisherToTableObjects(publisher, constants.davUser.id)

	if (publisher.logo) {
		addPublisherLogoToTableObjects(publisher.logo, constants.davUser.id)
	}
}
//#endregion

//#region Authors, AuthorBios, AuthorProfileImages
addAuthorToTableObjects(constants.authorUser.author, constants.authorUser.id)

for (let authorBio of constants.authorUser.author.bios) {
	addAuthorBioToTableObjects(authorBio, constants.authorUser.id)
}

addAuthorProfileImageToTableObjects(
	constants.authorUser.author.profileImage,
	constants.authorUser.id
)

for (let author of constants.davUser.authors) {
	addAuthorToTableObjects(author, constants.davUser.id)

	for (let authorBio of author.bios) {
		addAuthorBioToTableObjects(authorBio, constants.davUser.id)
	}

	if (author.profileImage) {
		addAuthorProfileImageToTableObjects(
			author.profileImage,
			constants.davUser.id
		)
	}
}

for (let author of constants.authorUser.publisher.authors) {
	addAuthorToTableObjects(
		author,
		constants.authorUser.id,
		constants.authorUser.publisher.uuid
	)

	for (let authorBio of author.bios) {
		addAuthorBioToTableObjects(authorBio, constants.authorUser.id)
	}

	if (author.profileImage) {
		addAuthorProfileImageToTableObjects(
			author.profileImage,
			constants.authorUser.id
		)
	}
}

for (let publisher of constants.davUser.publishers) {
	for (let author of publisher.authors) {
		addAuthorToTableObjects(author, constants.davUser.id, publisher.uuid)

		for (let authorBio of author.bios) {
			addAuthorBioToTableObjects(authorBio, constants.davUser.id)
		}

		if (author.profileImage) {
			addAuthorProfileImageToTableObjects(
				author.profileImage,
				constants.davUser.id
			)
		}
	}
}
//#endregion

//#region StoreBookCollections, StoreBooks, StoreBookReleases
for (let collection of constants.authorUser.author.collections) {
	addStoreBookCollectionToTableObjects(
		collection,
		constants.authorUser.id,
		constants.authorUser.author.uuid
	)

	for (let collectionName of collection.names) {
		addStoreBookCollectionNameToTableObjects(
			collectionName,
			constants.authorUser.id
		)
	}

	for (let storeBook of collection.books) {
		addStoreBookToTableObjects(
			storeBook,
			constants.authorUser.id,
			collection.uuid
		)

		for (let storeBookRelease of storeBook.releases) {
			addStoreBookReleaseToTableObjects(
				storeBookRelease,
				constants.authorUser.id,
				storeBook.uuid
			)
		}
	}
}

for (let author of constants.davUser.authors) {
	for (let collection of author.collections) {
		addStoreBookCollectionToTableObjects(
			collection,
			constants.davUser.id,
			author.uuid
		)

		for (let collectionName of collection.names) {
			addStoreBookCollectionNameToTableObjects(
				collectionName,
				constants.davUser.id
			)
		}

		for (let storeBook of collection.books) {
			addStoreBookToTableObjects(
				storeBook,
				constants.davUser.id,
				collection.uuid
			)

			for (let storeBookRelease of storeBook.releases) {
				addStoreBookReleaseToTableObjects(
					storeBookRelease,
					constants.davUser.id,
					storeBook.uuid
				)
			}
		}
	}
}
//#endregion

//#region StoreBookCovers
for (let cover of constants.authorUser.author.covers) {
	addStoreBookCoverToTableObjects(cover, constants.authorUser.id)
}

for (let author of constants.davUser.authors) {
	for (let cover of author.covers) {
		addStoreBookCoverToTableObjects(cover, constants.davUser.id)
	}
}
//#endregion

//#region StoreBookFiles
for (let file of constants.authorUser.author.files) {
	addStoreBookFileToTableObjects(file, constants.authorUser.id)
}

for (let author of constants.davUser.authors) {
	for (let file of author.files) {
		addStoreBookFileToTableObjects(file, constants.davUser.id)
	}
}
//#endregion

//#region StoreBookSeries
for (let series of constants.authorUser.author.series) {
	addStoreBookSeriesToTableObjects(
		series,
		constants.authorUser.id,
		constants.authorUser.author.uuid
	)
}

for (let author of constants.davUser.authors) {
	for (let series of author.series) {
		addStoreBookSeriesToTableObjects(
			series,
			constants.davUser.id,
			author.uuid
		)
	}
}
//#endregion

//#region Books
for (let book of constants.testUser.books) {
	addBookToTableObjects(book, constants.testUser.id)
}

for (let book of constants.klausUser.books) {
	addBookToTableObjects(book, constants.klausUser.id)
}
//#endregion

//#region Categories & CategoryNames
for (let category of constants.categories) {
	addCategoryToTableObjects(category, constants.davUser.id)

	for (let categoryName of category.names) {
		addCategoryNameToTableObjects(categoryName, constants.davUser.id)
	}
}
//#endregion

export default {
	tableObjects,
	collections: constants.collections,
	purchases: constants.purchases
}

function addPublisherToTableObjects(publisher, userId) {
	let authors = []
	publisher.authors.forEach(author => authors.push(author.uuid))

	tableObjects.push({
		uuid: publisher.uuid,
		userId,
		tableId: constants.publisherTableId,
		file: false,
		properties: {
			name: publisher.name,
			description: publisher.description,
			website_url: publisher.websiteUrl ?? "",
			facebook_username: publisher.facebookUsername ?? "",
			instagram_username: publisher.instagramUsername ?? "",
			twitter_username: publisher.twitterUsername ?? "",
			authors: authors.join(","),
			logo: publisher.logo?.uuid ?? ""
		}
	})
}

function addPublisherLogoToTableObjects(publisherLogo, userId) {
	tableObjects.push({
		uuid: publisherLogo.uuid,
		userId,
		tableId: constants.publisherLogoTableId,
		file: true,
		properties: {
			ext: publisherLogo.ext,
			type: publisherLogo.type,
			blurhash: publisherLogo.blurhash ?? ""
		}
	})
}

function addAuthorToTableObjects(author, userId, publisherUuid) {
	let bios = []
	author.bios.forEach(bio => bios.push(bio.uuid))

	let collections = []
	author.collections.forEach(collection => collections.push(collection.uuid))

	let series = []
	author.series.forEach(s => series.push(s.uuid))

	tableObjects.push({
		uuid: author.uuid,
		userId,
		tableId: constants.authorTableId,
		file: false,
		properties: {
			publisher: publisherUuid ?? "",
			first_name: author.firstName,
			last_name: author.lastName,
			website_url: author.websiteUrl ?? "",
			facebook_username: author.facebookUsername ?? "",
			instagram_username: author.instagramUsername ?? "",
			twitter_username: author.twitterUsername ?? "",
			bios: bios.join(","),
			collections: collections.join(","),
			series: series.join(","),
			profile_image: author.profileImage?.uuid ?? ""
		}
	})
}

function addAuthorBioToTableObjects(authorBio, userId) {
	tableObjects.push({
		uuid: authorBio.uuid,
		userId,
		tableId: constants.authorBioTableId,
		file: false,
		properties: {
			bio: authorBio.bio,
			language: authorBio.language
		}
	})
}

function addAuthorProfileImageToTableObjects(authorProfileImage, userId) {
	tableObjects.push({
		uuid: authorProfileImage.uuid,
		userId,
		tableId: constants.authorProfileImageTableId,
		file: true,
		properties: {
			ext: authorProfileImage.ext,
			type: authorProfileImage.type,
			blurhash: authorProfileImage.blurhash ?? ""
		}
	})
}

function addStoreBookCollectionToTableObjects(
	storeBookCollection,
	userId,
	authorUuid
) {
	let names = []
	storeBookCollection.names.forEach(name => names.push(name.uuid))

	let books = []
	storeBookCollection.books.forEach(book => books.push(book.uuid))

	tableObjects.push({
		uuid: storeBookCollection.uuid,
		userId,
		tableId: constants.storeBookCollectionTableId,
		file: false,
		properties: {
			author: authorUuid,
			names: names.join(","),
			books: books.join(",")
		}
	})
}

function addStoreBookCollectionNameToTableObjects(
	storeBookCollectionName,
	userId
) {
	tableObjects.push({
		uuid: storeBookCollectionName.uuid,
		userId,
		tableId: constants.storeBookCollectionNameTableId,
		file: false,
		properties: {
			name: storeBookCollectionName.name,
			language: storeBookCollectionName.language
		}
	})
}

function addStoreBookSeriesToTableObjects(storeBookSeries, userId, authorUuid) {
	tableObjects.push({
		uuid: storeBookSeries.uuid,
		userId,
		tableId: constants.storeBookSeriesTableId,
		file: false,
		properties: {
			author: authorUuid,
			name: storeBookSeries.name,
			language: storeBookSeries.language,
			store_books: storeBookSeries.storeBooks.join(",")
		}
	})
}

function addStoreBookToTableObjects(storeBook, userId, collectionUuid) {
	let releases = []
	storeBook.releases.forEach(release => releases.push(release.uuid))
	let lastRelease = storeBook.releases[storeBook.releases.length - 1]

	let tableObject = {
		uuid: storeBook.uuid,
		userId,
		tableId: constants.storeBookTableId,
		file: false,
		properties: {
			collection: collectionUuid,
			language: storeBook.language,
			status: storeBook.status ?? "",
			releases: releases.join(",")
		}
	}

	if (lastRelease.price != null) {
		tableObject.price = {
			price: lastRelease.price,
			currency: "eur"
		}
	} else if (
		storeBook.status == "published" &&
		lastRelease.status == "published"
	) {
		tableObject.price = {
			price: 0,
			currency: "eur"
		}
	}

	tableObjects.push(tableObject)
}

function addStoreBookReleaseToTableObjects(
	storeBookRelease,
	userId,
	storeBookUuid
) {
	let tableObject = {
		uuid: storeBookRelease.uuid,
		userId,
		tableId: constants.storeBookReleaseTableId,
		file: false,
		properties: {
			store_book: storeBookUuid,
			release_name: storeBookRelease.releaseName ?? "",
			release_notes: storeBookRelease.releaseNotes ?? "",
			published_at: storeBookRelease.publishedAt ?? "",
			title: storeBookRelease.title ?? "",
			description: storeBookRelease.description ?? "",
			price: storeBookRelease.price?.toString() ?? "",
			isbn: storeBookRelease.isbn ?? "",
			status: storeBookRelease.status ?? "",
			cover: storeBookRelease.cover ?? "",
			file: storeBookRelease.file ?? "",
			categories: storeBookRelease.categories?.join(",") ?? ""
		}
	}

	tableObjects.push(tableObject)
}

function addStoreBookCoverToTableObjects(storeBookCover, userId) {
	tableObjects.push({
		uuid: storeBookCover.uuid,
		userId,
		tableId: constants.storeBookCoverTableId,
		file: true,
		properties: {
			etag: storeBookCover.etag,
			ext: storeBookCover.ext,
			type: storeBookCover.type,
			aspect_ratio: storeBookCover.aspectRatio ?? "",
			blurhash: storeBookCover.blurhash ?? ""
		}
	})
}

function addStoreBookFileToTableObjects(storeBookFile, userId) {
	tableObjects.push({
		uuid: storeBookFile.uuid,
		userId,
		tableId: constants.storeBookFileTableId,
		file: true,
		properties: {
			etag: storeBookFile.etag,
			ext: storeBookFile.ext,
			type: storeBookFile.type,
			file_name: storeBookFile.fileName ?? ""
		}
	})
}

function addBookToTableObjects(book, userId) {
	let properties = {
		store_book: book.storeBook,
		file: book.file
	}

	tableObjects.push({
		uuid: book.uuid,
		userId,
		tableId: constants.bookTableId,
		file: false,
		properties
	})
}

function addCategoryToTableObjects(category, userId) {
	let names = []
	category.names.forEach(name => names.push(name.uuid))

	tableObjects.push({
		uuid: category.uuid,
		userId,
		tableId: constants.categoryTableId,
		file: false,
		properties: {
			key: category.key,
			names: names.join(",")
		}
	})
}

function addCategoryNameToTableObjects(categoryName, userId) {
	tableObjects.push({
		uuid: categoryName.uuid,
		userId,
		tableId: constants.categoryNameTableId,
		file: false,
		properties: {
			name: categoryName.name,
			language: categoryName.language
		}
	})
}
