import path from 'path'
import url from 'url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
import fs from 'fs'
import {
	TablesController,
	TableObjectsController,
	CollectionsController,
	isSuccessStatusCode
} from 'dav-js'
import constants from './constants.js'

export async function resetDatabase() {
	resetPublishers()
	await resetAuthors()
	await resetAuthorBios()
	await resetAuthorProfileImageItems()
	await resetAuthorProfileImages()
	await resetStoreBookCollections()
	await resetStoreBookCollectionNames()
	await resetStoreBookSeries()
	await resetStoreBooks()
	await resetStoreBookReleases()
	await resetStoreBookCoverItems()
	await resetStoreBookCovers()
	await resetStoreBookFileItems()
	await resetStoreBookFiles()
	await resetBooks()
	await resetCategories()
	await resetCategoryNames()
}

export async function resetPublishers() {
	// Delete Publishers
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.publisherTableId)

	// Reset Publishers
	await resetAuthorUserPublisher()
	await resetDavUserPublishers()
}

export async function resetAuthors() {
	// Delete Authors
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorTableId)

	// Reset Authors
	await resetAuthorUserAuthor()
	await resetDavUserAuthors()
}

export async function resetAuthorBios() {
	// Delete AuthorBios
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorBioTableId)

	// Reset AuthorBios
	await resetAuthorUserAuthorBios()
	await resetDavUserAuthorBios()
}

export async function resetAuthorProfileImageItems() {
	// Delete AuthorProfileImageItems
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorProfileImageItemTableId)

	// Reset AuthorProfileImageItems
	await resetAuthorUserAuthorProfileImageItems()
	await resetDavUserAuthorProfileImageItems()
}

export async function resetAuthorProfileImages() {
	// Delete AuthorProfileImages
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorProfileImageTableId)

	// Reset AuthorProfileImages
	await resetAuthorUserAuthorProfileImages()
	await resetDavUserAuthorProfileImages()
}

export async function resetStoreBookCollections() {
	// Delete StoreBookCollections
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCollectionTableId)

	// Reset StoreBookCollections
	await resetAuthorUserStoreBookCollections()
	await resetDavUserStoreBookCollections()
}

export async function resetStoreBookCollectionNames() {
	// Delete StoreBookCollectionNames
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCollectionNameTableId)

	// Reset StoreBookCollectionNames
	await resetAuthorUserStoreBookCollectionNames()
	await resetDavUserStoreBookCollectionNames()
}

export async function resetStoreBookSeries() {
	// Delete StoreBookSeries
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookSeriesTableId)

	// Reset StoreBookSeries
	await resetAuthorUserStoreBookSeries()
	await resetDavUserStoreBookSeries()

	// Reset the latest_series collection
	await resetCollection("latest_series", constants.storeBookSeriesTableId)
}

export async function resetStoreBooks() {
	// Delete StoreBooks
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookTableId)

	// Reset StoreBooks
	await resetAuthorUserStoreBooks()
	await resetDavUserStoreBooks()
}

export async function resetStoreBookReleases() {
	// Delete StoreBookReleases
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookReleaseTableId)

	// Reset StoreBookReleases
	await resetAuthorUserStoreBookReleases()
	await resetDavUserStoreBookReleases()
}

export async function resetStoreBookCoverItems() {
	// Delete StoreBookCoverItems
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCoverItemTableId)

	// Reset StoreBookCoverItems
	await resetAuthorUserStoreBookCoverItems()
	await resetDavUserStoreBookCoverItems()
}

export async function resetStoreBookCovers() {
	// Delete StoreBookCovers
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCoverTableId)

	// Reset StoreBookCovers
	await resetAuthorUserStoreBookCovers()
	await resetDavUserStoreBookCovers()
}

export async function resetStoreBookFileItems() {
	// Delete StoreBookCoverItems
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookFileItemTableId)

	// Reset StoreBookFileItems
	await resetAuthorUserStoreBookFileItems()
	await resetDavUserStoreBookFileItems()
}

export async function resetStoreBookFiles() {
	// Delete StoreBookFiles
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookFileTableId)

	// Reset StoreBookFiles
	await resetAuthorUserStoreBookFiles()
	await resetDavUserStoreBookFiles()
}

export async function resetBooks() {
	// Delete Books
	await deleteTableObjectsOfTable(constants.authorUser.accessToken, constants.bookTableId)
	await deleteTableObjectsOfTable(constants.davUser.accessToken, constants.bookTableId)

	// Reset books
	await resetKlausUserBooks()
	await resetTestUserBooks()
}

export async function resetCategories() {
	// Reset categories
	await resetDavUserCategories()
}

export async function resetCategoryNames() {
	// Delete CategoryNames
	await resetDavUserCategoryNames()
}

async function resetAuthorUserPublisher() {
	let authors = []
	constants.authorUser.publisher.authors.forEach(author => authors.push(author.uuid))

	let response = await TableObjectsController.UpdateTableObject({
		accessToken: constants.authorUser.accessToken,
		uuid: constants.authorUser.publisher.uuid,
		properties: {
			name: constants.authorUser.publisher.name,
			description: constants.authorUser.publisher.description,
			website_url: constants.authorUser.publisher.websiteUrl ?? "",
			facebook_username: constants.authorUser.publisher.facebookUsername ?? "",
			instagram_username: constants.authorUser.publisher.instagramUsername ?? "",
			twitter_username: constants.authorUser.publisher.twitterUsername ?? "",
			authors: authors.join(','),
			profile_image_item: constants.authorUser.publisher.profileImageItem?.uuid ?? ""
		}
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in resetting the publisher of author user")
		console.log(response.errors)
	}
}

async function resetDavUserPublishers() {
	let testDatabasePublishers = []

	// Reset the publishers of dav user
	for (let publisher of constants.davUser.publishers) {
		testDatabasePublishers.push(publisher.uuid)

		let authors = []
		publisher.authors.forEach(author => authors.push(author.uuid))

		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: publisher.uuid,
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

		if (!isSuccessStatusCode(response.status)) {
			console.log(`Error in resetting the publisher ${publisher.name} of dav user`)
			console.log(response.errors)
		}
	}

	// Get the Publisher table
	let publishers = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.publisherTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the Publisher table")
		console.log(response.errors)
	} else {
		publishers = response.data.tableObjects
	}

	// Delete each publisher that is not part of the test database
	for (let publisher of publishers) {
		if (testDatabasePublishers.includes(publisher.uuid)) continue

		// Delete the publisher
		await deleteTableObject(constants.davUser.accessToken, publisher.uuid)
	}
}

async function resetAuthorUserAuthor() {
	// Reset the author of author user
	let collections = []
	constants.authorUser.author.collections.forEach(collection => collections.push(collection.uuid))

	let series = []
	constants.authorUser.author.series.forEach(s => series.push(s.uuid))

	let bios = []
	constants.authorUser.author.bios.forEach(bio => bios.push(bio.uuid))

	let response = await TableObjectsController.UpdateTableObject({
		accessToken: constants.authorUser.accessToken,
		uuid: constants.authorUser.author.uuid,
		properties: {
			first_name: constants.authorUser.author.firstName,
			last_name: constants.authorUser.author.lastName,
			website_url: constants.authorUser.author.websiteUrl ?? "",
			facebook_username: constants.authorUser.author.facebookUsername ?? "",
			instagram_username: constants.authorUser.author.instagramUsername ?? "",
			twitter_username: constants.authorUser.author.twitterUsername ?? "",
			bios: bios.join(','),
			collections: collections.join(','),
			series: series.join(','),
			profile_image_item: constants.authorUser.author.profileImageItem?.uuid ?? "",
		}
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in resetting the author of author user")
		console.log(response.errors)
	}
}

async function resetDavUserAuthors() {
	let testDatabaseAuthors = []

	// Reset the authors of dav user
	for (let author of constants.davUser.authors) {
		testDatabaseAuthors.push(author.uuid)

		let collections = []
		author.collections.forEach(collection => collections.push(collection.uuid))

		let series = []
		author.series.forEach(s => series.push(s.uuid))

		let bios = []
		author.bios.forEach(bio => bios.push(bio.uuid))

		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: author.uuid,
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
				profile_image_item: author.profileImageItem?.uuid ?? "",
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log(`Error in resetting the author ${author.firstName} ${author.lastName} of dav user`)
			console.log(response.errors)
		}
	}

	// Get the Author table
	let authors = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.authorTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the Author table")
		console.log(response.errors)
	} else {
		authors = response.data.tableObjects
	}

	// Delete each author that is not part of the test database
	for (let author of authors) {
		if (testDatabaseAuthors.includes(author.uuid)) continue

		// Delete the author
		await deleteTableObject(constants.davUser.accessToken, author.uuid)
	}
}

async function resetAuthorUserAuthorBios() {
	let testDatabaseAuthorBios = []

	for (let authorBio of constants.authorUser.author.bios) {
		testDatabaseAuthorBios.push(authorBio.uuid)

		// Reset the author bio
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: authorBio.uuid,
			properties: {
				bio: authorBio.bio,
				language: authorBio.language
			}
		})

		if (response.status != 200) {
			console.log("Error in resetting AuthorBio")
			console.log(response.errors)
		}
	}

	// Get the AuthorBio table
	let authorBios = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.authorBioTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the AuthorBio table")
		console.log(response.errors)
	}

	// Delete each author bio that is not part of the test database
	for (let authorBio of authorBios) {
		if (testDatabaseAuthorBios.includes(authorBio.uuid)) continue

		// Delete the author bio
		await deleteTableObject(constants.authorUser.accessToken, authorBio.uuid)
	}
}

async function resetDavUserAuthorBios() {
	let testDatabaseAuthorBios = []

	for (let author of constants.davUser.authors) {
		for (let authorBio of author.bios) {
			testDatabaseAuthorBios.push(authorBio.uuid)

			// Reset the author bio
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: authorBio.uuid,
				properties: {
					bio: authorBio.bio,
					language: authorBio.language
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in resetting AuthorBio")
				console.log(response.errors)
			}
		}
	}

	// Get the AuthorBio table
	let authorBios = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.authorBioTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the AuthorBio table")
		console.log(response.errors)
	} else {
		authorBios = response.data.tableObjects
	}

	// Delete each author bio that is not part of the test database
	for (let authorBio of authorBios) {
		if (testDatabaseAuthorBios.includes(authorBio.uuid)) continue

		// Delete the author bio
		await deleteTableObject(constants.davUser.accessToken, authorBio.uuid)
	}
}

async function resetAuthorUserAuthorProfileImageItems() {
	// Get the profile image item table
	let profileImageItems = []
	let testDatabaseProfileImageItem = constants.authorUser.author.profileImageItem

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.authorProfileImageItemTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the AuthorProfileImageItem table")
		console.log(response.errors)
	}

	// Reset the profile image item
	response = await TableObjectsController.UpdateTableObject({
		accessToken: constants.authorUser.accessToken,
		uuid: testDatabaseProfileImageItem.uuid,
		properties: {
			blurhash: testDatabaseProfileImageItem.blurhash,
			profile_image: testDatabaseProfileImageItem.profileImage?.uuid ?? ""
		}
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in resetting AuthorProfileImageItem")
		console.log(response.errors)
	}

	// Delete each profile image item that is not part of the test database
	for (let profileImageItem of profileImageItems) {
		if (profileImageItem.uuid != testDatabaseProfileImageItem.uuid) {
			// Delete the profile image item
			await deleteTableObject(constants.authorUser.accessToken, profileImageItem.uuid)
		}
	}
}

async function resetDavUserAuthorProfileImageItems() {
	// Get the profile image item table
	let profileImageItems = []
	let testDatabaseProfileImageItems = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.authorProfileImageItemTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the AuthorProfileImageItem table")
		console.log(response.errors)
	} else {
		profileImageItems = response.data.tableObjects
	}

	// Get all profile image items of the test database
	for (let author of constants.davUser.authors) {
		if (author.profileImageItem) testDatabaseProfileImageItems.push(author.profileImageItem)
	}

	// Reset each profile image item
	for (let profileImageItem of testDatabaseProfileImageItems) {
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: profileImageItem.uuid,
			properties: {
				blurhash: profileImageItem.blurhash,
				profile_image: profileImageItem.profileImage?.uuid ?? ""
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting AuthorProfileImageItem")
			console.log(response.errors)
		}
	}

	// Delete each profile image item that is not part of the test database
	for (let profileImageItem of profileImageItems) {
		if (testDatabaseProfileImageItems.find(pi => pi.uuid == profileImageItem.uuid)) continue

		// Delete the profile image item
		await deleteTableObject(constants.davUser.accessToken, profileImageItem.uuid)
	}
}

async function resetAuthorUserAuthorProfileImages() {
	// Get the profile image table
	let profileImages = []
	let testDatabaseProfileImageItem = constants.authorUser.author.profileImageItem
	let testDatabaseProfileImageUuid = testDatabaseProfileImageItem.profileImage.uuid

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.authorProfileImageTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the AuthorProfileImage table")
		console.log(response.errors)
	} else {
		profileImages = response.data.tableObjects
	}

	// Delete each profile image that is not part of the test database
	for (let profileImage of profileImages) {
		if (profileImage.uuid != testDatabaseProfileImageUuid) {
			// Delete the profile image
			await deleteTableObject(constants.authorUser.accessToken, profileImage.uuid)
		}
	}

	// Update the profile image of the test database if it has changed
	if (profileImages.find(pi => pi.uuid == testDatabaseProfileImageUuid)) {
		// Check if the etag of the file has changed
		let response = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: testDatabaseProfileImageUuid
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in getting AuthorProfileImage")
			console.log(response.errors)
			return
		}

		if (response.data.tableObject.GetPropertyValue("etag") != testDatabaseProfileImageItem.profileImage.etag) {
			// Set the ext
			response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: testDatabaseProfileImageUuid,
				properties: {
					ext: constants.authorUser.author.profileImageItem.profileImage.ext
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in updating AuthorProfileImage")
				console.log(response.errors)
				return
			}

			// Overwrite the file
			let filePath = path.join(__dirname, testDatabaseProfileImageItem.profileImage.file)
			let fileData = fs.readFileSync(filePath)

			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.authorUser.accessToken,
				uuid: testDatabaseProfileImageUuid,
				data: fileData,
				type: constants.authorUser.author.profileImageItem.profileImage.type
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in uploading AuthorProfileImage")
				console.log(response.errors)
			}
		}
	}
}

async function resetDavUserAuthorProfileImages() {
	// Get the profile image table
	let profileImages = []
	let testDatabaseProfileImages = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.authorProfileImageTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the AuthorProfileImage table")
		console.log(response.errors)
	} else {
		profileImages = response.data.tableObjects
	}

	// Get all profile images of the test database
	for (let author of constants.davUser.authors) {
		if (author.profileImageItem?.profileImage) testDatabaseProfileImages.push(author.profileImageItem.profileImage)
	}

	// Delete each profile image that is not part of the test database
	for (let profileImage of profileImages) {
		let i = testDatabaseProfileImages.findIndex(img => img.uuid == profileImage.uuid)

		if (i == -1) {
			// Delete the profile image
			await deleteTableObject(constants.davUser.accessToken, profileImage.uuid)
		}
	}

	// Update each profile image of the test database if it has changed
	for (let profileImage of testDatabaseProfileImages) {
		// Check if the etag of the file has changed
		let response = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: profileImage.uuid
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in getting AuthorProfileImage")
			console.log(response.errors)
			continue
		}

		if (response.data.tableObject.GetPropertyValue("etag") != profileImage.etag) {
			// Set the ext
			response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: profileImage.uuid,
				properties: {
					ext: profileImage.ext
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in updating AuthorProfileImage")
				console.log(response.errors)
				continue
			}

			// Overwrite the file
			let filePath = path.join(__dirname, profileImage.file)
			let fileData = fs.readFileSync(filePath)

			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.davUser.accessToken,
				uuid: profileImage.uuid,
				data: fileData,
				type: profileImage.type
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in uploading AuthorProfileImage")
				console.log(response.errors)
			}
		}
	}
}

async function resetAuthorUserStoreBookCollections() {
	let testDatabaseCollections = []

	for (let collection of constants.authorUser.author.collections) {
		testDatabaseCollections.push(collection.uuid)

		// Reset the collection
		let names = []
		collection.names.forEach(name => names.push(name.uuid))

		let books = []
		collection.books.forEach(book => books.push(book.uuid))

		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: collection.uuid,
			properties: {
				author: constants.authorUser.author.uuid,
				names: names.join(','),
				books: books.join(',')
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookCollection")
			console.log(response.errors)
		}
	}

	// Get the StoreBookCollection table
	let collections = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookCollectionTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCollection table")
		console.log(response.errors)
	} else {
		collections = response.data.tableObjects
	}

	// Delete each collection that is not part of the test database
	for (let collection of collections) {
		if (testDatabaseCollections.includes(collection.uuid)) continue

		// Delete the collection
		await deleteTableObject(constants.authorUser.accessToken, collection.uuid)
	}
}

async function resetDavUserStoreBookCollections() {
	let testDatabaseCollections = []

	for (let author of constants.davUser.authors) {
		for (let collection of author.collections) {
			testDatabaseCollections.push(collection.uuid)

			// Reset the collection
			let names = []
			collection.names.forEach(name => names.push(name.uuid))

			let books = []
			collection.books.forEach(book => books.push(book.uuid))

			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: collection.uuid,
				properties: {
					author: author.uuid,
					names: names.join(','),
					books: books.join(',')
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log(`Error in resetting StoreBookCollection`)
				console.log(response.errors)
			}
		}
	}

	// Get the StoreBookCollection table
	let collections = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookCollectionTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCollection table")
		console.log(response.errors)
	} else {
		collections = response.data.tableObjects
	}

	// Delete each collection that is not part of the test database
	for (let collection of collections) {
		if (testDatabaseCollections.includes(collection.uuid)) continue

		// Delete the collection
		await deleteTableObject(constants.davUser.accessToken, collection.uuid)
	}
}

async function resetAuthorUserStoreBookCollectionNames() {
	let testDatabaseCollectionNames = []

	for (let collection of constants.authorUser.author.collections) {
		for (let collectionName of collection.names) {
			testDatabaseCollectionNames.push(collectionName.uuid)

			// Reset the collection name
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: collectionName.uuid,
				properties: {
					name: collectionName.name,
					language: collectionName.language
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in resetting StoreBookCollectionName")
				console.log(response.errors)
			}
		}
	}

	// Get the StoreBookCollectionName table
	let collectionNames = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookCollectionNameTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCollectionName table")
		console.log(response.errors)
	} else {
		collectionNames = response.data.tableObjects
	}

	// Delete each collection name that is not part of the test database
	for (let collectionName of collectionNames) {
		if (testDatabaseCollectionNames.includes(collectionName.uuid)) continue

		// Delete the collection name
		await deleteTableObject(constants.authorUser.accessToken, collectionName.uuid)
	}
}

async function resetDavUserStoreBookCollectionNames() {
	let testDatabaseCollectionNames = []

	for (let author of constants.davUser.authors) {
		for (let collection of author.collections) {
			for (let collectionName of collection.names) {
				testDatabaseCollectionNames.push(collectionName.uuid)

				// Reset the collection name
				let response = await TableObjectsController.UpdateTableObject({
					accessToken: constants.davUser.accessToken,
					uuid: collectionName.uuid,
					properties: {
						name: collectionName.name,
						language: collectionName.language
					}
				})

				if (!isSuccessStatusCode(response.status)) {
					console.log("Error in resetting StoreBookCollectionName")
					console.log(response.errors)
				}
			}
		}
	}

	// Get the StoreBookCollectionName table
	let collectionNames = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookCollectionNameTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCollectionName table")
		console.log(response.errors)
	} else {
		collectionNames = response.data.tableObjects
	}

	// Delete each collection name that is not part of the test database
	for (let collectionName of collectionNames) {
		if (testDatabaseCollectionNames.includes(collectionName.uuid)) continue

		// Delete the collection name
		await deleteTableObject(constants.davUser.accessToken, collectionName.uuid)
	}
}

async function resetAuthorUserStoreBookSeries() {
	let testDatabaseSeries = []

	for (let series of constants.authorUser.author.series) {
		testDatabaseSeries.push(series.uuid)

		// Reset the series
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: series.uuid,
			properties: {
				author: constants.authorUser.author.uuid,
				name: series.name,
				language: series.language,
				store_books: series.storeBooks.join(',')
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookSeries")
			console.log(response.errors)
		}
	}

	// Get the StoreBookSeries table
	let series = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookSeriesTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookSeries table")
		console.log(response.errors)
	} else {
		series = response.data.tableObjects
	}

	// Delete each series that is not part of the test database
	for (let s of series) {
		if (testDatabaseSeries.includes(s.uuid)) continue

		// Delete the series
		await deleteTableObject(constants.authorUser.accessToken, s.uuid)
	}
}

async function resetDavUserStoreBookSeries() {
	let testDatabaseSeries = []

	for (let author of constants.davUser.authors) {
		for (let series of author.series) {
			testDatabaseSeries.push(series.uuid)

			// Reset the series
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: series.uuid,
				properties: {
					author: author.uuid,
					name: series.name,
					language: series.language,
					store_books: series.storeBooks.join(',')
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log(`Error in resetting StoreBookSeries`)
				console.log(response.errors)
			}
		}
	}

	// Get the StoreBookSeries table
	let series = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookSeriesTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookSeries table")
		console.log(response.errors)
	} else {
		series = response.data.tableObjects
	}

	// Delete each series that is not part of the test database
	for (let s of series) {
		if (testDatabaseSeries.includes(s.uuid)) continue

		// Delete the series
		await deleteTableObject(constants.davUser.accessToken, s.uuid)
	}
}

async function resetAuthorUserStoreBooks() {
	let testDatabaseStoreBooks = []

	for (let collection of constants.authorUser.author.collections) {
		for (let book of collection.books) {
			testDatabaseStoreBooks.push(book.uuid)

			// Reset the store book
			let releases = []
			book.releases.forEach(release => releases.push(release.uuid))

			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: book.uuid,
				properties: {
					collection: collection.uuid,
					language: book.language,
					status: book.status ?? "",
					releases: releases.join(',')
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in resetting StoreBook")
				console.log(response.errors)
			}
		}
	}

	// Get the StoreBook table
	let storeBooks = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBook table")
		console.log(response.errors)
	} else {
		storeBooks = response.data.tableObjects
	}

	// Delete each store book that is not part of the test database
	for (let storeBook of storeBooks) {
		if (testDatabaseStoreBooks.includes(storeBook.uuid)) continue

		// Delete the store book
		await deleteTableObject(constants.authorUser.accessToken, storeBook.uuid)
	}
}

async function resetDavUserStoreBooks() {
	let testDatabaseStoreBooks = []

	for (let author of constants.davUser.authors) {
		for (let collection of author.collections) {
			for (let book of collection.books) {
				testDatabaseStoreBooks.push(book.uuid)

				// Reset the store book
				let releases = []
				book.releases.forEach(release => releases.push(release.uuid))

				let response = await TableObjectsController.UpdateTableObject({
					accessToken: constants.davUser.accessToken,
					uuid: book.uuid,
					properties: {
						collection: collection.uuid,
						language: book.language,
						status: book.status ?? "",
						releases: releases.join(',')
					}
				})

				if (!isSuccessStatusCode(response.status)) {
					console.log("Error in resetting StoreBook")
					console.log(response.errors)
				}
			}
		}
	}

	// Get the StoreBook table
	let storeBooks = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBook table")
		console.log(response.errors)
	} else {
		storeBooks = response.data.tableObjects
	}

	// Delete each store book that is not part of the test database
	for (let storeBook of storeBooks) {
		if (testDatabaseStoreBooks.includes(storeBook.uuid)) continue

		// Delete the store book
		await deleteTableObject(constants.davUser.accessToken, storeBook.uuid)
	}
}

async function resetAuthorUserStoreBookReleases() {
	let testDatabaseStoreBookReleases = []

	for (let collection of constants.authorUser.author.collections) {
		for (let book of collection.books) {
			for (let release of book.releases) {
				testDatabaseStoreBookReleases.push(release.uuid)

				// Reset the store book release
				let response = await TableObjectsController.UpdateTableObject({
					accessToken: constants.authorUser.accessToken,
					uuid: release.uuid,
					properties: {
						store_book: book.uuid,
						release_name: release.releaseName ?? "",
						release_notes: release.releaseNotes ?? "",
						published_at: release.publishedAt ?? "",
						title: release.title ?? "",
						description: release.description ?? "",
						price: release.price ?? "",
						isbn: release.isbn ?? "",
						status: release.status ?? "",
						cover_item: release.coverItem ?? "",
						file_item: release.fileItem ?? "",
						categories: release.categories?.join(',') ?? ""
					}
				})

				if (!isSuccessStatusCode(response.status)) {
					console.log("Error in resetting StoreBookRelease")
					console.log(response.errors)
				}
			}
		}
	}

	// Get the store book release table
	let storeBookReleases = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookReleaseTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookRelease table")
		console.log(response.errors)
	} else {
		storeBookReleases = response.data.tableObjects
	}

	// Delete each store book release that is not part of the test database
	for (let storeBookRelease of storeBookReleases) {
		if (testDatabaseStoreBookReleases.includes(storeBookRelease.uuid)) continue

		// Delete the store book release
		await deleteTableObject(constants.authorUser.accessToken, storeBookRelease.uuid)
	}
}

async function resetDavUserStoreBookReleases() {
	let testDatabaseStoreBookReleases = []

	for (let author of constants.davUser.authors) {
		for (let collection of author.collections) {
			for (let book of collection.books) {
				for (let release of book.releases) {
					testDatabaseStoreBookReleases.push(release.uuid)

					// Reset the store book release
					let response = await TableObjectsController.UpdateTableObject({
						accessToken: constants.davUser.accessToken,
						uuid: release.uuid,
						properties: {
							store_book: book.uuid,
							release_name: release.releaseName ?? "",
							release_notes: release.releaseNotes ?? "",
							published_at: release.publishedAt ?? "",
							title: release.title ?? "",
							description: release.description ?? "",
							price: release.price ?? "",
							isbn: release.isbn ?? "",
							status: release.status ?? "",
							cover_item: release.coverItem ?? "",
							file_item: release.fileItem ?? "",
							categories: release.categories?.join(',') ?? ""
						}
					})

					if (!isSuccessStatusCode(response.status)) {
						console.log("Error in resetting StoreBookRelease")
						console.log(response.errors)
					}
				}
			}
		}
	}

	// Get the store book release table
	let storeBookReleases = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookReleaseTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookRelease table")
		console.log(response.errors)
	} else {
		storeBookReleases = response.data.tableObjects
	}

	// Delete each store book release that is not part of the test database
	for (let storeBookRelease of storeBookReleases) {
		if (testDatabaseStoreBookReleases.includes(storeBookRelease.uuid)) continue

		// Delete the store book release
		await deleteTableObject(constants.davUser.accessToken, storeBookRelease.uuid)
	}
}

async function resetAuthorUserStoreBookCoverItems() {
	let testDatabaseStoreBookCoverItems = []

	for (let coverItem of constants.authorUser.author.coverItems) {
		testDatabaseStoreBookCoverItems.push(coverItem)

		// Reset the cover item
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: coverItem.uuid,
			properties: {
				aspect_ratio: coverItem.aspectRatio,
				blurhash: coverItem.blurhash,
				cover: coverItem.cover.uuid
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookCoverItem")
		}
	}

	// Get the StoreBookCoverItem table
	let coverItems = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookCoverItemTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCoverItem table")
		console.log(response.errors)
	} else {
		coverItems = response.data.tableObjects
	}

	// Reset each store book cover item
	for (let coverItem of testDatabaseStoreBookCoverItems) {
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: coverItem.uuid,
			properties: {
				aspect_ratio: coverItem.aspectRatio,
				blurhash: coverItem.blurhash,
				cover: coverItem.cover?.uuid ?? ""
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookCoverItem")
			console.log(response.errors)
		}
	}

	// Delete each cover item that is not part of the test database
	for (let coverItem of coverItems) {
		if (testDatabaseStoreBookCoverItems.find(ci => ci.uuid == coverItem.uuid)) continue

		// Delete the cover item
		await deleteTableObject(constants.authorUser.accessToken, coverItem.uuid)
	}
}

async function resetDavUserStoreBookCoverItems() {
	let testDatabaseStoreBookCoverItems = []

	for (let author of constants.davUser.authors) {
		for (let coverItem of author.coverItems) {
			testDatabaseStoreBookCoverItems.push(coverItem)

			// Reset the cover item
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: coverItem.uuid,
				properties: {
					aspect_ratio: coverItem.aspectRatio,
					blurhash: coverItem.blurhash,
					cover: coverItem.cover.uuid
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in resetting StoreBookCoverItem")
			}
		}
	}

	// Get the StoreBookCoverItem table
	let coverItems = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookCoverItemTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCoverItem table")
		console.log(response.errors)
	} else {
		coverItems = response.data.tableObjects
	}

	// Reset each store book cover item
	for (let coverItem of testDatabaseStoreBookCoverItems) {
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: coverItem.uuid,
			properties: {
				aspect_ratio: coverItem.aspectRatio,
				blurhash: coverItem.blurhash,
				cover: coverItem.cover?.uuid ?? ""
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookCoverItem")
			console.log(response.errors)
		}
	}

	// Delete each cover item that is not part of the test database
	for (let coverItem of coverItems) {
		if (testDatabaseStoreBookCoverItems.find(ci => ci.uuid == coverItem.uuid)) continue

		// Delete the cover item
		await deleteTableObject(constants.davUser.accessToken, coverItem.uuid)
	}
}

async function resetAuthorUserStoreBookCovers() {
	// Get the cover table
	let covers = []
	let testDatabaseCovers = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookCoverTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCover table")
		console.log(response.errors)
	} else {
		covers = response.data.tableObjects
	}

	// Get all covers of the test database
	for (let coverItem of constants.authorUser.author.coverItems) {
		if (coverItem.cover != null) testDatabaseCovers.push(coverItem.cover)
	}

	// Delete each cover that is not part of the test database
	for (let cover of covers) {
		let i = testDatabaseCovers.findIndex(c => c.uuid == cover.uuid)

		if (i == -1) {
			// Delete the cover
			await deleteTableObject(constants.authorUser.accessToken, cover.uuid)
		}
	}

	// Update each cover of the test database if it has changed
	for (let cover of testDatabaseCovers) {
		// Check if the etag of the file has changed
		let response = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: cover.uuid
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in getting StoreBookCover")
			console.log(response.errors)
			continue
		}

		if (response.data.tableObject.GetPropertyValue("etag") != cover.etag) {
			// Set the ext
			response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: cover.uuid,
				properties: {
					ext: cover.ext,
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in updating StoreBookCover")
				console.log(response.errors)
				continue
			}

			// Overwrite the file
			let filePath = path.join(__dirname, cover.file)
			let fileData = fs.readFileSync(filePath)

			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.authorUser.accessToken,
				uuid: cover.uuid,
				data: fileData,
				type: cover.type
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in uploading StoreBookCover")
				console.log(response.errors)
			}
		}
	}
}

async function resetDavUserStoreBookCovers() {
	// Get the cover table
	let covers = []
	let testDatabaseCovers = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookCoverTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookCover table")
		console.log(response.errors)
	} else {
		covers = response.data.tableObjects
	}

	// Get all covers of the test database
	for (let author of constants.davUser.authors) {
		for (let coverItem of author.coverItems) {
			if (coverItem.cover != null) testDatabaseCovers.push(coverItem.cover)
		}
	}

	// Delete each cover that is not part of the test database
	for (let cover of covers) {
		let i = testDatabaseCovers.findIndex(c => c.uuid == cover.uuid)

		if (i == -1) {
			// Delete the cover
			await deleteTableObject(constants.davUser.accessToken, cover.uuid)
		}
	}

	// Update each cover of the test database if it has changed
	for (let cover of testDatabaseCovers) {
		// Check if the etag of the file has changed
		let response = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: cover.uuid
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in getting StoreBookCover")
			console.log(response.errors)
			continue
		}

		if (response.data.tableObject.GetPropertyValue("etag") != cover.etag) {
			// Set the ext
			response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: cover.uuid,
				properties: {
					ext: cover.ext
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in updating StoreBookCover")
				console.log(response.errors)
				continue
			}

			// Overwrite the file
			let filePath = path.join(__dirname, cover.file)
			let fileData = fs.readFileSync(filePath)

			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.davUser.accessToken,
				uuid: cover.uuid,
				data: fileData,
				type: cover.type
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in uploading StoreBookCover")
				console.log(response.errors)
			}
		}
	}
}

async function resetAuthorUserStoreBookFileItems() {
	let testDatabaseStoreBookFileItems = []

	for (let fileItem of constants.authorUser.author.fileItems) {
		testDatabaseStoreBookFileItems.push(fileItem)

		// Reset the file item
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: fileItem.uuid,
			properties: {
				file_name: fileItem.fileName,
				file: fileItem.file.uuid
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookFileItem")
		}
	}

	// Get the StoreBookFileItem table
	let fileItems = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookFileItemTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookFileItem table")
		console.log(response.errors)
	} else {
		fileItems = response.data.tableObjects
	}

	// Reset each store book file item
	for (let fileItem of testDatabaseStoreBookFileItems) {
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: fileItem.uuid,
			properties: {
				file_name: fileItem.fileName,
				file: fileItem.file?.uuid ?? ""
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookFileItem")
			console.log(response.errors)
		}
	}

	// Delete each file item that is not part of the test database
	for (let fileItem of fileItems) {
		if (testDatabaseStoreBookFileItems.find(fi => fi.uuid == fileItem.uuid)) continue

		// Delete the file item
		await deleteTableObject(constants.authorUser.accessToken, fileItem.uuid)
	}
}

async function resetDavUserStoreBookFileItems() {
	let testDatabaseStoreBookFileItems = []

	for (let author of constants.davUser.authors) {
		for (let fileItem of author.fileItems) {
			testDatabaseStoreBookFileItems.push(fileItem)

			// Reset the file item
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: fileItem.uuid,
				properties: {
					file_name: fileItem.fileName,
					file: fileItem.file.uuid
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in resetting StoreBookFileItem")
			}
		}
	}

	// Get the StoreBookFileItem table
	let fileItems = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookFileItemTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookFileItem table")
		console.log(response.errors)
	} else {
		fileItems = response.data.tableObjects
	}

	// Reset each store book file item
	for (let fileItem of testDatabaseStoreBookFileItems) {
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: fileItem.uuid,
			properties: {
				file_name: fileItem.fileName,
				file: fileItem.file?.uuid ?? ""
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting StoreBookFileItem")
			console.log(response.errors)
		}
	}

	// Delete each file item that is not part of the test database
	for (let fileItem of fileItems) {
		if (testDatabaseStoreBookFileItems.find(fi => fi.uuid == fileItem.uuid)) continue

		// Delete the file item
		await deleteTableObject(constants.davUser.accessToken, fileItem.uuid)
	}
}

async function resetAuthorUserStoreBookFiles() {
	// Get the file table
	let files = []
	let testDatabaseFiles = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookFileTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookFile table")
		console.log(response.errors)
	} else {
		files = response.data.tableObjects
	}

	// Get all files of the test database
	for (let fileItem of constants.authorUser.author.fileItems) {
		if (fileItem.file != null) testDatabaseFiles.push(fileItem.file)
	}

	// Delete each file that is not part of the test database
	for (let file of files) {
		let i = testDatabaseFiles.findIndex(f => f.uuid == file.uuid)

		if (i == -1) {
			// Delete the file
			await deleteTableObject(constants.authorUser.accessToken, file.uuid)
		}
	}

	// Update each file of the test database if it has changed
	for (let file of testDatabaseFiles) {
		// Check if the etag of the file has changed
		let response = await TableObjectsController.GetTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: file.uuid
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in getting StoreBookFile")
			console.log(response.errors)
			continue
		}

		if (response.data.tableObject.GetPropertyValue("etag") != file.etag) {
			// Set the ext
			response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: file.uuid,
				properties: {
					ext: file.ext
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in updating StoreBookFile")
				console.log(response.errors)
				continue
			}

			// Overwrite the file
			let filePath = path.join(__dirname, file.file)
			let fileData = fs.readFileSync(filePath)

			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.authorUser.accessToken,
				uuid: file.uuid,
				data: fileData,
				type: file.type
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in uploading StoreBookFile")
				console.log(response.errors)
			}
		}
	}
}

async function resetDavUserStoreBookFiles() {
	// Get the file table
	let files = []
	let testDatabaseFiles = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookFileTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the StoreBookFile table")
		console.log(response.errors)
	} else {
		files = response.data.tableObjects
	}

	// Get all files of the test database
	for (let author of constants.davUser.authors) {
		for (let fileItem of author.fileItems) {
			if (fileItem.file != null) testDatabaseFiles.push(fileItem.file)
		}
	}

	// Delete each cover that is not part of the test database
	for (let file of files) {
		let i = testDatabaseFiles.findIndex(f => f.uuid == file.uuid)

		if (i == -1) {
			// Delete the file
			await deleteTableObject(constants.davUser.accessToken, file.uuid)
		}
	}

	// Update each file of the test database if it has changed
	for (let file of testDatabaseFiles) {
		// Check if the etag of the file has changed
		let response = await TableObjectsController.GetTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: file.uuid
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in getting StoreBookFile")
			console.log(response.errors)
			continue
		}

		if (response.data.tableObject.GetPropertyValue("etag") != file.etag) {
			// Set the ext
			response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: file.uuid,
				properties: {
					ext: file.ext
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in updating StoreBookFile")
				console.log(response.errors)
				continue
			}

			// Overwrite the file
			let filePath = path.join(__dirname, file.file)
			let fileData = fs.readFileSync(filePath)

			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.davUser.accessToken,
				uuid: file.uuid,
				data: fileData,
				type: file.type
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in uploading StoreBookFile")
				console.log(response.errors)
			}
		}
	}
}

async function resetKlausUserBooks() {
	// Get the book table
	let books = []
	let testDatabaseBooks = []

	let response = await TablesController.GetTable({
		accessToken: constants.klausUser.accessToken,
		id: constants.bookTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the Book table")
		console.log(response.errors)
	} else {
		books = response.data.tableObjects
	}

	// Get all books of the test database
	for (let book of constants.klausUser.books) {
		testDatabaseBooks.push(book)
	}

	// Delete each book that is not part of the test database
	for (let book of books) {
		let i = testDatabaseBooks.findIndex(b => b.uuid == book.uuid)

		if (i != -1) {
			testDatabaseBooks.splice(i, 1)
		} else {
			// Delete the book
			await deleteTableObject(constants.klausUser.accessToken, book.uuid)
		}
	}

	// Create each missing book of the test database
	for (let book of testDatabaseBooks) {
		let properties = {
			store_book: book.storeBook,
			file: book.file
		}

		if (book.purchase) {
			properties["purchase"] = book.purchase.toString()
		}

		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.klausUser.accessToken,
			uuid: book.uuid,
			tableId: constants.bookTableId,
			properties
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in creating Book")
			console.log(response.errors)
		}
	}
}

async function resetTestUserBooks() {
	// Get the book table
	let books = []
	let testDatabaseBooks = []

	let response = await TablesController.GetTable({
		accessToken: constants.testUser.accessToken,
		id: constants.bookTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the Book table")
		console.log(response.errors)
	} else {
		books = response.data.tableObjects
	}

	// Get all books of the test database
	for (let book of constants.testUser.books) {
		testDatabaseBooks.push(book)
	}

	// Delete each book that is not part of the test database
	for (let book of books) {
		let i = testDatabaseBooks.findIndex(b => b.uuid == book.uuid)

		if (i != -1) {
			testDatabaseBooks.splice(i, 1)
		} else {
			// Delete the book
			await deleteTableObject(constants.testUser.accessToken, book.uuid)
		}
	}

	// Create each missing book of the test database
	for (let book of testDatabaseBooks) {
		let properties = {
			store_book: book.storeBook,
			file: book.file
		}

		if (book.purchase) {
			properties["purchase"] = book.purchase.toString()
		}

		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.testUser.accessToken,
			uuid: book.uuid,
			tableId: constants.bookTableId,
			properties
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in creating Book")
			console.log(response.errors)
		}
	}
}

async function resetDavUserCategories() {
	let testDatabaseCategories = []

	for (let category of constants.categories) {
		testDatabaseCategories.push(category)

		// Reset the category
		let names = []
		category.names.forEach(name => names.push(name.uuid))

		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: category.uuid,
			properties: {
				key: category.key,
				names: names.join(',')
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in resetting Category")
			console.log(response.errors)
		}
	}

	// Get the Category table
	let categories = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.categoryTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting Category table")
		console.log(response.errors)
	} else {
		categories = response.data.tableObjects
	}

	// Delete each category that is not part of the test database
	for (let category of categories) {
		let i = testDatabaseCategories.findIndex(c => c.uuid == category.uuid)

		if (i != -1) {
			testDatabaseCategories.splice(i, 1)
		} else {
			// Delete the collection
			await deleteTableObject(constants.davUser.accessToken, category.uuid)
		}
	}

	// Create each missing category of the test database
	for (let category of testDatabaseCategories) {
		// Get the category names
		let names = []
		for (let name of category.names) names.push(name.uuid)

		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: category.uuid,
			tableId: constants.categoryTableId,
			properties: {
				key: category.key,
				names: names.join(',')
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in creating Category")
			console.log(response.errors)
		}
	}
}

async function resetDavUserCategoryNames() {
	let testDatabaseCategoryNames = []

	for (let category of constants.categories) {
		for (let categoryName of category.names) {
			testDatabaseCategoryNames.push(categoryName)

			// Reset the category name
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: categoryName.uuid,
				properties: {
					name: categoryName.name,
					language: categoryName.language
				}
			})

			if (!isSuccessStatusCode(response.status)) {
				console.log("Error in resetting CategoryName")
				console.log(response.errors)
			}
		}
	}

	// Get the CategoryName table
	let categoryNames = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.categoryNameTableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in getting the CategoryName table")
		console.log(response.errors)
	} else {
		categoryNames = response.data.tableObjects
	}

	// Delete each category name that is not part of the test database
	for (let categoryName of categoryNames) {
		let i = testDatabaseCategoryNames.findIndex(name => name.uuid == categoryName.uuid)

		if (i != -1) {
			testDatabaseCategoryNames.splice(i, 1)
		} else {
			// Delete the category name
			await deleteTableObject(constants.davUser.accessToken, categoryName.uuid)
		}
	}

	// Create each missing category name that is not part of the test database
	for (let categoryName of testDatabaseCategoryNames) {
		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: categoryName.uuid,
			tableId: constants.categoryNameTableId,
			properties: {
				name: categoryName.name,
				language: categoryName.language
			}
		})

		if (!isSuccessStatusCode(response.status)) {
			console.log("Error in creating CategoryName")
			console.log(response.errors)
		}
	}
}

async function deleteTableObjectsOfTable(accessToken, tableId) {
	// Get the table
	let objects = []

	let response = await TablesController.GetTable({
		accessToken,
		id: tableId
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log(`Error in getting the table with the id ${tableId}`)
		console.log(response.errors)
	} else {
		objects = response.data.tableObjects
	}

	// Delete each object
	for (let obj of objects) {
		await deleteTableObject(accessToken, obj.uuid)
	}
}

async function deleteTableObject(accessToken, uuid) {
	let response = await TableObjectsController.DeleteTableObject({
		accessToken,
		uuid
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log("Error in deleting TableObject")
		console.log(response.errors)
	}
}

async function resetCollection(name, tableId) {
	let collection = constants.collections.find(c => c.name == "latest_series")

	if (collection == null) {
		console.log(`Error in resetting the ${name} collection`)
		return
	}

	let response = await CollectionsController.SetTableObjectsOfCollection({
		auth: constants.davDev,
		name,
		tableId,
		tableObjects: collection.tableObjects
	})

	if (!isSuccessStatusCode(response.status)) {
		console.log(`Error in resetting the ${name} collection`)
		console.log(response.errors)
	}
}

export function findCoverItem(uuid) {
	let coverItem = constants.authorUser.author.coverItems.find(ci => ci.uuid == uuid)
	if (coverItem) return coverItem

	for (let author of constants.davUser.authors) {
		coverItem = author.coverItems.find(ci => ci.uuid == uuid)
		if (coverItem) return coverItem
	}

	return null
}

export function findFileItem(uuid) {
	let fileItem = constants.authorUser.author.fileItems.find(fi => fi.uuid == uuid)
	if (fileItem) return fileItem

	for (let author of constants.davUser.authors) {
		fileItem = author.fileItems.find(fi => fi.uuid == uuid)
		if (fileItem) return fileItem
	}

	return null
}

export function findLastPublishedRelease(releases) {
	let releasesCopy = []

	for (let release of releases) {
		releasesCopy.push(release)
	}

	while (releasesCopy.length > 0) {
		let release = releasesCopy.pop()

		if (release.status == "published") {
			return release
		}
	}

	return null
}