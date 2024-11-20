import { CustomError } from '@config/errors/error.model';
import { UserFeed } from '@models/entities/userFeed';
import userFeedRepository from '@repositories/userFeed.repository';
import { Rabbit } from 'src/rabbitmq/rabbit.server';
import moment from 'moment';

class UserFeedService {

  async getUserFeedByArticle(articleId: string) {
    const userFeeds: any =  userFeedRepository.getUserFeedByArticle(articleId);
    if (!userFeeds) {
      throw new CustomError('No se han encontrado reseñas para el artículo '+articleId, 404);
    }
    return { ...userFeeds._doc};
    }

}

export default new UserFeedService();