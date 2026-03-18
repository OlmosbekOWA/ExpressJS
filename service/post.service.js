import postDto from "../dtos/post.dto.js";
import postModel from "../models/post.model.js";
import fileService from "./file.service.js";
import BaseError from "../errors/base.error.js";

class PostService {
  async create(post, picture, author) {
    let fileName = null;

    if (picture) {
      fileName = await fileService.save(picture);
    }

    const newPost = await postModel.create({
      ...post,
      picture: fileName, author
    });
    const postDtos  = new postDto(newPost)
    return postDtos;

  }
  async getAll() {
    const allPosts = await postModel.find().populate("author", "email").sort({ createdAt: -1 });
    return allPosts;
  }

  async delete(id) {
    const post = await postModel.findByIdAndDelete(id);
    return post;
  }

  async edit(post, id) {
    if (!id) {
      throw BaseError.BadRequest("ID not found");
    }
    const updateData = await postModel.findByIdAndUpdate(id, post, {
      new: true,
    });

    return updateData;
  }

  async getOne(id) {
    const oneData = await postModel.findById(id);

    return oneData;
  }
}

export default new PostService();
