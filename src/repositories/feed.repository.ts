import { Feed } from '@models/entities/feed';
import ModelFeed from '@models/feed';
import { UpdateFeed } from '@dtos/feed.dto';

class FeedRepository {
  async getPriceByProduct(articleId: string) {
    const today = new Date();
    return ModelFeed.findOne({
      article_id: articleId,
      start_date: { $lte: today },
      end_date: { $eq: null },
    });
  }

  async create(payload: Feed) {
    return ModelFeed.create(payload);
  }

  async updateById(id: any, payload: UpdateFeed) {
    return ModelFeed.updateOne({ _id: id }, payload, { new: true });
  }

  async updateByarticleId(articleId: string, payload: UpdateFeed) {
    return ModelFeed.findOneAndUpdate({ article_id: articleId }, payload, { new: true });
  }

  async deleteByarticleId(articleId: string) {
    return ModelFeed.findOneAndDelete({ article_id: articleId });
  }

  async getManyProducts(articleIds: string[]) {
    const today = new Date();
    return ModelFeed.find({ article_id: { $in: articleIds }, start_date: { $lte: today }, end_date: { $eq: null } });
  }
}

export default new FeedRepository();
