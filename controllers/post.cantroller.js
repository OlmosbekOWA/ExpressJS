import postService from "../server/post.service.js";
class PostCantroller {
  //Get
  async getAll(req, res) {
    try {
      const get = await postService.getAll();
      res.status(200).json(get);
    } catch (error) {
      console.error("GET xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
  //Post
  async posts(req, res) {
    try {
      const { title, body } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          message: "Title va body majburiy maydonlar!",
        });
      }

      const post = await postService.create(req.body);
      res.status(201).json(post);
    } catch (error) {
      console.error("Post yaratish xatosi:", error.message);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedPost = await postService.delete(id);

      res.status(200).json(deletedPost);
    } catch (error) {
      console.error("Delete xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
  async edit(req, res){
    try{
        const { id } = req.params;
        const updateData = req.body;

        const editPost = await postService.edit(updateData, id)

        res.status(200).json(editPost);
        

    }catch (error) {
      console.error("Delete xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }

  async getOne(req, res){
    try{
        const { id } = req.params;
        

        const oneUser = await postService.getOne(id)

        res.status(200).json(oneUser);
        

    }catch (error) {
      console.error("Delete xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
}

export default new PostCantroller();
