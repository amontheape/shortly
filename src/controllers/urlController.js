import { v4 as uuid } from 'uuid';
import { connection } from '../database.js';

export async function shorten(req, res) {
  const { url } = req.body;
  const shortUrl = uuid().split('-')[0];
  const { user } = res.locals;
  console.log(user);
  try {
    await connection.query(`
      INSERT INTO urls ("shortUrl", url, "userId")
      values($1, $2, $3)
    `, [shortUrl, url, user.id]);

    return res.status(201).send(shortUrl);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }  
}

export async function getShort(req, res) {

}