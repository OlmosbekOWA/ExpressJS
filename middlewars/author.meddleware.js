
import postModel from "../models/post.model.js";
import BaseError from "../errors/base.error.js";

export default async function authorMiddleware(req, res, next) {
    try {
        const post = await postModel.findById(req.params.id);
        const postAuthorId = req.user.id;

        if (post.author.toString() !== postAuthorId) {
            return next(BaseError.BadRequest("You are not the author of this post"));
        }
        next();
    } catch (error) {
        return next(BaseError.BadRequest("Only authors can edit or delete their posts"));
    }
}