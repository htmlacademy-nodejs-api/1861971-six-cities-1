import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './index.js';
import {
  getOffersList,
  getErrorMessage,
  showResult,
  showError,
  getMongoURI
} from '../../helpers/index.js';
import {
  UserServiceInterface,
  UserModel
} from '../../modules/user/index.js';
import {DatabaseClientInterface} from '../database-client/index.js';
import {LoggerInterface} from '../logger/index.js';
import PinoService from '../logger/pino.service.js';
import UserService from '../../modules/user/user.service.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import {Offer} from '../types/index.js';
import {OfferModel} from '../../modules/offer/offer.entity.js';
import {OfferServiceInterface} from '../../modules/offer/index.js';
import OfferService from '../../modules/offer/offer.service.js';
import {DefaultValues} from '../constants/index.js';

const DEFAULT_USER_PASSWORD = 'v1984vlad';
const {UserName, Password, Host, Port, Salt} = DefaultValues;

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger!: LoggerInterface;
  private readonly salt = Salt;
  private readonly username = UserName;
  private readonly password = Password;
  private readonly host = Host;
  private readonly port = Port;


  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new PinoService();
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
    this.offerService = new OfferService(this.logger, OfferModel);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.authorOfOffer,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      ...offer,
      authorOfOffer: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = getOffersList(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(showResult(`${count} rows imported.`));
    this.databaseService.disconnect();
  }

  public async execute(
    filename: string,
  ): Promise<void> {
    const url = getMongoURI(
      this.username,
      this.password,
      this.host,
      this.port
    );

    await this.databaseService.connect(url);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(error) {
      console.log(showError(`Can't read the file: ${getErrorMessage(error)}`));
    }
  }
}
