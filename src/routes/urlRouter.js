import Router from 'express';
import { deleteEntry, getShort, shorten } from '../controllers/urlController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import { validateTokenMiddleware } from '../middlewares/validateTokenMiddleware.js';
import urlSchema from '../schemas/urlSchema.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', validateSchemaMiddleware(urlSchema), validateTokenMiddleware, shorten);
urlRouter.get('/urls/:shortUrl', getShort);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteEntry);

export default urlRouter;