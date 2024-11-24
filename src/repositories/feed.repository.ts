import { Feed, FeedDocument } from '@models/entities/feed';
import ModelFeed from '@models/feed';

class FeedRepository {
  async getFeedByArticle(articleId: string): Promise<FeedDocument| null> {
    return ModelFeed.findOne({
      article_id: articleId
    });
  }

  async create(payload: Feed): Promise<FeedDocument | null> {
    return ModelFeed.create(payload);
  }

}

export default new FeedRepository();
