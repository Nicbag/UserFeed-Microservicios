import { Feed } from '@models/entities/feed';
import { Request } from 'express';

export interface RequestCreateFeed extends Request {
  body: Feed;
}

export interface RequestUpdateFeed extends Request {
  params: {
    article_id: string;
  };
  body: UpdateFeed;
}

export interface UpdateFeed extends Partial<Omit<Feed, 'article_id'>> {}
