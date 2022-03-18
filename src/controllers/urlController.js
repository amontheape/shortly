import { v4 as uuid } from 'uuid';
import { connection } from '../database.js';

export async function shorten(req, res) {
  const { url } = req.body;
  const shortUrl = uuid().split('-')[0];
  const { user } = res.locals;

  try {
    await connection.query(`
      INSERT INTO urls ("shortUrl", url, "visitCount", "userId")
      values($1, $2, $3, $4)
    `, [shortUrl, url, 0, user.id]);

    return res.status(201).send(shortUrl);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }  
}

export async function getShort(req, res) {
  const { shortUrl: param } = req.params;

  try {
    const { rows: [shortened] } = await connection.query(`
      SELECT id, "shortUrl", url, "visitCount"
      FROM urls WHERE urls."shortUrl"=$1
    `, [param]);

    if(!shortened) {
      return res.sendStatus(404);
    }

    const { id, shortUrl, url, visitCount } = shortened;
    
    await connection.query(`
      UPDATE urls
        SET "visitCount"=$1
        WHERE id=$2
    `, [visitCount + 1, id]);

    return res.status(200).send({id, shortUrl, url});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function deleteEntry(req, res) {
  const { id: param } = req.params;
  const { user } = res.locals;

  try {
    const { rows: [urls] } = await connection.query(`SELECT * FROM urls WHERE urls.id=$1`, [param]);

    if ( urls?.userId !== user.id || !urls ) {
      return res.sendStatus(401);
    }

    await connection.query(`DELETE FROM urls WHERE urls.id=$1`, [param]);
    return res.sendStatus(204);

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}