import constants from './constants.js'
import {
	TablesController,
	TableObjectsController,
} from 'dav-js'

export async function resetDatabase() {
	await resetAuthors()
	await resetAuthorBios()
	await resetAuthorProfileImages()
	await resetStoreBookCollections()
	await resetStoreBookCollectionNames()
	await resetStoreBookSeries()
	await resetStoreBookSeriesNames()
	await resetStoreBooks()
	await resetStoreBookCovers()
	await resetStoreBookFiles()
	await resetBooks()
	await resetCategories()
	await resetCategoryNames()
}

export async function resetAuthors() {
	// Delete Authors
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorTableId)

	// Reset the Authors of users with authors
	await resetAuthorUserAuthor()
	await resetDavUserAuthors()
}

export async function resetAuthorBios() {
	// Delete AuthorBios
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorBioTableId)

	// Reset the AuthorBios of users with authors
	await resetAuthorUserAuthorBios()
	await resetDavUserAuthorBios()
}

export async function resetAuthorProfileImages() {
	// Delete AuthorProfileImages
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.authorProfileImageTableId)

	// Reset the AuthorProfileImages of users with authors
	await resetAuthorUserAuthorProfileImages()
	await resetDavUserAuthorProfileImages()
}

export async function resetStoreBookCollections() {
	// Delete StoreBookCollections
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCollectionTableId)

	// Reset the StoreBookCollections of the author users
	await resetAuthorUserStoreBookCollections()
	await resetDavUserStoreBookCollections()
}

export async function resetStoreBookCollectionNames() {
	// Delete StoreBookCollectionNames
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCollectionNameTableId)

	// Reset the StoreBookCollectionNames of the author users
	await resetAuthorUserStoreBookCollectionNames()
	await resetDavUserStoreBookCollectionNames()
}

export async function resetStoreBookSeries() {
	// Delete StoreBookSeries
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookSeriesTableId)

	// Reset StoreBookSeries
	await resetAuthorUserStoreBookSeries()
	await resetDavUserStoreBookSeries()
}

export async function resetStoreBookSeriesNames() {
	// Delete StoreBookSeriesNames
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookSeriesNameTableId)

	// Reset StoreBookSeriesNames
	await resetAuthorUserStoreBookSeriesNames()
	await resetDavUserStoreBookSeriesNames()
}

export async function resetStoreBooks() {
	// Delete StoreBooks
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookTableId)

	// Reset StoreBooks
	await resetAuthorUserStoreBooks()
	await resetDavUserStoreBooks()
}

export async function resetStoreBookCovers() {
	// Delete StoreBookCovers
	await deleteTableObjectsOfTable(constants.testUser.accessToken, constants.storeBookCoverTableId)

	// Reset StoreBookCovers
	await resetAuthorUserStoreBookCovers()
	await resetDavUserStoreBookCovers()
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
			profile_image: constants.authorUser.author.profileImage?.uuid ?? "",
			profile_image_blurhash: constants.authorUser.author.profileImageBlurhash ?? ""
		}
	})

	if (response.status != 200) {
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
				profile_image: author.profileImage?.uuid ?? "",
				profile_image_blurhash: author.profileImageBlurhash ?? ""
			}
		})

		if (response.status != 200) {
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

	if (response.status != 200) {
		console.log("Error in getting the author table")
		console.log(response.errors)
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
			console.log("Error in resetting an author bio")
			console.log(response.errors)
		}
	}

	// Get the AuthorBio table
	let authorBios = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.authorBioTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the author bio table")
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

			if (response.status != 200) {
				console.log("Error in resetting an author bio")
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

	if (response.status != 200) {
		console.log("Error in getting the author bio table")
		console.log(response.errors)
	}

	// Delete each author bio that is not part of the test database
	for (let authorBio of authorBios) {
		if (testDatabaseAuthorBios.includes(authorBio.uuid)) continue

		// Delete the author bio
		await deleteTableObject(constants.davUser.accessToken, authorBio.uuid)
	}
}

async function resetAuthorUserAuthorProfileImages() {
	// Get the profile image table
	let profileImages = []
	let testDatabaseProfileImageUuid = constants.authorUser.author.profileImage.uuid

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.authorProfileImageTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the author profile image table")
		console.log(response.errors)
	}

	// Delete each profile image that is not part of the test database
	for (let profileImage of profileImages) {
		if (profileImage.uuid != testDatabaseProfileImageUuid) {
			// Delete the profile image
			await deleteTableObject(constants.authorUser.accessToken, profileImage.uuid)
		}
	}

	// Create the profile image of the test database if it does not exist
	if (profileImages.includes(testDatabaseProfileImageUuid)) {
		// Set the ext
		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: testDatabaseProfileImageUuid,
			properties: {
				ext: constants.authorUser.author.profileImage.ext
			}
		})

		if (response.status != 200) {
			console.log("Error in creating profile image")
			console.log(response.errors)
		}

		// Overwrite the file
		response = await TableObjectsController.SetTableObjectFile({
			accessToken: constants.authorUser.accessToken,
			uuid: testDatabaseProfileImageUuid,
			file: new Blob(["Hello World"], { type: constants.authorUser.author.profileImage.type })
		})

		if (response.status != 200) {
			console.log("Error in creating profile image")
			console.log(response.errors)
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

	if (response.status != 200) {
		console.log("Error in getting the author profile image table")
		console.log(response.errors)
	} else {
		profileImages = response.data.tableObjects
	}

	// Get all profile images of the test database
	for (let author of constants.davUser.authors) {
		if (author.profileImage) testDatabaseProfileImages.push(author.profileImage)
	}

	// Delete each profile image that is not part of the test database
	for (let profileImage of profileImages) {
		let i = testDatabaseProfileImages.findIndex(img => img.uuid == profileImage.uuid)

		if (i != -1) {
			testDatabaseProfileImages.splice(i, 1)
		} else {
			// Delete the profile image
			await deleteTableObject(constants.davUser.accessToken, profileImage.uuid)
		}
	}

	// Create each missing profile image of the test database
	for (let profileImage of testDatabaseProfileImages) {
		// Create the table object
		response = await TableObjectsController.CreateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: profileImage.uuid,
			tableId: constants.authorProfileImageTableId,
			properties: {
				ext: profileImage.ext
			}
		})

		if (response != 201) {
			console.log(`Error in creating profile image: ${profileImage.uuid}`)
			console.log(response.errors)
		} else {
			// Upload the file
			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.davUser.accessToken,
				uuid: profileImage.uuid,
				file: new Blob(["Hello World"], { type: profileImage.type })
			})

			if (response.status != 200) {
				console.log(`Error in creating profile image: ${profileImage.uuid}`)
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

		if (response.status != 200) {
			console.log("Error in resetting a store book collection")
			console.log(response.errors)
		}
	}

	// Get the StoreBookCollection table
	let collections = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookCollectionTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the store book collection table")
		console.log(response.errors)
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

			if (response.status != 200) {
				console.log(`Error in resetting a store book collection of the author ${author.firstName} ${author.lastName}`)
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

	if (response.status != 200) {
		console.log("Error in getting the store book collection table")
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

			if (response.status != 200) {
				console.log("Error in resetting a store book collection name")
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

	if (response.status != 200) {
		console.log("Error in getting the store book collection name table")
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

				if (response.status != 200) {
					console.log("Error in resetting a store book collection name")
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

	if (response.status != 200) {
		console.log("Error in getting the store book collection name table")
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
		let names = []
		series.names.forEach(name => names.push(name.uuid))

		let response = await TableObjectsController.UpdateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: series.uuid,
			properties: {
				author: constants.authorUser.author.uuid,
				names: names.join(','),
				collections: series.collections.join(',')
			}
		})

		if (response.status != 200) {
			console.log("Error in resetting a store book series")
			console.log(response.errors)
		}
	}

	// Get the StoreBookSeries table
	let series = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookSeriesTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the store book series table")
		console.log(response.errors)
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
			let names = []
			series.names.forEach(name => names.push(name.uuid))

			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.davUser.accessToken,
				uuid: series.uuid,
				properties: {
					author: author.uuid,
					names: names.join(','),
					collections: series.collections.join(',')
				}
			})

			if (response.status != 200) {
				console.log(`Error in resetting a store book series of the author ${author.firstName} ${author.lastName}`)
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

	if (response.status != 200) {
		console.log("Error in getting the store book series table")
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

async function resetAuthorUserStoreBookSeriesNames() {
	let testDatabaseSeriesNames = []

	for (let series of constants.authorUser.author.series) {
		for (let seriesName of series.names) {
			testDatabaseSeriesNames.push(seriesName.uuid)

			// Reset the series name
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: seriesName.uuid,
				properties: {
					name: seriesName.name,
					language: seriesName.language
				}
			})

			if (response.status != 200) {
				console.log("Error in resetting a store book series name")
				console.log(response.errors)
			}
		}
	}

	// Get the StoreBookSeriesName table
	let seriesNames = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookSeriesNameTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the store book series name table")
		console.log(response.errors)
	} else {
		seriesNames = response.data.tableObjects
	}

	// Delete each series name that is not part of the test database
	for (let seriesName of seriesNames) {
		if (testDatabaseSeriesNames.includes(seriesName.uuid)) continue

		// Delete the series name
		await deleteTableObject(constants.authorUser.accessToken, seriesName.uuid)
	}
}

async function resetDavUserStoreBookSeriesNames() {
	let testDatabaseSeriesNames = []

	for (let author of constants.davUser.authors) {
		for (let series of author.series) {
			for (let seriesName of series.names) {
				testDatabaseSeriesNames.push(seriesName.uuid)

				// Reset the series name
				let response = await TableObjectsController.UpdateTableObject({
					accessToken: constants.davUser.accessToken,
					uuid: seriesName.uuid,
					properties: {
						name: seriesName.name,
						language: seriesName.language
					}
				})

				if (response.status != 200) {
					console.log("Error in resetting a store book series name")
					console.log(response.errors)
				}
			}
		}
	}

	// Get the StoreBookSeriesName table
	let seriesNames = []

	let response = await TablesController.GetTable({
		accessToken: constants.davUser.accessToken,
		id: constants.storeBookSeriesNameTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the store book series name table")
		console.log(response.errors)
	} else {
		seriesNames = response.data.tableObjects
	}

	// Delete each series name that is not part of the test database
	for (let seriesName of seriesNames) {
		if (testDatabaseSeriesNames.includes(seriesName.uuid)) continue

		// Delete the series name
		await deleteTableObject(constants.davUser.accessToken, seriesName.uuid)
	}
}

async function resetAuthorUserStoreBooks() {
	let testDatabaseStoreBooks = []

	for (let collection of constants.authorUser.author.collections) {
		for (let book of collection.books) {
			testDatabaseStoreBooks.push(book.uuid)

			// Reset the store book
			let response = await TableObjectsController.UpdateTableObject({
				accessToken: constants.authorUser.accessToken,
				uuid: book.uuid,
				properties: {
					collection: collection.uuid,
					title: book.title,
					description: book.description,
					language: book.language,
					price: book.price?.toString() ?? "",
					isbn: book.isbn ?? "",
					status: book.status,
					cover: book.cover?.uuid ?? "",
					cover_aspect_ratio: book.coverAspectRatio ?? "",
					cover_blurhash: book.coverBlurhash ?? "",
					file: book.file?.uuid ?? "",
					file_name: book.fileName ?? "",
					categories: book.categories ? book.categories.join(',') : ""
				}
			})

			if (response.status != 200) {
				console.log("Error in resetting a store book")
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

	if (response.status != 200) {
		console.log("Error in getting the store book table")
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
				let response = await TableObjectsController.UpdateTableObject({
					accessToken: constants.davUser.accessToken,
					uuid: book.uuid,
					properties: {
						collection: collection.uuid,
						title: book.title,
						description: book.description,
						language: book.language,
						price: book.price?.toString() ?? "",
						isbn: book.isbn ?? "",
						status: book.status ?? "",
						cover_aspect_ratio: book.coverAspectRatio ?? "",
						cover_blurhash: book.coverBlurhash ?? "",
						cover: book.cover?.uuid ?? "",
						file: book.file?.uuid ?? "",
						categories: book.categories?.join(',') ?? ""
					}
				})

				if (response.status != 200) {
					console.log("Error in resetting a store book")
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

	if (response.status != 200) {
		console.log("Error in getting the store book table")
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

async function resetAuthorUserStoreBookCovers() {
	// Get the cover table
	let covers = []
	let testDatabaseCovers = []

	let response = await TablesController.GetTable({
		accessToken: constants.authorUser.accessToken,
		id: constants.storeBookCoverTableId
	})

	if (response.status != 200) {
		console.log("Error in getting the store book cover table")
		console.log(response.errors)
	} else {
		covers = response.data.tableObjects
	}

	// Get all covers of the test database
	for (let collection of constants.authorUser.author.collections) {
		for (let book of collection.books) {
			if (book.cover) testDatabaseCovers.push(book.cover)
		}
	}

	// Delete each cover that is not part of the test database
	for (let cover of covers) {
		let i = testDatabaseCovers.findIndex(c => c.uuid == cover.uuid)

		if (i != -1) {
			testDatabaseCovers.splice(i, 1)
		} else {
			// Delete the cover
			await deleteTableObject(constants.authorUser.accessToken, cover.uuid)
		}
	}

	// Create each missing cover of the test database
	for (let cover of testDatabaseCovers) {
		// Create the table object
		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: cover.uuid,
			tableId: constants.storeBookCoverTableId,
			file: true,
			properties: {
				ext: cover.ext
			}
		})

		if (response.status != 201) {
			console.log("Error in creating cover")
			console.log(response.errors)
		} else {
			// Upload the file
			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.authorUser.accessToken,
				uuid: cover.uuid,
				file: new Blob(["Hello World"], { type: cover.type })
			})

			if (response.status != 200) {
				console.log("Error in creating cover")
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

	if (response.status != 200) {
		console.log("Error in getting the store book cover table")
		console.log(response.errors)
	} else {
		covers = response.data.tableObjects
	}

	// Get all covers of the test database
	for (let author of constants.davUser.authors) {
		for (let collection of author.collections) {
			for (let book of collection.books) {
				if (book.cover) testDatabaseCovers.push(book.cover)
			}
		}
	}

	// Delete each cover that is not part of the test database
	for (let cover of covers) {
		let i = testDatabaseCovers.findIndex(c => c.uuid == cover.uuid)

		if (i != -1) {
			testDatabaseCovers.splice(i, 1)
		} else {
			// Delete the cover
			await deleteTableObject(constants.davUser.accessToken, cover.uuid)
		}
	}

	// Create each missing cover of the test database
	for (let cover of testDatabaseCovers) {
		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: cover.uuid,
			tableId: constants.storeBookCoverTableId,
			file: true,
			properties: {
				ext: cover.ext
			}
		})

		if (response.status != 201) {
			console.log("Error in creating cover")
			console.log(response.errors)
		} else {
			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.davUser.accessToken,
				uuid: cover.uuid,
				file: new Blob(["Hello World"], { type: cover.type })
			})

			if (response.status != 200) {
				console.log("Error in creating cover")
				console.log(response.errors)
			}
		}
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

	if (response.status != 200) {
		console.log("Error in getting the store book file table")
		console.log(response.errors)
	} else {
		files = response.data.tableObjects
	}

	// Get all files of the test database
	for (let collection of constants.authorUser.author.collections) {
		for (let book of collection.books) {
			if (book.file) testDatabaseFiles.push(book.file)
		}
	}

	// Delete each cover that is not part of the test database
	for (let file of files) {
		let i = testDatabaseFiles.findIndex(f => f.uuid == file.uuid)

		if (i != -1) {
			testDatabaseFiles.splice(i, 1)
		} else {
			// Delete the file
			await deleteTableObject(constants.authorUser.accessToken, file.uuid)
		}
	}

	// Create each missing file of the test database
	for (let file of testDatabaseFiles) {
		// Create the table object
		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.authorUser.accessToken,
			uuid: file.uuid,
			tableId: constants.storeBookFileTableId,
			file: true,
			properties: {
				ext: file.ext
			}
		})

		if (response.status != 201) {
			console.log("Error in creating file")
			console.log(response.errors)
		} else {
			// Upload the file
			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.authorUser.accessToken,
				uuid: file.uuid,
				file: new Blob(["Hello World"], { type: file.type })
			})

			if (response.status != 200) {
				console.log("Error in creating file")
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

	if (response.status != 200) {
		console.log("Error in getting the store book file table")
		console.log(response.errors)
	} else {
		files = response.data.tableObjects
	}

	// Get all files of the test database
	for (let author of constants.davUser.authors) {
		for (let collection of author.collections) {
			for (let book of collection.books) {
				if (book.file) testDatabaseFiles.push(book.file)
			}
		}
	}

	// Delete each cover that is not part of the test database
	for (let file of files) {
		let i = testDatabaseFiles.findIndex(f => f.uuid == file.uuid)

		if (i != -1) {
			testDatabaseFiles.splice(i, 1)
		} else {
			// Delete the file
			await deleteTableObject(constants.davUser.accessToken, file.uuid)
		}
	}

	// Create each missing file of the test database
	for (let file of testDatabaseFiles) {
		// Create the table object
		let response = await TableObjectsController.CreateTableObject({
			accessToken: constants.davUser.accessToken,
			uuid: file.uuid,
			file: true,
			properties: {
				ext: file.ext
			}
		})

		if (response.status != 201) {
			console.log("Error in creating file")
			console.log(response.errors)
		} else {
			// Upload the file
			response = await TableObjectsController.SetTableObjectFile({
				accessToken: constants.davUser.accessToken,
				uuid: file.uuid,
				file: new Blob(["Hello World"], { type: file.type })
			})

			if (response.status != 200) {
				console.log("Error in creating file")
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

	if (response.status != 200) {
		console.log("Error in getting the book table")
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

		if (response.status != 201) {
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

	if (response.status != 200) {
		console.log("Error in getting book table")
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

		if (response.status != 201) {
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

		if (response.status != 200) {
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

	if (response.status != 200) {
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

		if (response.status != 201) {
			console.log("Error in creating category")
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

			if (response.status != 200) {
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

	if (response.status != 200) {
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

		if (response.status != 201) {
			console.log("Error in creating category name")
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

	if (response.status != 200) {
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

	if (response.status != 204) {
		console.log("Error in deleting a TableObject")
		console.log(response.errors)
	}
}