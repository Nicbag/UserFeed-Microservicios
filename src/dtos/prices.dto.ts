import { Price } from '@models/entities/feed';
import { Request } from 'express';

export interface RequestCreatePrice extends Request {
  body: Price;
}

export interface RequestUpdatePrice extends Request {
  params: {
    article_id: string;
  };
  body: UpdatePrice;
}

export interface RequestGetDeletePrice extends Request {
  params: {
    article_id: string;
  };
}

export interface UpdatePrice extends Partial<Omit<Price, 'article_id'>> {}
