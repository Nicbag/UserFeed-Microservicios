import { Document } from 'mongoose';

export interface UserFeedDocument extends UserFeed, Document {
  _doc: UserFeed;
}

export interface UserFeed {
  feed_id: string;
  article_id: string;
  creation_user: string;
  stars: number | null;
  review: string | null;
  creation_date: Date;
  update_date: Date | null;  
}