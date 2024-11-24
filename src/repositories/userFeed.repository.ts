import { UserFeed } from '@models/entities/userFeed';
import ModelUserFeed from '@models/userFeed';
import { UserFeedDocument } from '@models/entities/userFeed';


class FeedRepository {
  async getUserFeedByArticle(articleId: string): Promise<UserFeedDocument[]> {
    const userFeeds = await  ModelUserFeed.find({
      article_id: articleId,
      stars: { $ne: null }
    });
    return userFeeds || []
  }
  

  async getUserFeedByUserIdPending(user_id: string):Promise<UserFeedDocument[]> {
    const userFeeds = await ModelUserFeed.find({
      creation_user: user_id,
      stars: { $eq: null }
    });
    return userFeeds || []
  }

  async create(payload: UserFeed) {
    return ModelUserFeed.create(payload);
  }

  async getUserFeedByUserIdAndArticleIdPending(user_id:string,article_id:string): Promise<UserFeedDocument | null>{
    return ModelUserFeed.findOne({
      creation_user: user_id,
      article_id: article_id,
      stars: { $eq: null }
    });
  }

  async getUserFeedByArticleIdAndUserId(user_id:string,article_id:string): Promise<UserFeedDocument|null>{
    return ModelUserFeed.findOne({
      creation_user: user_id,
      article_id: article_id
    });
  }

  /*
  async updateById(id: any, payload: UpdateFeed) {
    return ModelUserFeed.updateOne({ _id: id }, payload, { new: true });
  }
    */

}

export default new FeedRepository();