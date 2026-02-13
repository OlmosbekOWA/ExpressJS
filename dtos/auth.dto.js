export default class AuthDto{
    gmail

    id
    isActivated

    constructor(model){
        this.gmail = model.gmail
        this.id = model._id
        this.isActivated = model.isActivated
    }
}