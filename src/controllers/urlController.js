import { v4 as uuid } from 'uuid';
import { connection } from '../database.js';

export default async function shorten(req, res) {
  // const { url } = req.body;
  const shortUrl = uuid();

  return res.status(201).send(shortUrl);
}