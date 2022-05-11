import constants from './constants.js'

var tableObjects = []

//#region Publishers, PublisherProfileImageItems, PublisherProfileImages
addPublisherToTableObjects(constants.authorUser.publisher, constants.authorUser.id)

let profileImageItem = constants.authorUser.publisher.profileImageItem
addPublisherProfileImageItemToTableObjects(profileImageItem, constants.authorUser.id)
addPublisherProfileImageToTableObjects(profileImageItem.profileImage, constants.authorUser.id)

for (let publisher of constants.davUser.publishers) {
	addPublisherToTableObjects(publisher, constants.davUser.id)

	if (publisher.profileImageItem) {
		let profileImageItem = publisher.profileImageItem
		addPublisherProfileImageItemToTableObjects(profileImageItem, constants.davUser.id)

		if (profileImageItem.profileImage) {
			addPublisherProfileImageToTableObjects(profileImageItem.profileImage, constants.davUser.id)
		}
	}
}
//#endregion

//#region Authors, AuthorBios, AuthorProfileImageItems, AuthorProfileImages
addAuthorToTableObjects(constants.authorUser.author, constants.authorUser.id)

for (let authorBio of constants.authorUser.author.bios) {
	addAuthorBioToTableObjects(authorBio, constants.authorUser.id)
}

profileImageItem = constants.authorUser.author.profileImageItem
addAuthorProfileImageItemToTableObjects(profileImageItem, constants.authorUser.id)
addAuthorProfileImageToTableObjects(profileImageItem.profileImage, constants.authorUser.id)

for (let author of constants.davUser.authors) {
	addAuthorToTableObjects(author, constants.davUser.id)

	for (let authorBio of author.bios) {
		addAuthorBioToTableObjects(authorBio, constants.davUser.id)
	}

	if (author.profileImageItem) {
		let profileImageItem = author.profileImageItem
		addAuthorProfileImageItemToTableObjects(profileImageItem, constants.davUser.id)

		if (profileImageItem.profileImage) {
			addAuthorProfileImageToTableObjects(profileImageItem.profileImage, constants.davUser.id)
		}
	}
}

for (let publisher of constants.davUser.publishers) {
	for (let author of publisher.authors) {
		addAuthorToTableObjects(author, constants.davUser.id)

		for (let authorBio of author.bios) {
			addAuthorBioToTableObjects(authorBio, constants.davUser.id)
		}

		if (author.profileImageItem) {
			let profileImageItem = author.profileImageItem
			addAuthorProfileImageItemToTableObjects(profileImageItem, constants.davUser.id)

			if (profileImageItem.profileImage) {
				addAuthorProfileImageToTableObjects(profileImageItem.profileImage, constants.davUser.id)
			}
		}
	}
}
//#endregion

//#region StoreBookCollections, StoreBooks, StoreBookReleases
for (let collection of constants.authorUser.author.collections) {
	addStoreBookCollectionToTableObjects(collection, constants.authorUser.id, constants.authorUser.author.uuid)

	for (let collectionName of collection.names) {
		addStoreBookCollectionNameToTableObjects(collectionName, constants.authorUser.id)
	}

	for (let storeBook of collection.books) {
		addStoreBookToTableObjects(storeBook, constants.authorUser.id, collection.uuid)

		for (let storeBookRelease of storeBook.releases) {
			addStoreBookReleaseToTableObjects(storeBookRelease, constants.authorUser.id, storeBook.uuid)
		}
	}
}

for (let author of constants.davUser.authors) {
	for (let collection of author.collections) {
		addStoreBookCollectionToTableObjects(collection, constants.davUser.id, author.uuid)

		for (let collectionName of collection.names) {
			addStoreBookCollectionNameToTableObjects(collectionName, constants.davUser.id)
		}

		for (let storeBook of collection.books) {
			addStoreBookToTableObjects(storeBook, constants.davUser.id, collection.uuid)

			for (let storeBookRelease of storeBook.releases) {
				addStoreBookReleaseToTableObjects(storeBookRelease, constants.davUser.id, storeBook.uuid)
			}
		}
	}
}
//#endregion

//#region StoreBookCoverItems, StoreBookCovers
for (let coverItem of constants.authorUser.author.coverItems) {
	addStoreBookCoverItemToTableObjects(coverItem, constants.authorUser.id)

	if (coverItem.cover) {
		addStoreBookCoverToTableObjects(coverItem.cover, constants.authorUser.id)
	}
}

for (let author of constants.davUser.authors) {
	for (let coverItem of author.coverItems) {
		addStoreBookCoverItemToTableObjects(coverItem, constants.davUser.id)

		if (coverItem.cover) {
			addStoreBookCoverToTableObjects(coverItem.cover, constants.davUser.id)
		}
	}
}
//#endregion

//#region StoreBookFileItems, StoreBookFiles
for (let fileItem of constants.authorUser.author.fileItems) {
	addStoreBookFileItemToTableObjects(fileItem, constants.authorUser.id)

	if (fileItem.file) {
		addStoreBookFileToTableObjects(fileItem.file, constants.authorUser.id)
	}
}

for (let author of constants.davUser.authors) {
	for (let fileItem of author.fileItems) {
		addStoreBookFileItemToTableObjects(fileItem, constants.davUser.id)

		if (fileItem.file) {
			addStoreBookFileToTableObjects(fileItem.file, constants.davUser.id)
		}
	}
}
//#endregion

//#region StoreBookSeries
for (let series of constants.authorUser.author.series) {
	addStoreBookSeriesToTableObjects(series, constants.authorUser.id, constants.authorUser.author.uuid)
}

for (let author of constants.davUser.authors) {
	for (let series of author.series) {
		addStoreBookSeriesToTableObjects(series, constants.davUser.id, author.uuid)
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
			authors: authors.join(','),
			profile_image_item: publisher.profileImageItem?.uuid ?? ""
		}
	})
}

function addPublisherProfileImageItemToTableObjects(publisherProfileImageItem, userId) {
	tableObjects.push({
		uuid: publisherProfileImageItem.uuid,
		userId,
		tableId: constants.publisherProfileImageItemTableId,
		file: false,
		properties: {
			blurhash: publisherProfileImageItem.blurhash ?? "",
			profile_image: publisherProfileImageItem.profileImage?.uuid ?? ""
		}
	})
}

function addPublisherProfileImageToTableObjects(publisherProfileImage, userId) {
	tableObjects.push({
		uuid: publisherProfileImage.uuid,
		userId,
		tableId: constants.publisherProfileImageTableId,
		file: true,
		properties: {
			ext: publisherProfileImage.ext,
			type: publisherProfileImage.type
		}
	})
}

function addAuthorToTableObjects(author, userId) {
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
			first_name: author.firstName,
			last_name: author.lastName,
			website_url: author.websiteUrl ?? "",
			facebook_username: author.facebookUsername ?? "",
			instagram_username: author.instagramUsername ?? "",
			twitter_username: author.twitterUsername ?? "",
			bios: bios.join(','),
			collections: collections.join(','),
			series: series.join(','),
			profile_image_item: author.profileImageItem?.uuid ?? ""
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

function addAuthorProfileImageItemToTableObjects(authorProfileImageItem, userId) {
	tableObjects.push({
		uuid: authorProfileImageItem.uuid,
		userId,
		tableId: constants.authorProfileImageItemTableId,
		file: false,
		properties: {
			blurhash: authorProfileImageItem.blurhash ?? "",
			profile_image: authorProfileImageItem.profileImage?.uuid ?? ""
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
			type: authorProfileImage.type
		}
	})
}

function addStoreBookCollectionToTableObjects(storeBookCollection, userId, authorUuid) {
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
			names: names.join(','),
			books: books.join(',')
		}
	})
}

function addStoreBookCollectionNameToTableObjects(storeBookCollectionName, userId) {
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
			store_books: storeBookSeries.storeBooks.join(',')
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
			releases: releases.join(',')
		}
	}

	if (lastRelease.price != null) {
		tableObject.price = {
			price: lastRelease.price,
			currency: "eur"
		}
	} else if (
		storeBook.status == "published"
		&& lastRelease.status == "published"
	) {
		tableObject.price = {
			price: 0,
			currency: "eur"
		}
	}

	tableObjects.push(tableObject)
}

function addStoreBookReleaseToTableObjects(storeBookRelease, userId, storeBookUuid) {
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
			cover_item: storeBookRelease.coverItem ?? "",
			file_item: storeBookRelease.fileItem ?? "",
			categories: storeBookRelease.categories?.join(',') ?? ""
		}
	}

	tableObjects.push(tableObject)
}

function addStoreBookCoverItemToTableObjects(storeBookCoverItem, userId) {
	tableObjects.push({
		uuid: storeBookCoverItem.uuid,
		userId,
		tableId: constants.storeBookCoverItemTableId,
		file: false,
		properties: {
			aspect_ratio: storeBookCoverItem.aspectRatio ?? "",
			blurhash: storeBookCoverItem.blurhash ?? "",
			cover: storeBookCoverItem.cover?.uuid ?? ""
		}
	})
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
			type: storeBookCover.type
		}
	})
}

function addStoreBookFileItemToTableObjects(storeBookFileItem, userId) {
	tableObjects.push({
		uuid: storeBookFileItem.uuid,
		userId,
		tableId: constants.storeBookFileItemTableId,
		file: false,
		properties: {
			file_name: storeBookFileItem.fileName ?? "",
			file: storeBookFileItem.file?.uuid ?? ""
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
			type: storeBookFile.type
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
			names: names.join(',')
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