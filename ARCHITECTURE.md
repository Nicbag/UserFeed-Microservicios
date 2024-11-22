## Microservicio de User Feed

### *Casos de uso*

#### CU: Realizar Reseña de artículo
- Precondicion: El artículo ya fue comprado por el usuario 
- Camino normal:
	- Al reseñar un artículo, el servicio de User Feed recibe un mensaje. En la validación de la puntuación, el puntaje quedará dentro de los mínimos(1) y máximos(5) y el mismo es un número entero y no es opcional
    - Al reseñar un artículo también se puede agregar un comentario, el mismo es opcional
	- Buscar el user_feed del usuario para ese artículo y colocar puntuación realizada y comentario si se agregó
- Caminos alternativos:
	- Si la puntuación no está dentro del mínimo y máximo, largar excepción controlada.
    - Si la puntuación contiene decimales, truncar para que quede un entero
    - Si no coloca puntuación largar excepción controlada
    - Si no existe el user_feed largar excepción controlada porque el artículo no fue comprado

#### CU: Consultar reseñas(user_feed) de un artículo
- Precondicion: El artículo ya ha sido comentado por algún usuario
- Camino normal:
	- Al ingresar en un articulo, además de visualizar la información del mismo se debe poder visualizar todos los comentarios que se le han realizado al mismo junto con la puntuación 
#### CU: Calcular totales de puntuación de un artículo y cantidad de comentarios
- Precondicion: El artículo es reseñado  por algún usuario
- Camino normal:
	- Al calcular los totales se buscan todos user_feed de un artículo que contengan puntuaciones(stars) y/o comentarios(review)
	- Se realiza el cálculo del total, el valor se guarda en el campo "totalStars" del feed del artículo en cuestión y la cantidad de reseñas en el campo(reviewQuantity)
- Caminos alternativos:
	- Si el promedio es menor al mínimo de puntuación se coloca la puntuación mínima
- Notas:
    -Se ejecuta en el Consultar feed y cuando hago una reseña (ambos casos async)

#### CU: Consultar feed de un artículo
- Precondición: Que el artículo haya sido comprado al menos una vez 
- Camino normal:
    - Al consultar el feed de un articulo en particular se obtienen los totales de puntuación(totalStars) y cantidad de user_feed comentados(reviewQuantity)
- Caminos alternativos:
    - Si el artúclo no existe largar excepción controlada

#### CU: Crear userFeed (rabbit)
- Precondición: Que se compre un artículo y se genere una orden
- Camino normal:
    - Al estar escuchando el servicio de órdenes al crear una orden de un artículo para un usuario se crea el user_feed correspondiente para ese usuario y el artículo.
- Caminos alternativos:
    - Si el artúclo ya fue comprado anteriormente por el usuario no se crea el userFeed
    - Si no existe ninguna compra para el arículo, la primera compra además del userFeed correspondiente crea el Feed del artículo

#### CU: Consultar userFeed pendientes de un usuario
- Precondición: Que el usuario no haya reseñado algún articulo comprado
- Camino normal:
    - Al consultar se obtienen todos los userFeed sin reseñar según el id del usuario logeado

### *Modelo de datos*


**Feed**
id
articleId
totalStars
reviewQuantity -> de los que existe puntuacion 
creationDate
updateDate

**User_Feed**
id
feedId
articleId
creationUser
stars
review
creationDate
updateDate


### *Interfaz REST*


**Consulta de feed de un artículo**
`GET /v1/feedService/feed/{articleId}` 


*Headers*
Authorization: Bearer token

*Response*
`200 OK` si se ha comprado al menos una vez el artículo.
```json
{
    "id": 91218,
    "articleId": 91218,
    "totalStars": 75,
    "reviewQuantity":12,
    "creationDate": 165947859374,
    "updateDate":165947859374
}
```

`404 NOT FOUND` si no existen compras para ese artículo


**Consulta de user_feed de un artículo**
`GET /v1/feedService/user_feed/{articleId}` 

*Headers*
Authorization: Bearer token

*Response*
`200 OK` si existe al menos un user_feed reseñado
```json
[
    {
    "id": 1,
    "feedId":23,
    "articleId": 1,
    "creationUser":91218,
    "stars": 4,
    "review":"El artículo es muy bueno",
    "creationDate": 165947859374,
    }
]
```

**Consulta de user_feed sin reseñar del id del usuario logeado**
`GET /v1/feedService/user_feed/` 

*Headers*
Authorization: Bearer token

*Response*
`200 OK` si existe al menos un user_feed sin reseñar
```json
[
    {
    "id": 1,
    "feedId":23,
    "articleId": 1,
    "creationUser":91218,
    "stars": null,
    "review":null,
    "creationDate": 165947859374,
    "updateDate": 165947859374
    }
]
```

`404 NOT FOUND` si no existen user_feed sin reseñar

**Reseñar artículo**
`PUT /v1/feedService/user_feed/{articleId}` 

*Headers*
Authorization: Bearer token

*Body*
```json
{
    "articleId":"91218",
    "stars": 3,
    "review": "El artículo es novedoso"
}
```

*Response*
`200 OK` si se creó ek user_feed exitosamente
```json
{
    "id":100,
    "feedId":24,
    "articleId": 2,
    "creationUser":1234,
    "stars":3,
    "review":"El artículo es novedoso",
    "creationDate": 165947859374,
    "updateDate": 165947859374,
}
```

`404 NOT FOUND` si no existe el Feed con el articleId indicado

### *Interfaz asincronica (rabbit)*

**Creaciones de userFeed y/o Feed**
- Escuchar el servicio de order para crear los user_Feed y después se edita con la putuacion y comentario. En caso de que sea la priumera compra tambien crea el Feed de ese articulo
- Recibe para hacer el flujo `userFeed-create`

```json
{
	"articleId": 91218,
    "user":912,
	"referenceId": 43759834
}
```
*response*
-Responde con el resultado de las creaciones en feed en fanout `userFeed-create`
```json
{
    "id": 91218,
    "feedId":23432,
    "articleId": 91218,
    "creationUser":912,
    "stars": null,
    "review":null,
    "creationDate": 165947859374
}
```

#### Flujo de Trabajo para Creaciones de userFeed y/o Feed

1. **Detección de Compra en `orderService`**
   - El `orderService` detecta que un usuario ha realizado una compra y envía un mensaje al `feedService` a través de la cola `feed-total`.

2. **Creación o Actualización de `userFeed` en `feedService`**
   - El `feedService` recibe el mensaje de la compra.
   - Crea un registro `userFeed` para el artículo correspondiente en base a la información recibida.

3. **Creación de `Feed` Inicial (si es necesario)**
   - Si es la primera compra del artículo, el `feedService` crea un registro inicial `Feed` para ese artículo.

4. **Cálculo de Totales en `feedService`**
   - El `feedService` calcula los totales relacionados al artículo:
     - `totalStars`: La puntuación acumulada de todos los userFeed sobre el artículo.
     - `reviewQuantity`: La cantidad total de registros `userFeed` asociados al artículo, que representan la cantidad de reseñas REALIZADAS.


