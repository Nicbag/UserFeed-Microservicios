import { Document } from 'mongoose';

export interface UserFeedDocument extends UserFeed, Document {}

export interface UserFeed {
  feed_id: number;
  article_id: number;
  creation_user: number;
  stars: number;
  review: string;
  creation_date: Date;
  update_date: Date;  
}