export default class postDto{
    title
    id
    body
    picture

    constructor(model){
        this.title = model.title
        this.id = model._id
        this.body = model.body
        this.picture = model.picture
    }

}