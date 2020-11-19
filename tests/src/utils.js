import axios from 'axios'
import constants from './constants.js'

export async function resetDatabase(){
	await resetAuthors()
	await resetAuthorBios()
	await resetAuthorProfileImages()
	await resetStoreBookCollections()
	await resetStoreBookCollectionNames()
	await resetStoreBooks()
	await resetStoreBookCovers()
	await resetStoreBookFiles()
	await resetBooks()
	await resetCategories()
	await resetCategoryNames()
}

export async function resetAuthors(){
	// Delete Authors
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.authorTableId)

	// Reset the Authors of users with authors
	await resetAuthorUserAuthor()
	await resetDavUserAuthors()
}

export async function resetAuthorBios(){
	// Delete AuthorBios
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.authorBioTableId)

	// Reset the AuthorBios of users with authors
	await resetAuthorUserAuthorBios()
	await resetDavUserAuthorBios()
}

export async function resetAuthorProfileImages(){
	// Delete AuthorProfileImages
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.authorProfileImageTableId)

	// Reset the AuthorProfileImages of users with authors
	await resetAuthorUserAuthorProfileImages()
	await resetDavUserAuthorProfileImages()
}

export async function resetStoreBookCollections(){
	// Delete StoreBookCollections
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.storeBookCollectionTableId)

	// Reset the StoreBookCollections of the author users
	await resetAuthorUserStoreBookCollections()
	await resetDavUserStoreBookCollections()
}

export async function resetStoreBookCollectionNames(){
	// Delete StoreBookCollectionNames
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.storeBookCollectionNameTableId)

	// Reset the StoreBookCollectionNames of the author user
	await resetAuthorUserStoreBookCollectionNames()
	await resetDavUserStoreBookCollectionNames()
}

export async function resetStoreBooks(){
	// Delete StoreBooks
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.storeBookTableId)

	// Reset StoreBooks
	await resetAuthorUserStoreBooks()
	await resetDavUserStoreBooks()
}

export async function resetStoreBookCovers(){
	// Delete StoreBookCovers
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.storeBookCoverTableId)

	// Reset StoreBookCovers
	await resetAuthorUserStoreBookCovers()
	await resetDavUserStoreBookCovers()
}

export async function resetStoreBookFiles(){
	// Delete StoreBookFiles
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUser.jwt, constants.storeBookFileTableId)

	// Reset StoreBookFiles
	await resetAuthorUserStoreBookFiles()
	await resetDavUserStoreBookFiles()
}

export async function resetBooks(){
	// Delete Books
	await deleteTableObjectsOfTable(constants.authorUser.jwt, constants.bookTableId)
	await deleteTableObjectsOfTable(constants.davUser.jwt, constants.bookTableId)

	// Reset books
	await resetKlausUserBooks()
	await resetDavClassLibraryTestUserBooks()
}

export async function resetCategories(){
	// Reset categories
	await resetDavUserCategories()
}

export async function resetCategoryNames(){
	// Delete CategoryNames
	await resetDavUserCategoryNames()
}


async function resetAuthorUserAuthor(){
	// Reset the author of author user
	let collections = []
	constants.authorUser.author.collections.forEach(collection => collections.push(collection.uuid))

	let bios = []
	constants.authorUser.author.bios.forEach(bio => bios.push(bio.uuid))

	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUser.author.uuid}`,
			headers: {
				Authorization: constants.authorUser.jwt,
				'Content-Type': 'application/json'
			},
			data: {
				first_name: constants.authorUser.author.firstName,
				last_name: constants.authorUser.author.lastName,
				bios: bios.join(','),
				collections: collections.join(','),
				profile_image: constants.authorUser.author.profileImage.uuid,
				profile_image_blurhash: constants.authorUser.author.profileImageBlurhash
			}
		})
	}catch(error){
		console.log("Error in resetting the author of author user")
		console.log(error.response.data)
	}
}

async function resetDavUserAuthors(){
	let testDatabaseAuthors = []

	// Reset the authors of dav user
	for(let author of constants.davUser.authors){
		testDatabaseAuthors.push(author.uuid)

		let collections = []
		author.collections.forEach(collection => collections.push(collection.uuid))

		let bios = []
		author.bios.forEach(bio => bios.push(bio.uuid))

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: author.firstName,
					last_name: author.lastName,
					bios: bios.join(','),
					collections: collections.join(','),
					profile_image: author.profileImage?.uuid ?? "",
					profile_image_blurhash: author.profileImageBlurhash ?? ""
				}
			})
		}catch(error){
			console.log(`Error in resetting the author ${author.firstName} ${author.lastName} of dav user`)
			console.log(error.response.data)
		}
	}

	// Get the Author table
	let response
	let authors = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		authors = response.data.table_objects
	}catch(error){
		console.log("Error in getting the author table")
		console.log(error.response.data)
	}

	// Delete each author that is not part of the test database
	for(let author of authors){
		if(testDatabaseAuthors.includes(author.uuid)) continue

		// Delete the author
		await deleteTableObject(author.uuid, constants.davUser.jwt)
	}
}

async function resetAuthorUserAuthorBios(){
	let testDatabaseAuthorBios = []

	for(let authorBio of constants.authorUser.author.bios){
		testDatabaseAuthorBios.push(authorBio.uuid)

		// Reset the author bio
		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${authorBio.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					bio: authorBio.bio,
					language: authorBio.language
				}
			})
		}catch(error){
			console.log("Error in resetting an author bio")
			console.log(error.response.data)
		}
	}

	// Get the AuthorBio table
	let response
	let authorBios = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorBioTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		authorBios = response.data.table_objects
	}catch(error){
		console.log("Error in getting the author bio table")
		console.log(error.response.data)
	}

	// Delete each author bio that is not part of the test database
	for(let authorBio of authorBios){
		if(testDatabaseAuthorBios.includes(authorBio.uuid)) continue

		// Delete the author bio
		await deleteTableObject(authorBio.uuid, constants.authorUser.jwt)
	}
}

async function resetDavUserAuthorBios(){
	let testDatabaseAuthorBios = []

	for(let author of constants.davUser.authors){
		for(let authorBio of author.bios){
			testDatabaseAuthorBios.push(authorBio.uuid)

			// Reset the author bio
			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${authorBio.uuid}`,
					headers: {
						Authorization: constants.davUser.jwt,
						'Content-Type': 'application/json'
					},
					data: {
						bio: authorBio.bio,
						language: authorBio.language
					}
				})
			}catch(error){
				console.log("Error in resetting an author bio")
				console.log(error.response.data)
			}
		}
	}

	// Get the AuthorBio table
	let response
	let authorBios = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorBioTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		authorBios = response.data.table_objects
	}catch(error){
		console.log("Error in getting the author bio table")
		console.log(error.response.data)
	}

	// Delete each author bio that is not part of the test database
	for(let authorBio of authorBios){
		if(testDatabaseAuthorBios.includes(authorBio.uuid)) continue

		// Delete the author bio
		await deleteTableObject(authorBio.uuid, constants.davUser.jwt)
	}
}

async function resetAuthorUserAuthorProfileImages(){
	// Get the profile image table
	let profileImages = []
	let testDatabaseProfileImageUuid = constants.authorUser.author.profileImage.uuid

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorProfileImageTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		profileImages = response.data.table_objects
	}catch(error){
		console.log("Error in getting the author profile image table")
		console.log(error.response.data)
	}

	// Delete each profile image that is not part of the test database
	for(let profileImage of profileImages){
		if(profileImage.uuid != testDatabaseProfileImageUuid){
			// Delete the profile image
			await deleteTableObject(profileImage.uuid, constants.authorUser.jwt)
		}
	}

	// Create the profile image of the test database if it does not exist
	if(profileImages.includes(testDatabaseProfileImageUuid)){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: testDatabaseProfileImageUuid,
					table_id: constants.authorProfileImageTableId,
					app_id: constants.pocketlibAppId,
					ext: constants.authorUser.author.profileImage.ext
				},
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': constants.authorUser.author.profileImage.type
				},
				data: "Hello World"
			})
		}catch(error){
			console.log("Error in creating profile image")
			console.log(error.response.data)
		}
	}
}

async function resetDavUserAuthorProfileImages(){
	// Get the profile image table
	let profileImages = []
	let testDatabaseProfileImages = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorProfileImageTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		profileImages = response.data.table_objects
	}catch(error){
		console.log("Error in getting the author profile image table")
		console.log(error.response.data)
	}

	// Get all profile images of the test database
	for(let author of constants.davUser.authors){
		if(author.profileImage) testDatabaseProfileImages.push(author.profileImage)
	}

	// Delete each profile image that is not part of the test database
	for(let profileImage of profileImages){
		let i = testDatabaseProfileImages.findIndex(img => img.uuid == profileImage.uuid)

		if(i != -1){
			testDatabaseProfileImages.splice(i, 1)
		}else{
			// Delete the profile image
			await deleteTableObject(profileImage.uuid, constants.davUser.jwt)
		}
	}

	// Create each missing profile image of the test database
	for(let profileImage of testDatabaseProfileImages){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: profileImage.uuid,
					table_id: constants.authorProfileImageTableId,
					app_id: constants.pocketlibAppId,
					ext: profileImage.ext
				},
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': profileImage.type
				},
				data: "Hello World"
			})
		}catch(error){
			console.log(profileImage.uuid)
			console.log("Error in creating profile image")
			console.log(error.response.data)
		}
	}
}

async function resetAuthorUserStoreBookCollections(){
	let testDatabaseCollections = []

	for(let collection of constants.authorUser.author.collections){
		testDatabaseCollections.push(collection.uuid)

		// Reset the collection
		let names = []
		collection.names.forEach(name => names.push(name.uuid))

		let books = []
		collection.books.forEach(book => books.push(book.uuid))

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUser.author.uuid,
					names: names.join(','),
					books: books.join(',')
				}
			})
		}catch(error){
			console.log("Error in resetting a store book collection")
			console.log(error.response.data)
		}
	}

	// Get the StoreBookCollection table
	let response
	let collections = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCollectionTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		collections = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book collection table")
		console.log(error.response.data)
	}

	// Delete each collection that is not part of the test database
	for(let collection of collections){
		if(testDatabaseCollections.includes(collection.uuid)) continue

		// Delete the collection
		await deleteTableObject(collection.uuid, constants.authorUser.jwt)
	}
}

async function resetDavUserStoreBookCollections(){
	let testDatabaseCollections = []
	
	for(let author of constants.davUser.authors){
		for(let collection of author.collections){
			testDatabaseCollections.push(collection.uuid)

			// Reset the collection
			let names = []
			collection.names.forEach(name => names.push(name.uuid))

			let books = []
			collection.books.forEach(book => books.push(book.uuid))

			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
					headers: {
						Authorization: constants.davUser.jwt,
						'Content-Type': 'application/json'
					},
					data: {
						author: author.uuid,
						names: names.join(','),
						books: books.join(',')
					}
				});
			}catch(error){
				console.log(`Error in resetting a store book collection of the author ${author.firstName} ${author.lastName}`)
				console.log(error.response.data)
			}
		}
	}

	// Get the StoreBookCollection table
	let response
	let collections = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCollectionTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		collections = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book collection table")
		console.log(error.response.data)
	}

	// Delete each collection that is not part of the test database
	for(let collection of collections){
		if(testDatabaseCollections.includes(collection.uuid)) continue

		// Delete the collection
		await deleteTableObject(collection.uuid, constants.davUser.jwt)
	}
}

async function resetAuthorUserStoreBookCollectionNames(){
	let testDatabaseCollectionNames = []

	for(let collection of constants.authorUser.author.collections){
		for(let collectionName of collection.names){
			testDatabaseCollectionNames.push(collectionName.uuid)

			// Reset the collection name
			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${collectionName.uuid}`,
					headers: {
						Authorization: constants.authorUser.jwt,
						'Content-Type': 'application/json'
					},
					data: {
						name: collectionName.name,
						language: collectionName.language
					}
				})
			}catch(error){
				console.log("Error in resetting a store book collection name")
				console.log(error.response.data)
			}
		}
	}

	// Get the StoreBookCollectionName table
	let response
	let collectionNames = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCollectionNameTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		collectionNames = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book collection name table")
		console.log(error.response.data)
	}

	// Delete each collection name that is not part of the test database
	for(let collectionName of collectionNames){
		if(testDatabaseCollectionNames.includes(collectionName.uuid)) continue

		// Delete the collection name
		await deleteTableObject(collectionName.uuid, constants.authorUser.jwt)
	}
}

async function resetDavUserStoreBookCollectionNames(){
	let testDatabaseCollectionNames = []

	for(let author of constants.davUser.authors){
		for(let collection of author.collections){
			for(let collectionName of collection.names){
				testDatabaseCollectionNames.push(collectionName.uuid)

				// Reset the collection name
				try{
					await axios.default({
						method: 'put',
						url: `${constants.apiBaseUrl}/apps/object/${collectionName.uuid}`,
						headers: {
							Authorization: constants.davUser.jwt,
							'Content-Type': 'application/json'
						},
						data: {
							name: collectionName.name,
							language: collectionName.language
						}
					})
				}catch(error){
					console.log("Error in resetting a store book collection name")
					console.log(error.response.data)
				}
			}
		}
	}

	// Get the StoreBookCollectionName table
	let response
	let collectionNames = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCollectionNameTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		collectionNames = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book collection name table")
		console.log(error.response.data)
	}

	// Delete each collection name that is not part of the test database
	for(let collectionName of collectionNames){
		if(testDatabaseCollectionNames.includes(collectionName.uuid)) continue

		// Delete the collection name
		await deleteTableObject(collectionName.uuid, constants.davUser.jwt)
	}
}

async function resetAuthorUserStoreBooks(){
	let testDatabaseStoreBooks = []

	for(let collection of constants.authorUser.author.collections){
		for(let book of collection.books){
			testDatabaseStoreBooks.push(book.uuid)

			// Reset the store book
			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
					headers: {
						Authorization: constants.authorUser.jwt,
						'Content-Type': 'application/json'
					},
					data: {
						collection: collection.uuid,
						title: book.title,
						description: book.description,
						language: book.language,
						price: book.price?.toString() ?? "",
						status: book.status,
						cover: book.cover?.uuid ?? "",
						cover_aspect_ratio: book.coverAspectRatio ?? "",
						cover_blurhash: book.coverBlurhash ?? "",
						file: book.file?.uuid ?? "",
						file_name: book.fileName ?? "",
						categories: book.categories ? book.categories.join(',') : ""
					}
				})
			}catch(error){
				console.log("Error in resetting a store book")
				console.log(error.response.data)
			}
		}
	}

	// Get the StoreBook table
	let response
	let storeBooks = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		storeBooks = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book table")
		console.log(error.response.data)
	}

	// Delete each store book that is not part of the test database
	for(let storeBook of storeBooks){
		if(testDatabaseStoreBooks.includes(storeBook.uuid)) continue

		// Delete the store book
		await deleteTableObject(storeBook.uuid, constants.authorUser.jwt)
	}
}

async function resetDavUserStoreBooks(){
	let testDatabaseStoreBooks = []

	for(let author of constants.davUser.authors){
		for(let collection of author.collections){
			for(let book of collection.books){
				testDatabaseStoreBooks.push(book.uuid)

				// Reset the store book
				try{
					await axios.default({
						method: 'put',
						url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
						headers: {
							Authorization: constants.davUser.jwt,
							'Content-Type': 'application/json'
						},
						data: {
							collection: collection.uuid,
							title: book.title,
							description: book.description,
							language: book.language,
							price: book.price?.toString() ?? "",
							status: book.status ?? "",
							cover_aspect_ratio: book.coverAspectRatio ?? "",
							cover_blurhash: book.coverBlurhash ?? "",
							cover: book.cover?.uuid ?? "",
							file: book.file?.uuid ?? "",
							categories: book.categories?.join(',') ?? ""
						}
					})
				}catch(error){
					console.log("Error in resetting a store book")
					console.log(error.response.data)
				}
			}
		}
	}

	// Get the StoreBook table
	let response
	let storeBooks = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		storeBooks = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book table")
		console.log(error.response.data)
	}

	// Delete each store book that is not part of the test database
	for(let storeBook of storeBooks){
		if(testDatabaseStoreBooks.includes(storeBook.uuid)) continue

		// Delete the store book
		await deleteTableObject(storeBook.uuid, constants.authorUser.jwt)
	}
}

async function resetAuthorUserStoreBookCovers(){
	// Get the cover table
	let covers = []
	let testDatabaseCovers = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCoverTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		covers = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book cover table")
		console.log(error.response.data)
	}

	// Get all covers of the test database
	for(let collection of constants.authorUser.author.collections){
		for(let book of collection.books){
			if(book.cover) testDatabaseCovers.push(book.cover)
		}
	}

	// Delete each cover that is not part of the test database
	for(let cover of covers){
		let i = testDatabaseCovers.findIndex(c => c.uuid == cover.uuid)

		if(i != -1){
			testDatabaseCovers.splice(i, 1)
		}else{
			// Delete the cover
			await deleteTableObject(cover.uuid, constants.authorUser.jwt)
		}
	}

	// Create each missing cover of the test database
	for(let cover of testDatabaseCovers){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: cover.uuid,
					table_id: constants.storeBookCoverTableId,
					app_id: constants.pocketlibAppId,
					ext: cover.ext
				},
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': cover.type
				},
				data: "Hello World"
			})
		}catch(error){
			console.log("Error in creating cover")
			console.log(error.response.data)
		}
	}
}

async function resetDavUserStoreBookCovers(){
	// Get the cover table
	let covers = []
	let testDatabaseCovers = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCoverTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		covers = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book cover table")
		console.log(error.response.data)
	}

	// Get all covers of the test database
	for(let author of constants.davUser.authors){
		for(let collection of author.collections){
			for(let book of collection.books){
				if(book.cover) testDatabaseCovers.push(book.cover)
			}
		}
	}

	// Delete each cover that is not part of the test database
	for(let cover of covers){
		let i = testDatabaseCovers.findIndex(c => c.uuid == cover.uuid)

		if(i != -1){
			testDatabaseCovers.splice(i, 1)
		}else{
			// Delete the cover
			await deleteTableObject(cover.uuid, constants.davUser.jwt)
		}
	}

	// Create each missing cover of the test database
	for(let cover of testDatabaseCovers){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: cover.uuid,
					table_id: constants.storeBookCoverTableId,
					app_id: constants.pocketlibAppId,
					ext: cover.ext
				},
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': cover.type
				},
				data: "Hello World"
			})
		}catch(error){
			console.log("Error in creating cover")
			console.log(error.response.data)
		}
	}
}

async function resetAuthorUserStoreBookFiles(){
	// Get the file table
	let files = []
	let testDatabaseFiles = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookFileTableId}`,
			headers: {
				Authorization: constants.authorUser.jwt
			}
		})

		files = response.data.table_objects
	}catch(error){
		console.log("Error in getting the store book file table")
		console.log(error.response.data)
	}

	// Get all files of the test database
	for(let collection of constants.authorUser.author.collections){
		for(let book of collection.books){
			if(book.file) testDatabaseFiles.push(book.file)
		}
	}

	// Delete each cover that is not part of the test database
	for(let file of files){
		let i = testDatabaseFiles.findIndex(f => f.uuid == file.uuid)

		if(i != -1){
			testDatabaseFiles.splice(i, 1)
		}else{
			// Delete the file
			await deleteTableObject(file.uuid, constants.authorUser.jwt)
		}
	}

	// Create each missing file of the test database
	for(let file of testDatabaseFiles){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: file.uuid,
					table_id: constants.storeBookFileTableId,
					app_id: constants.pocketlibAppId,
					ext: file.ext
				},
				headers: {
					Authorization: constants.authorUser.jwt,
					'Content-Type': file.type
				},
				data: "Hello World"
			})
		}catch(error){
			console.log("Error in creating file")
			console.log(error.response.data)
		}
	}
}

async function resetDavUserStoreBookFiles(){
	// Get the file table
	let files = []
	let testDatabaseFiles = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookFileTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		files = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book file table")
		console.log(error.response.data)
	}

	// Get all files of the test database
	for(let author of constants.davUser.authors){
		for(let collection of author.collections){
			for(let book of collection.books){
				if(book.file) testDatabaseFiles.push(book.file)
			}
		}
	}

	// Delete each cover that is not part of the test database
	for(let file of files){
		let i = testDatabaseFiles.findIndex(f => f.uuid == file.uuid)

		if(i != -1){
			testDatabaseFiles.splice(i, 1)
		}else{
			// Delete the file
			await deleteTableObject(file.uuid, constants.davUser.jwt)
		}
	}

	// Create each missing file of the test database
	for(let file of testDatabaseFiles){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: file.uuid,
					table_id: constants.storeBookFileTableId,
					app_id: constants.pocketlibAppId,
					ext: file.ext
				},
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': file.type
				},
				data: "Hello World"
			})
		}catch(error){
			console.log("Error in creating file")
			console.log(error.response.data)
		}
	}
}

async function resetKlausUserBooks(){
	// Get the book table
	let books = []
	let testDatabaseBooks = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.bookTableId}`,
			headers: {
				Authorization: constants.klausUser.jwt
			}
		})

		books = response.data.table_objects
	}catch(error){
		console.log("Error in getting the book table")
		console.log(error.response.data)
	}

	// Get all books of the test database
	for(let book of constants.klausUser.books){
		testDatabaseBooks.push(book)
	}

	// Delete each book that is not part of the test database
	for(let book of books){
		let i = testDatabaseBooks.findIndex(b => b.uuid == book.uuid)

		if(i != -1){
			testDatabaseBooks.splice(i, 1)
		}else{
			// Delete the book
			await deleteTableObject(book.uuid, constants.klausUser.jwt)
		}
	}

	// Create each missing book of the test database
	for(let book of testDatabaseBooks){
		try{
			let data = {
				store_book: book.storeBook,
				file: book.file
			}

			if(book.purchase){
				data["purchase"] = book.purchase.toString()
			}

			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: book.uuid,
					table_id: constants.bookTableId,
					app_id: constants.pocketlibAppId
				},
				headers: {
					Authorization: constants.klausUser.jwt,
					'Content-Type': 'application/json'
				},
				data
			})
		}catch(error){
			console.log("Error in creating Book")
			console.log(error.response.data)
		}
	}
}

async function resetDavClassLibraryTestUserBooks(){
	// Get the book table
	let books = []
	let testDatabaseBooks = []

	try{
		let response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.bookTableId}`,
			headers: {
				Authorization: constants.davClassLibraryTestUser.jwt
			}
		})

		books = response.data.table_objects
	}catch(error){
		console.log("Error in getting book table")
		console.log(error.response.data)
	}

	// Get all books of the test database
	for(let book of constants.davClassLibraryTestUser.books){
		testDatabaseBooks.push(book)
	}

	// Delete each book that is not part of the test database
	for(let book of books){
		let i = testDatabaseBooks.findIndex(b => b.uuid == book.uuid)

		if(i != -1){
			testDatabaseBooks.splice(i, 1)
		}else{
			// Delete the book
			await deleteTableObject(book.uuid, constants.davClassLibraryTestUser.jwt)
		}
	}

	// Create each missing book of the test database
	for(let book of testDatabaseBooks){
		try{
			let data = {
				store_book: book.storeBook,
				file: book.file
			}

			if(book.purchase){
				data["purchase"] = book.purchase.toString()
			}

			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: book.uuid,
					table_id: constants.bookTableId,
					app_id: constants.pocketlibAppId
				},
				headers: {
					Authorization: constants.davClassLibraryTestUser.jwt,
					'Content-Type': 'application/json'
				},
				data
			})
		}catch(error){
			console.log("Error in creating Book")
			console.log(error.response.data)
		}
	}
}

async function resetDavUserCategories(){
	let testDatabaseCategories = []

	for(let category of constants.categories){
		testDatabaseCategories.push(category)

		// Reset the category
		let names = [];
		category.names.forEach(name => names.push(name.uuid));

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${category.uuid}`,
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					key: category.key,
					names: names.join(',')
				}
			})
		}catch(error){
			console.log("Error in resetting Category")
			console.log(error.response.data)
		}
	}

	// Get the Category table
	let response
	let categories = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.categoryTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		categories = response.data.table_objects
	}catch(error){
		console.log("Error in getting Category table")
		console.log(error.response.data)
	}

	// Delete each category that is not part of the test database
	for(let category of categories){
		let i = testDatabaseCategories.findIndex(c => c.uuid == category.uuid)

		if(i != -1){
			testDatabaseCategories.splice(i, 1)
		}else{
			// Delete the collection
			await deleteTableObject(category.uuid, constants.davUser.jwt)
		}
	}

	// Create each missing category of the test database
	for(let category of testDatabaseCategories){
		// Get the category names
		let names = []
		for(let name of category.names) names.push(name.uuid)

		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: category.uuid,
					table_id: constants.categoryTableId,
					app_id: constants.pocketlibAppId
				},
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					key: category.key,
					names: names.join(',')
				}
			})
		}catch(error){
			console.log("Error in creating category")
			console.log(error.response.data)
		}
	}
}

async function resetDavUserCategoryNames(){
	let testDatabaseCategoryNames = []

	for(let category of constants.categories){
		for(let categoryName of category.names){
			testDatabaseCategoryNames.push(categoryName)

			// Reset the category name
			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${categoryName.uuid}`,
					headers: {
						Authorization: constants.davUser.jwt,
						'Content-Type': 'application/json'
					},
					data: {
						name: categoryName.name,
						language: categoryName.language
					}
				})
			}catch(error){
				console.log("Error in resetting CategoryName")
				console.log(error.response.data)
			}
		}
	}

	// Get the CategoryName table
	let response
	let categoryNames = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.categoryNameTableId}`,
			headers: {
				Authorization: constants.davUser.jwt
			}
		})

		categoryNames = response.data.table_objects
	}catch(error){
		console.log("Error in getting the CategoryName table")
		console.log(error.response.data)
	}

	// Delete each category name that is not part of the test database
	for(let categoryName of categoryNames){
		let i = testDatabaseCategoryNames.findIndex(name => name.uuid == categoryName.uuid)

		if(i != -1){
			testDatabaseCategoryNames.splice(i, 1)
		}else{
			// Delete the category name
			await deleteTableObject(categoryName.uuid, constants.davUser.jwt)
		}
	}

	// Create each missing category name that is not part of the test database
	for(let categoryName of testDatabaseCategoryNames){
		try{
			await axios.default({
				method: 'post',
				url: `${constants.apiBaseUrl}/apps/object`,
				params: {
					uuid: categoryName.uuid,
					table_id: constants.categoryNameTableId,
					app_id: constants.pocketlibAppId
				},
				headers: {
					Authorization: constants.davUser.jwt,
					'Content-Type': 'application/json'
				},
				data: {
					name: categoryName.name,
					language: categoryName.language
				}
			})
		}catch(error){
			console.log("Error in creating category name")
			console.log(error.response.data)
		}
	}
}


async function deleteTableObjectsOfTable(jwt, tableId){
	// Get the table
	let response
	let objects = []

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${tableId}`,
			headers: {
				Authorization: jwt
			}
		})

		objects = response.data.table_objects
	}catch(error){
		console.log(`Error in getting the table with the id ${tableId}`)
		console.log(error.response.status)
	}

	// Delete each object
	for(let obj of objects){
		if(obj.table_id == tableId){
			await deleteTableObject(obj.uuid, jwt)
		}
	}
}

async function deleteTableObject(uuid, jwt){
	try{
		await axios.default({
			method: 'delete',
			url: `${constants.apiBaseUrl}/apps/object/${uuid}`,
			headers: {
				Authorization: jwt
			}
		})
	}catch(error){
		console.log("Error in deleting a TableObject")
		console.log(error.response.data)
	}
}

export async function getTableObject(uuid, jwt){
	return await axios.default({
		method: 'get',
		url: `${constants.apiBaseUrl}/apps/object/${uuid}`,
		headers: {
			Authorization: jwt
		}
	})
}