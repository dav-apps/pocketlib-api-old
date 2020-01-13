var axios = require('axios');
var constants = require('./constants');

async function resetDatabase(){
	// Delete Authors
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUserJWT, constants.authorTableId);

	// Reset the Author of author user
	await resetAuthorUserAuthor();
	await resetDavUserAuthors();

	// Delete StoreBookCollections
	await deleteTableObjectsOfTable(constants.davUserJWT, constants.storeBookCollectionTableId);
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUserJWT, constants.storeBookCollectionTableId);

	// Reset the StoreBookCollections of the author users
	await resetAuthorUserStoreBookCollections();

	// Delete StoreBookCollectionNames
	await deleteTableObjectsOfTable(constants.davUserJWT, constants.storeBookCollectionNameTableId);
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUserJWT, constants.storeBookCollectionNameTableId);

	// Reset the StoreBookCollectionNames of the author user
	await resetAuthorUserStoreBookCollectionNames();

	// Delete StoreBooks
	await deleteTableObjectsOfTable(constants.davUserJWT, constants.storeBookTableId);
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUserJWT, constants.storeBookTableId);

	// Reset the StoreBooks of author user
	await resetAuthorUserStoreBooks();

	// Delete Covers
	await deleteTableObjectsOfTable(constants.davUserJWT, constants.storeBookCoverTableId);
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUserJWT, constants.storeBookCoverTableId);

	// Reset the Covers
	await resetAuthorUserStoreBookCovers();

	// Delete files
	await deleteTableObjectsOfTable(constants.davUserJWT, constants.storeBookFileTableId);
	await deleteTableObjectsOfTable(constants.davClassLibraryTestUserJWT, constants.storeBookFileTableId);

	// Reset the Files
	await resetAuthorUserStoreBookFiles();
}

async function resetAuthorUserAuthor(){
	// Reset the author of author user
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
			headers: {
				Authorization: constants.authorUserJWT,
				'Content-Type': 'application/json'
			},
			data: {
				first_name: constants.authorUserAuthor.firstName,
				last_name: constants.authorUserAuthor.lastName,
				bio: constants.authorUserAuthor.bio,
				collections: [constants.authorUserAuthor.collections[0].uuid, constants.authorUserAuthor.collections[1].uuid].join(',')
			}
		});
	}catch(error){
		console.log("Error in resetting the author of author user");
		console.log(error.response.data);
	}
}

async function resetDavUserAuthors(){
	let testDatabaseAuthors = [];

	// Reset the authors of dav user
	for(let author of constants.davUserAuthors){
		testDatabaseAuthors.push(author.uuid);

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${author.uuid}`,
				headers: {
					Authorization: constants.davUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					first_name: author.firstName,
					last_name: author.lastName,
					bio: author.bio,
					collections: ""
				}
			});
		}catch(error){
			console.log(`Error in resetting the author ${author.firstName} ${author.lastName} of dav user`);
			console.log(error.response.data);
		}
	}

	// Get the Author table
	let response;
	let authors = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: constants.davUserJWT
			}
		});

		authors = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the author table");
		console.log(error.response.data);
	}

	// Delete each author that is not part of the test database
	for(let author of authors){
		if(testDatabaseAuthors.includes(author.uuid)) continue;

		// Delete the author
		await deleteTableObject(author.uuid, constants.davUserJWT);
	}
}

async function resetAuthorUserStoreBookCollections(){
	let testDatabaseCollections = [];

	for(let collection of constants.authorUserAuthor.collections){
		testDatabaseCollections.push(collection.uuid);

		// Reset the collection
		let names = [];
		collection.names.forEach(name => names.push(name.uuid));

		let books = [];
		collection.books.forEach(book => books.push(book.uuid));

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${collection.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUserAuthor.uuid,
					names: names.join(','),
					books: books.join(',')
				}
			})
		}catch(error){
			console.log("Error in resetting a store book collection");
			console.log(error.response.data);
		}
	}

	// Get the StoreBookCollection table
	let response;
	let collections = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCollectionTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		collections = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book collection table");
		console.log(error.response.data);
	}

	// Delete each collection that is not part of the test database
	for(let collection of collections){
		if(testDatabaseCollections.includes(collection.uuid)) continue;

		// Delete the collection
		await deleteTableObject(collection.uuid, constants.authorUserJWT);
	}
}

async function resetAuthorUserStoreBookCollectionNames(){
	let testDatabaseCollectionNames = [];

	for(let collection of constants.authorUserAuthor.collections){
		for(let collectionName of collection.names){
			testDatabaseCollectionNames.push(collectionName.uuid);

			// Reset the collection name
			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${collectionName.uuid}`,
					headers: {
						Authorization: constants.authorUserJWT,
						'Content-Type': 'application/json'
					},
					data: {
						name: collectionName.name,
						language: collectionName.language
					}
				});
			}catch(error){
				console.log("Error in resetting a store book collection name");
				console.log(error.response.data);
			}
		}
	}

	// Get the StoreBookCollectionName table
	let response;
	let collectionNames = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCollectionNameTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		collectionNames = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book collection name table");
		console.log(error.response.data);
	}

	// Delete each collection name that is not part of the test database
	for(let collectionName of collectionNames){
		if(testDatabaseCollectionNames.includes(collectionName.uuid)) continue;

		// Delete the collection name
		await deleteTableObject(collectionName.uuid, constants.authorUserJWT);
	}
}

async function resetAuthorUserStoreBooks(){
	let testDatabaseStoreBooks = [];

	for(let collection of constants.authorUserAuthor.collections){
		for(let book of collection.books){
			testDatabaseStoreBooks.push(book.uuid);

			// Reset the store book
			try{
				await axios.default({
					method: 'put',
					url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
					headers: {
						Authorization: constants.authorUserJWT,
						'Content-Type': 'application/json'
					},
					data: {
						collection: collection.uuid,
						title: book.title,
						description: book.description,
						language: book.language,
						status: book.status,
						cover: book.cover ? book.cover.uuid : "",
						file: book.file ? book.file.uuid : ""
					}
				})
			}catch(error){
				console.log("Error in resetting a store book");
				console.log(error.response.data);
			}
		}
	}

	// Get the StoreBook table
	let response;
	let storeBooks = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		storeBooks = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book table");
		console.log(error.response.data);
	}

	// Delete each store book that is not part of the test database
	for(let storeBook of storeBooks){
		if(testDatabaseStoreBooks.includes(storeBook.uuid)) continue;

		// Delete the store book
		await deleteTableObject(storeBook.uuid, constants.authorUserJWT);
	}
}

async function resetAuthorUserStoreBookCovers(){
	// Get the cover table
	let response;
	let covers = [];
	let testDatabaseCovers = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookCoverTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		covers = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book cover table");
		console.log(error.response.data);
	}

	// Get all covers of the test database
	for(let collection of constants.authorUserAuthor.collections){
		for(let book of collection.books){
			if(book.cover) testDatabaseCovers.push(book.cover.uuid);
		}
	}

	// Delete each cover that is not part of the test database
	for(let cover of covers){
		let i = testDatabaseCovers.indexOf(cover.uuid);

		if(i != -1){
			testDatabaseCovers.splice(i, 1);
		}else{
			// Delete the cover
			await deleteTableObject(cover.uuid, constants.authorUserJWT)
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
					ext: "png"
				},
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'image/png'
				},
				data: "Hello World"
			});
		}catch(error){
			console.log("Error in creating cover");
			console.log(error.response.data);
		}
	}
}

async function resetAuthorUserStoreBookFiles(){
	// Get the file table
	let response;
	let files = [];
	let testDatabaseFiles = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookFileTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		files = response.data.table_objects;
	}catch(error){
		console.log("Error in getting the store book file table");
		console.log(error.response.data);
	}

	// Get all files of the test database
	for(let collection of constants.authorUserAuthor.collections){
		for(let book of collection.books){
			if(book.file) testDatabaseFiles.push(book.file.uuid);
		}
	}

	// Delete each cover that is not part of the test database
	for(let file of files){
		let i = testDatabaseFiles.indexOf(file.uuid);

		if(i != -1){
			testDatabaseFiles.splice(i, 1);
		}else{
			// Delete the file
			await deleteTableObject(file.uuid, constants.authorUserJWT);
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
					ext: "pdf"
				},
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/pdf'
				},
				data: "Hello World"
			});
		}catch(error){
			console.log("Error in creating file");
			console.log(error.response.data);
		}
	}
}

async function deleteTableObjectsOfTable(jwt, tableId){
	// Get the table
	let response;
	let objects = [];

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${tableId}`,
			headers: {
				Authorization: jwt
			}
		});

		objects = response.data.table_objects;
	}catch(error){
		console.log(`Error in getting the table with the id ${tableId}`);
		console.log(error.response.status);
	}

	// Delete each object
	for(let obj of objects){
		await deleteTableObject(obj.uuid, jwt);
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
		});
	}catch(error){
		console.log("Error in deleting a TableObject");
		console.log(error.response.data);
	}
}

async function getTableObject(uuid, jwt){
	return await axios.default({
		method: 'get',
		url: `${constants.apiBaseUrl}/apps/object/${uuid}`,
		headers: {
			Authorization: jwt
		}
	});
}

module.exports = {
	resetDatabase,
	getTableObject
}