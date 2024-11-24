import { CustomError } from '@config/errors/error.model';
import { Feed } from '@models/entities/feed';
import feedRepository from '@repositories/feed.repository';
import calculoTotalesService from './feedAndUserFeed.service';
import { Rabbit } from 'src/rabbitmq/rabbit.server';
import moment from 'moment';

class FeedService {

  async getFeedByArticle(articleId: string) {

    calculoTotalesService.calculateTotalsFeed(articleId);
    const feed: any = await feedRepository.getFeedByArticle(articleId);
    if (!feed || Object.keys(feed).length === 0) {
      throw new CustomError('No se han encontrado Feeds para el artículo '+articleId, 404);
    }
    return { ...feed._doc};
  }


}

export default new FeedService();
