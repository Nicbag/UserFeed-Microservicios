import { model, Schema } from 'mongoose';
import { UserFeedDocument } from './entities/userFeed';

export const UserFeedSchema = new Schema(
  {
    feed_id: {
      type: String,
      required: true,
    },
    article_id: {
        type: String,
        required: true,
    },
    creation_user: {
        type: String,
        required: true,
    },
    stars: {
      type: Number,
      required: false,
    },
    review: {
      type: String,
      required: false,
    },
    creation_date: {
      type: Date,
      required: true,
    },
    update_date: {
      type: Date,
      required: false,
    },
  },
  {
    collection: 'userFeeds',
    timestamps: true, 
  }
);

const modelUserFeed = model<UserFeedDocument>('UserFeed', UserFeedSchema);
export default modelUserFeed;