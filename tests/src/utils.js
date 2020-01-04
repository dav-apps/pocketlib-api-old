var axios = require('axios');
var constants = require('./constants');

async function resetAuthors(){
	// Delete the author of dav user
	// Get the author table
	let response;
	let authorObjUuid;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.authorTableId}`,
			headers: {
				Authorization: constants.davUserJWT
			}
		});

		if(response.data.table_objects.length > 0){
			authorObjUuid = response.data.table_objects[0].uuid;
		}
	}catch(error){
		console.log("Error in trying to get the author table");
		console.log(error.response.data);
	}

	if(authorObjUuid){
		// Delete the author object
		try{
			await axios.default({
				method: 'delete',
				url: `${constants.apiBaseUrl}/apps/object/${authorObjUuid}`,
				headers: {
					Authorization: constants.davUserJWT
				}
			});
		}catch(error){
			console.log("Error in trying to delete the author object");
			console.log(error.response.data);
		}
	}

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
				bio: constants.authorUserAuthor.bio
			}
		});
	}catch(error){
		console.log("Error in resetting the author of the author user");
		console.log(error.response.data);
	}
}

async function resetStoreBooks(){
	// Delete all store books that are not part of the default test database
	let response;
	let storeBookObjects;

	try{
		response = await axios.default({
			method: 'get',
			url: `${constants.apiBaseUrl}/apps/table/${constants.storeBookTableId}`,
			headers: {
				Authorization: constants.authorUserJWT
			}
		});

		storeBookObjects = response.data.table_objects;
	}catch(error){
		console.log("Error in trying the get the store book table");
		console.log(error.response.data);
	}

	if(storeBookObjects){
		for(let tableObject of storeBookObjects){
			if(tableObject.uuid == constants.authorUserAuthor.books[0].uuid || 
				tableObject.uuid == constants.authorUserAuthor.books[1].uuid) continue;

			// Get the table object
			let tableObjectResult;

			try{
				tableObjectResult = await axios.default({
					method: 'get',
					url: `${constants.apiBaseUrl}/apps/object/${tableObject.uuid}`,
					headers: {
						Authorization: constants.authorUserJWT
					}
				});
			}catch(error){
				console.log("Error in trying to get a store book object");
				console.log(error.response.data);
			}

			if(tableObjectResult.data.properties.cover){
				// Delete the cover
				try{
					await axios.default({
						method: 'delete',
						url: `${constants.apiBaseUrl}/apps/object/${tableObjectResult.data.properties.cover}`,
						headers: {
							Authorization: constants.authorUserJWT
						}
					});
				}catch(error){
					console.log("Error in trying to delete a store book cover object");
					console.log(error.response.data);
				}
			}

			if(tableObjectResult.data.properties.file){
				// Delete the file
				try{
					await axios.default({
						method: 'delete',
						url: `${constants.apiBaseUrl}/apps/object/${tableObjectResult.data.properties.file}`,
						headers: {
							Authorization: constants.authorUserJWT
						}
					});
				}catch(error){
					console.log("Error in trying to delete a store book file object");
					console.log(error.response.data);
				}
			}

			// Delete the table object
			try{
				await axios.default({
					method: 'delete',
					url: `${constants.apiBaseUrl}/apps/object/${tableObject.uuid}`,
					headers: {
						Authorization: constants.authorUserJWT
					}
				});
			}catch(error){
				console.log("Error in trying to delete a store book object");
				console.log(error.response.data);
			}
		}
	}

	// Reset the store books
	let bookUuids = [];

	for(let book of constants.authorUserAuthor.books){
		bookUuids.push(book.uuid);
		let response;

		// Get the store book
		try{
			response = await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			console.log("Error in getting a store book");
			console.log(response.data);
			continue;
		}

		// Delete the cover if the store book has one
		if(!book.cover && response.data.properties.cover){
			let coverUuid = response.data.properties.cover;

			try{
				await axios.default({
					method: 'delete',
					url: `${constants.apiBaseUrl}/apps/object/${coverUuid}`,
					headers: {
						Authorization: constants.authorUserJWT
					}
				});
			}catch(error){
				console.log("Error in deleting a cover");
				console.log(error.response.data);
			}
		}

		// Delete the file if the store book has one
		if(!book.file && response.data.properties.file){
			let fileUuid = response.data.properties.file;

			try{
				await axios.default({
					method: 'delete',
					url: `${constants.apiBaseUrl}/apps/object/${fileUuid}`,
					headers: {
						Authorization: constants.authorUserJWT
					}
				});
			}catch(error){
				console.log("Error in deleting a file");
				console.log(error.response.data);
			}
		}

		try{
			await axios.default({
				method: 'put',
				url: `${constants.apiBaseUrl}/apps/object/${book.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT,
					'Content-Type': 'application/json'
				},
				data: {
					author: constants.authorUserAuthor.uuid,
					title: book.title,
					description: book.description,
					language: book.language,
					cover: book.cover ? book.cover : "",
					file: book.file ? book.file : "",
					status: book.status
				}
			});
		}catch(error){
			// Create the store book if it does not exist
			if(error.response.data.errors[0][0] == 2805){
				try{
					await axios.default({
						method: 'post',
						url: `${constants.apiBaseUrl}/apps/object`,
						params: {
							table_id: constants.storeBookTableId,
							app_id: constants.pocketlibAppId
						},
						headers: {
							Authorization: constants.authorUserJWT,
							'Content-Type': 'application/json'
						},
						data: {
							uuid: book.uuid,
							title: book.title,
							description: book.description,
							language: book.language,
							cover: book.cover,
							file: book.file,
							status: book.status,
							author: constants.authorUserAuthor.uuid
						}
					});
				}catch(error){
					console.log("Error in creating a store book table object");
					console.log(error.response.data);
				}
			}else{
				console.log("Error in resetting a store book");
				console.log(error.response.data);
			}

			return;
		}
	}

	// Reset the covers
	for(let cover of constants.authorUserAuthor.covers){
		// Get the cover from the server
		try{
			await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${cover.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			console.log("Error in getting a cover")
			console.log(error.response.data);

			if(error.response.data.errors[0][0] == 2805){
				// Create the cover
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
					console.log("Error in creating a cover");
					console.log(error.response.data);
				}
			}
		}
	}

	// Reset the files
	for(let file of constants.authorUserAuthor.files){
		// Get the file from the server
		try{
			await axios.default({
				method: 'get',
				url: `${constants.apiBaseUrl}/apps/object/${file.uuid}`,
				headers: {
					Authorization: constants.authorUserJWT
				}
			});
		}catch(error){
			console.log("Error in getting a file");
			console.log(error.response.data);

			if(error.response.data.errors[0][0] == 2805){
				// Create the file
				try{
					await axios.default({
						method: 'post',
						url: `${constants.apiBaseUrl}/apps/object`,
						params: {
							uuid: file.uuid,
							table_id: constants.storeBookFileTableId,
							app_id: constants.pocketlibAppId,
							ext: "epub"
						},
						headers: {
							Authorization: constants.authorUserJWT,
							'Content-Type': 'application/epub+zip'
						},
						data: "Hello World"
					});
				}catch(error){
					console.log("Error in creating a file");
					console.log(error.response.data);
				}
			}
		}
	}

	// Reset the books property of the author
	try{
		await axios.default({
			method: 'put',
			url: `${constants.apiBaseUrl}/apps/object/${constants.authorUserAuthor.uuid}`,
			headers: {
				Authorization: constants.authorUserJWT,
				'Content-Type': 'application/json'
			},
			data: {
				books: bookUuids.join(',')
			}
		});
	}catch(error){
		console.log("Error in resetting the books property of the author");
		console.log(error.response.data);
	}
}

module.exports = {
	resetAuthors,
	resetStoreBooks
}