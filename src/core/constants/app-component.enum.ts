export const AppComponent = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseClientInterface: Symbol.for('DatabaseClientInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
  FavoriteServiceInterface: Symbol.for('FavoriteServiceInterface'),
  FavoriteModel: Symbol.for('FavoriteModel'),
  UserController: Symbol.for('UserController'),
  OfferController: Symbol.for('OfferController'),
  FavoriteController: Symbol.for('FavoriteController'),
  CommentController: Symbol.for('CommentController'),
  ExceptionFilter: Symbol.for('ExceptionFilter')
} as const;
