import { CustomError } from '@config/errors/error.model';
import { Price } from '@models/entities/feed';
import priceRepository from '@repositories/feed.repository';
import { UpdatePrice } from '@dtos/feed.dto';
import discountService from './discount.service';
import { Rabbit } from 'src/rabbitmq/rabbit.server';
import moment from 'moment';

class PriceService {
  async getPriceByProduct(articleId: string) {
    const price: any = await priceRepository.getPriceByProduct(articleId);
    if (!price) {
      throw new CustomError('Product not found', 404);
    }
    const { specialPrice, discounts } = await discountService.calculateDiscountToArticleId(articleId, price.price);
    return { ...price._doc, price_with_discount: specialPrice, discounts };
  }

  private validateDateRange(start_date: Date, end_date: Date) {
    const today = moment();
    if (start_date && end_date) {
      const startDate = moment(start_date);
      const endDate = moment(end_date);
      if (!today.isBetween(startDate, endDate, undefined, '[]')) {
        throw new CustomError('The current date is not within the allowed range', 400);
      }
    } else {
      throw new CustomError('start_date and end_date are required', 400);
    }
  }

  async createUpdatePrice(payload: Price) {
    // this.validateDateRange(payload.start_date, payload.end_date);
    const existPrice = await priceRepository.getPriceByProduct(payload.article_id);
    if (existPrice) {
      await priceRepository.updateById(existPrice._id, { end_date: new Date() });
    }
    payload.start_date = new Date();
    if (!payload.price) {
      throw new CustomError('Price is required', 400);
    }
    const priceCreated = await priceRepository.create(payload);
    await Rabbit.getInstance().sendMessage(priceCreated);
    return priceCreated;
  }

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
}

export default new PriceService();
