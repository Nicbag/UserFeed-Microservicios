import { CustomError } from '@config/errors/error.model';
import { Feed } from '@models/entities/feed';
import feedRepository from '@repositories/feed.repository';
import { Rabbit } from 'src/rabbitmq/rabbit.server';
import moment from 'moment';

class FeedService {

  async getFeedByArticle(articleId: string) {

    //antes de buscar o en algun momento hay que hacer el caluclo de los totales
    const feed: any =  feedRepository.getFeedByArticle(articleId);
    if (!feed) {
      throw new CustomError('No se han encontrado Feeds para el artículo '+articleId, 404);
    }
    return { ...feed._doc};
  }

  /*
  async createUpdatePrice(payload: Feed) {
    const existPrice = await feedRepository.getPriceByProduct(payload.article_id);
    if (existPrice) {
      await feedRepository.updateById(existPrice._id, { end_date: new Date() });
    }

    if (!payload.price) {
      throw new CustomError('Price is required', 400);
    }
    const priceCreated = await feedRepository.create(payload);
    await Rabbit.getInstance().sendMessage(priceCreated);
    return priceCreated;
  }
/*
  async getManyProducts(articleIds: string[]) {
    const products = await priceRepository.getManyProducts(articleIds);
    if (!products) {
      return [];
    }
    const promises = products.map(async (p: any) => {
      const { specialPrice, discounts } = await discountService.calculateDiscountToArticleId(p.article_id, p.price);
      return { ...p._doc, price_with_discount: specialPrice, discounts };
    });
    return Promise.all(promises);
  }
    */
}

export default new FeedService();
