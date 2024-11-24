import { Document } from 'mongoose';

export interface FeedDocument extends Feed, Document {}

export interface Feed {
  article_id: string;
  total_stars: number;
  review_quantity: number;
  creation_date: Date;
  update_date: Date | null;  
}

