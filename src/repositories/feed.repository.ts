import { Feed } from '@models/entities/feed';
import ModelFeed from '@models/feed';
import { UpdateFeed } from '@dtos/feed.dto';

class FeedRepository {
  async getFeedByArticle(articleId: string) {
    return ModelFeed.findOne({
      article_id: articleId
    });
  }

  async create(payload: Feed) {
    return ModelFeed.create(payload);
  }

  async updateById(id: any, payload: UpdateFeed) {
    return ModelFeed.updateOne({ _id: id }, payload, { new: true });
  }

}

export default new FeedRepository();
