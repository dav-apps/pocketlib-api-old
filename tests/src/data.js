import constants from './constants.js'

var tableObjects = []

//#region Authors & AuthorBios & AuthorProfileImages
addAuthorToTableObjects(constants.authorUser.author, constants.authorUser.id)

for (let authorBio of constants.authorUser.author.bios) {
	addAuthorBioToTableObjects(authorBio, constants.authorUser.id)
}

addAuthorProfileImageToTableObjects(constants.authorUser.author.profileImage, constants.authorUser.id)

for (let author of constants.davUser.authors) {
	addAuthorToTableObjects(author, constants.davUser.id)

	for (let authorBio of author.bios) {
		addAuthorBioToTableObjects(authorBio, constants.davUser.id)
	}

	if (author.profileImage) {
		addAuthorProfileImageToTableObjects(author.profileImage, constants.davUser.id)
	}
}
//#endregion

//#region StoreBookCollections
for (let collection of constants.authorUser.author.collections) {
	addStoreBookCollectionToTableObjects(collection, constants.authorUser.id, constants.authorUser.author.uuid)

	for (let collectionName of collection.names) {
		addStoreBookCollectionNameToTableObjects(collectionName, constants.authorUser.id)
	}

	for (let storeBook of collection.books) {
		addStoreBookToTableObjects(storeBook, constants.authorUser.id, collection.uuid)

		for (let storeBookRelease of storeBook.releases) {
			addStoreBookReleaseToTableObjects(storeBookRelease, constants.authorUser.id, storeBook.uuid)

			if (storeBookRelease.coverItem) {
				let coverItem = storeBookRelease.coverItem
				addStoreBookCoverItemToTableObjects(coverItem, constants.authorUser.id)

				if (coverItem.cover) {
					addStoreBookCoverToTableObjects(coverItem.cover, constants.authorUser.id)
				}
			}

			if (storeBookRelease.fileItem) {
				let fileItem = storeBookRelease.fileItem
				addStoreBookFileItemToTableObjects(fileItem, constants.authorUser.id)

				if (fileItem.file) {
					addStoreBookFileToTableObjects(fileItem.file, constants.authorUser.id)
				}
			}
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

				if (storeBookRelease.coverItem) {
					let coverItem = storeBookRelease.coverItem
					addStoreBookCoverItemToTableObjects(coverItem, constants.davUser.id)

					if (coverItem.cover) {
						addStoreBookCoverToTableObjects(coverItem.cover, constants.davUser.id)
					}
				}

				if (storeBookRelease.fileItem) {
					let fileItem = storeBookRelease.fileItem
					addStoreBookFileItemToTableObjects(fileItem, constants.davUser.id)

					if (fileItem.file) {
						addStoreBookFileToTableObjects(fileItem.file, constants.davUser.id)
					}
				}
			}
		}
	}
}
//#endregion

//#region StoreBookSeries
for (let series of constants.authorUser.author.series) {
	addStoreBookSeriesToTableObjects(series, constants.authorUser.id, constants.authorUser.author.uuid)

	for (let seriesName of series.names) {
		addStoreBookSeriesNameToTableObject(seriesName, constants.authorUser.id)
	}
}

for (let author of constants.davUser.authors) {
	for (let series of author.series) {
		addStoreBookSeriesToTableObjects(series, constants.davUser.id, author.uuid)

		for (let seriesName of series.names) {
			addStoreBookSeriesNameToTableObject(seriesName, constants.davUser.id)
		}
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
			profile_image: author.profileImage?.uuid ?? "",
			profile_image_blurhash: author.profileImageBlurhash ?? ""
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
	let names = []
	storeBookSeries.names.forEach(name => names.push(name.uuid))

	tableObjects.push({
		uuid: storeBookSeries.uuid,
		userId,
		tableId: constants.storeBookSeriesTableId,
		file: false,
		properties: {
			author: authorUuid,
			names: names.join(','),
			collections: storeBookSeries.collections.join(',')
		}
	})
}

function addStoreBookSeriesNameToTableObject(storeBookSeriesName, userId) {
	tableObjects.push({
		uuid: storeBookSeriesName.uuid,
		userId,
		tableId: constants.storeBookSeriesNameTableId,
		file: false,
		properties: {
			name: storeBookSeriesName.name,
			language: storeBookSeriesName.language
		}
	})
}

function addStoreBookToTableObjects(storeBook, userId, collectionUuid) {
	let releases = []
	storeBook.releases.forEach(release => releases.push(release.uuid))

	let tableObject = {
		uuid: storeBook.uuid,
		userId,
		tableId: constants.storeBookTableId,
		file: false,
		properties: {
			collection: collectionUuid,
			language: storeBook.language,
			price: storeBook.price ? storeBook.price.toString() : "",
			isbn: storeBook.isbn ? storeBook.isbn : "",
			status: storeBook.status ? storeBook.status : "",
			releases: releases.join(',')
		}
	}

	if (storeBook.price != null) {
		tableObject.price = {
			price: storeBook.price,
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
			title: storeBookRelease.title,
			description: storeBookRelease.description,
			cover_item: storeBookRelease.coverItem ? storeBookRelease.coverItem.uuid : "",
			file_item: storeBookRelease.fileItem ? storeBookRelease.fileItem.uuid : "",
			categories: storeBookRelease.categories ? storeBookRelease.categories.join(',') : ""
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
			aspect_ratio: storeBookCoverItem.aspectRatio ? storeBookCoverItem.aspectRatio : "",
			blurhash: storeBookCoverItem.blurhash ? storeBookCoverItem.blurhash : "",
			cover: storeBookCoverItem.cover ? storeBookCoverItem.cover.uuid : ""
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
			file_name: storeBookFileItem.fileName ? storeBookFileItem.fileName : "",
			file: storeBookFileItem.file ? storeBookFileItem.file.uuid : ""
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