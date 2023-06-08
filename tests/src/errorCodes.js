// Generic request errors
export const UnexpectedError = 1000
export const AuthenticationFailed = 1001
export const ActionNotAllowed = "action_not_allowed"
export const ContentTypeNotSupported = "content_type_not_supported"

// Errors for missing headers
export const AuthorizationHeaderMissing = "authorization_header_missing"
export const ContentTypeHeaderMissing = 1101

// Generic request body errors
export const InvalidBody = 2000

// Missing fields
export const FirstNameMissing = "first_name_missing"
export const LastNameMissing = "last_name_missing"
export const NameMissing = "name_missing"
export const BioMissing = "bio_missing"
export const LanguageMissing = "language_missing"
export const AuthorMissing = "author_missing"
export const TitleMissing = "title_missing"
export const KeyMissing = "key_missing"
export const StoreBookMissing = "store_book_missing"
export const ReleaseNameMissing = "release_name_missing"

// Fields with wrong type
export const FirstNameWrongType = "first_name_wrong_type"
export const LastNameWrongType = "last_name_wrong_type"
export const NameWrongType = "name_wrong_type"
export const WebsiteUrlWrongType = "website_url_wrong_type"
export const FacebookUsernameWrongType = "facebook_username_wrong_type"
export const InstagramUsernameWrongType = "instagram_username_wrong_type"
export const TwitterUsernameWrongType = "twitter_username_wrong_type"
export const BioWrongType = "bio_wrong_type"
export const LanguageWrongType = "language_wrong_type"
export const AuthorWrongType = "author_wrong_type"
export const CollectionWrongType = "collection_wrong_type"
export const TitleWrongType = "title_wrong_type"
export const DescriptionWrongType = "description_wrong_type"
export const PriceWrongType = "price_wrong_type"
export const IsbnWrongType = "isbn_wrong_type"
export const StatusWrongType = "status_wrong_type"
export const CategoriesWrongType = "categories_wrong_type"
export const KeyWrongType = "key_wrong_type"
export const StoreBookWrongType = "store_book_wrong_type"
export const StoreBooksWrongType = "store_books_wrong_type"
export const ReleaseNameWrongType = "release_name_wrong_type"
export const ReleaseNotesWrongType = "release_notes_wrong_type"

// Too short fields
export const FirstNameTooShort = "first_name_too_short"
export const LastNameTooShort = "last_name_too_short"
export const NameTooShort = "name_too_short"
export const BioTooShort = "bio_too_short"
export const TitleTooShort = "title_too_short"
export const DescriptionTooShort = "description_too_short"
export const KeyTooShort = "key_too_short"
export const ReleaseNameTooShort = "release_name_too_short"
export const ReleaseNotesTooShort = "release_notes_too_short"

// Too long fields
export const FirstNameTooLong = "first_name_too_long"
export const LastNameTooLong = "last_name_too_long"
export const NameTooLong = "name_too_long"
export const BioTooLong = "bio_too_long"
export const TitleTooLong = "title_too_long"
export const DescriptionTooLong = "description_too_long"
export const KeyTooLong = "key_too_long"
export const ReleaseNameTooLong = "release_name_too_long"
export const ReleaseNotesTooLong = "release_notes_too_long"

// Invalid fields
export const WebsiteUrlInvalid = "website_url_invalid"
export const FacebookUsernameInvalid = "facebook_username_invalid"
export const InstagramUsernameInvalid = "instagram_username_invalid"
export const TwitterUsernameInvalid = "twitter_username_invalid"
export const PriceInvalid = "price_invalid"
export const IsbnInvalid = "isbn_invalid"
export const KeyInvalid = "key_invalid"

// Generic state errors
export const UserIsNotAuthor = 3000
export const UserIsAlreadyAuthor = 3001
export const LanguageNotSupported = 3002
export const StoreBookNotPublished = 3003
export const FreeStoreBooksMustBePurchased = 3004
export const StoreBookIsAlreadyInLibrary = 3005
export const StatusNotSupported = 3006
export const NotSufficientStorageAvailable = 3007
export const DavProRequired = 3008
export const TooManyCategoriesForStoreBook = 3011
export const StoreBookSeriesIsIncomplete = 3012
export const UserIsAdmin = "user_is_admin"
export const UserIsNotAdmin = "user_is_not_admin"
export const LanguageOfStoreBookDoesNotMatchLanguageOfStoreBookSeries = 3015
export const StoreBookReleaseAlreadyPublished = 3016
export const UserIsAlreadyPublisher = "user_is_already_publisher"
export const UserIsNotPublisher = "user_is_not_publisher"

// Access token errors
export const CannotUseOldAccessToken = 3100
export const AccessTokenMustBeRenewed = 3101

// Errors for values already in use
export const KeyAlreadyInUse = 3200

// Errors for publishing StoreBook
export const CannotPublishStoreBookWitoutDescription = 3300
export const CannotPublishStoreBookWithoutCover = 3301
export const CannotPublishStoreBookWithoutFile = 3302

// Errors for updating StoreBook
export const CannotUpdateLanguageOfPublishedStoreBook = 3400

// Errors for not existing resources
export const UserDoesNotExist = "user_does_not_exist"
export const SessionDoesNotExist = "session_does_not_exist"
export const AuthorDoesNotExist = "author_does_not_exist"
export const AuthorBioDoesNotExist = "author_bio_does_not_exist"
export const AuthorProfileImageDoesNotExist =
	"author_profile_image_does_not_exist"
export const StoreBookCollectionDoesNotExist =
	"store_book_collection_does_not_exist"
export const StoreBookCollectionNameDoesNotExist =
	"store_book_collection_name_does_not_exist"
export const StoreBookDoesNotExist = "store_book_does_not_exist"
export const StoreBookCoverDoesNotExist = "store_book_cover_does_not_exist"
export const StoreBookFileDoesNotExist = "store_book_file_does_not_exist"
export const CategoryDoesNotExist = "category_does_not_exist"
export const CategoryNameDoesNotExist = "category_name_does_not_exist"
export const StoreBookSeriesDoesNotExist = "store_book_series_does_not_exist"
export const StoreBookSeriesNameDoesNotExist =
	"store_book_series_name_does_not_exist"
export const StoreBookReleaseDoesNotExist = "store_book_release_does_not_exist"
export const PublisherDoesNotExist = "publisher_does_not_exist"
export const PublisherLogoDoesNotExist = "publisher_logo_does_not_exist"
