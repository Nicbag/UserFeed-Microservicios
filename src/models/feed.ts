import { model, Schema } from 'mongoose';
import { FeedDocument } from './entities/feed';

export const FeedSchema = new Schema(
  {
    article_id: {
      type: Number,
      required: true,
    },
    total_stars: {
      type: Number,
      required: false,
    },
    review_quantity: {
      type: Number,
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
    collection: 'feeds',
    timestamps: true, 
  }
);

const modelFeed = model<FeedDocument>('Feed', FeedSchema);
export default modelFeed;