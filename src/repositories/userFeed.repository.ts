import { UserFeed } from '@models/entities/userFeed';
import ModelUserFeed from '@models/userFeed';
import { UpdateFeed } from '@dtos/feed.dto';

class FeedRepository {
  async getUserFeedByArticle(articleId: string) {
    return ModelUserFeed.find({
      article_id: articleId,
      stars: { $ne: null }
    });
  }

  async create(payload: UserFeed) {
    return ModelUserFeed.create(payload);
  }

  /*
  async updateById(id: any, payload: UpdateFeed) {
    return ModelUserFeed.updateOne({ _id: id }, payload, { new: true });
  }
    */

}

export default new FeedRepository();