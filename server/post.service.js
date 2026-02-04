import postModel from "../models/post.model.js";
class PostService {
    async create (post){
        const newPost = await postModel.create(post);

        return newPost
    }
    async getAll (){
        const allPosts = await postModel.find();
        return allPosts
    }

    async delete (id){
        const post = await postModel.findByIdAndDelete(id)
        return post
    }

    async edit(post, id){
        if(!id){
            throw new Error("ID not found")
        }
        const updateData = await postModel.findByIdAndUpdate(id, post, { new: true })

        return updateData
    }

    async getOne (id){
        
        const oneData = await postModel.findById(id)
        
        return oneData

    }
}


export default new PostService()