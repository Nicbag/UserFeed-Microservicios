import { Feed } from '@models/entities/feed';
import { UserFeed } from '@models/entities/userFeed';
import { Request } from 'express';

export interface RequestCreateFeed extends Request {
  body: Feed;
}

export interface RequestUpdateUserFeed extends Request {
  params: {
    article_id: string;
  };
  body: UpdateUserFeed;
}

export interface UpdateUserFeed {
  star?: number;  
  review?: string; 
}

