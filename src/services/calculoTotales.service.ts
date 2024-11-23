import { CustomError } from '@config/errors/error.model';
import { UserFeedDocument } from '@models/entities/userFeed';
import { FeedDocument } from '@models/entities/feed';
import userFeedRepository from '@repositories/userFeed.repository';
import feedRepository from '@repositories/feed.repository';
import { now } from 'mongoose';

class CaulculoTotales {

    async calcularTotalesFeed(article_id: string){
        const userFeeds: UserFeedDocument[] = await userFeedRepository.getUserFeedByArticle(article_id);
        if (!userFeeds || Object.keys(userFeeds).length === 0) {
          throw new CustomError('No se han encontrado reseñas para el artículo '+article_id, 404);
        }
        // Sumar los valores de "stars" y contar los registros
        const totalStars = userFeeds.reduce((acc, userFeed) => acc + userFeed.stars, 0);
        const reviewQuantity = userFeeds.length;

        // Buscar el feed del artículo
        const feed: FeedDocument | null = await feedRepository.getFeedByArticle(article_id);

        // Verificar si el feed existe
        if (!feed) {
            throw new CustomError('No se encontró el feed para el artículo ' + article_id, 404);
        }

        // Actualizar el feed con los nuevos valores
        feed.total_stars = totalStars;
        feed.review_quantity = reviewQuantity;
        feed.update_date= now();

        feed.save

    }
}

export default new CaulculoTotales();