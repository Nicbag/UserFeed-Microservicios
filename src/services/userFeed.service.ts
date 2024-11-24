import { CustomError } from '@config/errors/error.model';
import { UserFeedDocument } from '@models/entities/userFeed';
import userFeedRepository from '@repositories/userFeed.repository';
import { UpdateUserFeed } from '@dtos/feed.dto';
import calculoTotalesService from './feedAndUserFeed.service';
import { Rabbit } from 'src/rabbitmq/rabbit.server';

class UserFeedService {

  async getUserFeedByArticle(articleId: string) {
    const userFeeds: any = await userFeedRepository.getUserFeedByArticle(articleId);
    if (!userFeeds || Object.keys(userFeeds).length === 0) {
      throw new CustomError('No se han encontrado reseñas para el artículo '+articleId, 404);
    }
    return { ...userFeeds._doc};
  }

  async getUserFeedByUserIdPending(user_id: string) {
    const userFeeds: UserFeedDocument[] =  await userFeedRepository.getUserFeedByUserIdPending(user_id);
    if (!userFeeds || Object.keys(userFeeds).length === 0) {
      throw new CustomError('No se han encontrado reseñas pendientes para el usuario '+user_id, 404);
    }
    return { ...userFeeds};
  }

  async reviewArticle(userFeedReseñado: UpdateUserFeed, article_id: string,user_id: string) {
    if(userFeedReseñado.star == null || userFeedReseñado.star == undefined){
      throw new CustomError('Para reseñar se debe puntuar', 400);
    }
    if(userFeedReseñado.star > 5 || userFeedReseñado.star<1){
      throw new CustomError('La puntuación debe ser entre 1 y 5', 400);
    }
    //Buscamos el userFeed del usuario logueado para el artículo seleccionado
    const userFeed: UserFeedDocument | null =  await userFeedRepository.getUserFeedByUserIdAndArticleIdPending(user_id,article_id);
    if (!userFeed || Object.keys(userFeed).length === 0) {
      throw new CustomError('No se han encontrado reseñas pendientes para el usurio '+user_id +" en el artículo "+article_id, 404);
    }

    // Actualizar los campos de `userFeed` con los datos del DTO
      userFeed.stars = userFeedReseñado.star;

    if (userFeedReseñado.review !== undefined) {
      userFeed.review = userFeedReseñado.review;
    }

    // Guardar los cambios en la base de datos
    const updatedUserFeed = await userFeed.save();

    calculoTotalesService.calculateTotalsFeed(article_id);

    // Retornar el objeto actualizado
    return { ...updatedUserFeed };
  }

}

export default new UserFeedService();