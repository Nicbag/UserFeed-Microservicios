import { CustomError } from '@config/errors/error.model';
import { UserFeed, UserFeedDocument } from '@models/entities/userFeed';
import { Feed, FeedDocument } from '@models/entities/feed';
import userFeedRepository from '@repositories/userFeed.repository';
import feedRepository from '@repositories/feed.repository';
import { OrderMessage } from '@dtos/feed.dto';
import { now } from 'mongoose';

class FeedAndUserFeedService {

    async calculateTotalsFeed(article_id: string){
        const userFeeds: UserFeedDocument[] = await userFeedRepository.getUserFeedByArticle(article_id);
        if (!userFeeds || Object.keys(userFeeds).length === 0) {
          throw new CustomError('No se han encontrado reseñas para el artículo '+article_id, 404);
        }
        // Sumar los valores de "stars" y contar los registros
        const totalStars = userFeeds.reduce((acc, userFeed) => acc + (userFeed.stars ?? 0), 0);
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

    async newOrderHandler(orderData: OrderMessage){
        // Iteramos sobre la lista de artículos
        const user_id = orderData.user_id;
        for (const article of orderData.articles) {
            const { article_id, quantity } = article;
    
            // Validar que los datos del artículo sean correctos
            if (!article_id || quantity <= 0) {
            throw new CustomError(`Artículo inválido en la orden: ${JSON.stringify(article)}`, 400);
            }
            //Veo si existe el feed
            let feed: FeedDocument | null = await feedRepository.getFeedByArticle(article_id);
        
            if(!feed){
                const newFeed : Feed = {
                    article_id: article_id,
                    review_quantity: 0,
                    total_stars: 0,
                    creation_date: now(),
                    update_date: null

                }
                feed = await feedRepository.create(newFeed);
            }
            

            // Buscar o crear el UserFeed para el usuario logueado
            let userFeed: UserFeedDocument | null = await userFeedRepository.getUserFeedByArticleIdAndUserId(user_id,article_id);
            if(userFeed) return;

            // si no se encuentra se crea
            
            const newUserFeed : UserFeed = {
                feed_id: feed?.id,
                article_id: article_id,
                creation_user: user_id,
                stars: null,
                review: null,
                creation_date: now(),
                update_date: null
                
            };

            userFeedRepository.create(newUserFeed);
            console.log("Finalizó");
        }
    }   
}

export default new FeedAndUserFeedService();