import constants from './constants.js'

var tableObjects = []

// Authors & AuthorBios & AuthorProfileImages
addAuthorToTableObjects(constants.authorUser.author, constants.authorUser.id)
for (let authorBio of constants.authorUser.author.bios) addAuthorBioToTableObjects(authorBio, constants.authorUser.id)
addAuthorProfileImageToTableObjects(constants.authorUser.author.profileImage, constants.authorUser.id)

for (let author of constants.davUser.authors) {
	addAuthorToTableObjects(author, constants.davUser.id)
	for (let authorBio of author.bios) addAuthorBioToTableObjects(authorBio, constants.davUser.id)
	if (author.profileImage) addAuthorProfileImageToTableObjects(author.profileImage, constants.davUser.id)
}

// StoreBookCollections
for (let collection of constants.authorUser.author.collections) {
	addStoreBookCollectionToTableObjects(collection, constants.authorUser.id, constants.authorUser.author.uuid)
	for (let collectionName of collection.names) addStoreBookCollectionNameToTableObjects(collectionName, constants.authorUser.id)
	for (let storeBook of collection.books) {
		addStoreBookToTableObjects(storeBook, constants.authorUser.id, collection.uuid)
		if (storeBook.cover) addStoreBookCoverToTableObjects(storeBook.cover, constants.authorUser.id)
		if (storeBook.file) addStoreBookFileToTableObjects(storeBook.file, constants.authorUser.id)
	}
}

for (let author of constants.davUser.authors) {
	for (let collection of author.collections) {
		addStoreBookCollectionToTableObjects(collection, constants.davUser.id, author.uuid)
		for (let collectionName of collection.names) addStoreBookCollectionNameToTableObjects(collectionName, constants.davUser.id)
		for (let storeBook of collection.books) {
			addStoreBookToTableObjects(storeBook, constants.davUser.id, collection.uuid)
			if (storeBook.cover) addStoreBookCoverToTableObjects(storeBook.cover, constants.davUser.id)
			if (storeBook.file) addStoreBookFileToTableObjects(storeBook.file, constants.davUser.id)
		}
	}
}

// Books
for (let book of constants.testUser.books) {
	addBookToTableObjects(book, constants.testUser.id)
}

for (let book of constants.klausUser.books) {
	addBookToTableObjects(book, constants.klausUser.id)
}

// Categories & CategoryNames
for (let category of constants.categories) {
	addCategoryToTableObjects(category, constants.davUser.id)

	for (let categoryName of category.names) {
		addCategoryNameToTableObjects(categoryName, constants.davUser.id)
	}
}

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

function addStoreBookToTableObjects(storeBook, userId, collectionUuid) {
	let tableObject = {
		uuid: storeBook.uuid,
		userId,
		tableId: constants.storeBookTableId,
		file: false,
		properties: {
			collection: collectionUuid,
			title: storeBook.title,
			description: storeBook.description,
			language: storeBook.language,
			price: storeBook.price ? storeBook.price.toString() : "",
			isbn: storeBook.isbn ? storeBook.isbn : "",
			status: storeBook.status ? storeBook.status : "",
			cover: storeBook.cover ? storeBook.cover.uuid : "",
			cover_aspect_ratio: storeBook.coverAspectRatio ? storeBook.coverAspectRatio : "",
			cover_blurhash: storeBook.coverBlurhash ? storeBook.coverBlurhash : "",
			file: storeBook.file ? storeBook.file.uuid : "",
			file_name: storeBook.fileName ? storeBook.fileName : "",
			categories: storeBook.categories ? storeBook.categories.join(',') : ""
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

	if (book.purchase) properties.purchase = book.purchase

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